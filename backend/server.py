"""Human & Natural Environment Society - website backend (FastAPI + MongoDB)."""
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import (  # noqa: E402
    BackgroundTasks,
    Depends,
    FastAPI,
    File,
    HTTPException,
    Query,
    UploadFile,
)
from fastapi.staticfiles import StaticFiles  # noqa: E402
from fastapi import APIRouter  # noqa: E402
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402
import cloudinary  # noqa: E402
import cloudinary.uploader  # noqa: E402

from auth import create_token, get_current_admin, verify_password  # noqa: E402
from mailer import email_configured, send_notification, submission_email_html  # noqa: E402
from models import DonationInput, LoginInput, NewsletterInput, StatusUpdate, SubmissionInput  # noqa: E402
from seed import seed_database  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# If CLOUDINARY_URL is set (production), uploaded images are stored permanently
# on Cloudinary instead of the local disk, which is wiped on every restart/deploy
# on most hosts. Local disk stays as a fallback for local development.
CLOUDINARY_ENABLED = bool(os.environ.get("CLOUDINARY_URL"))
if CLOUDINARY_ENABLED:
    cloudinary.config(cloudinary_url=os.environ["CLOUDINARY_URL"], secure=True)

app = FastAPI(title="Human & Natural Environment Society API")
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

api = APIRouter(prefix="/api")
admin = APIRouter(prefix="/api/admin")

NO_ID = {"_id": 0}

# Admin-editable content collections exposed through the generic CRUD endpoints
CONTENT_COLLECTIONS = {
    "programs": "programs",
    "blog": "blog_posts",
    "gallery": "gallery_items",
    "team": "team_members",
    "testimonials": "testimonials",
    "milestones": "milestones",
    "careers": "careers",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or str(uuid.uuid4())[:8]


async def unique_slug(coll: AsyncIOMotorCollection, base: str, exclude_id: Optional[str] = None) -> str:
    slug, n = base, 1
    while True:
        query: dict = {"slug": slug}
        if exclude_id:
            query["id"] = {"$ne": exclude_id}
        if not await coll.find_one(query):
            return slug
        n += 1
        slug = f"{base}-{n}"


# --------------------------------------------------------------------------
# Public endpoints
# --------------------------------------------------------------------------
@api.get("/")
async def root() -> dict:
    return {"message": "Human & Natural Environment Society API", "status": "ok"}


@api.get("/settings")
async def get_settings() -> dict:
    settings = await db.site_settings.find_one({"id": "main"}, NO_ID)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings


@api.get("/programs")
async def list_programs() -> List[dict]:
    return await db.programs.find({}, NO_ID).sort("order", 1).to_list(100)


@api.get("/programs/{slug}")
async def get_program(slug: str) -> dict:
    program = await db.programs.find_one({"slug": slug}, NO_ID)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


@api.get("/blog")
async def list_blog(
    search: str = Query("", max_length=100),
    category: str = Query("", max_length=60),
    tag: str = Query("", max_length=60),
    page: int = Query(1, ge=1),
    limit: int = Query(9, ge=1, le=50),
) -> dict:
    query: dict = {"published": True}
    if search:
        safe = re.escape(search)
        query["$or"] = [
            {"title": {"$regex": safe, "$options": "i"}},
            {"excerpt": {"$regex": safe, "$options": "i"}},
            {"content": {"$regex": safe, "$options": "i"}},
        ]
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    total = await db.blog_posts.count_documents(query)
    posts = (
        await db.blog_posts.find(query, NO_ID)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
        .to_list(limit)
    )
    return {"posts": posts, "total": total, "page": page, "pages": max(1, -(-total // limit))}


@api.get("/blog/categories")
async def blog_categories() -> List[str]:
    cats = await db.blog_posts.distinct("category", {"published": True})
    return sorted([c for c in cats if c])


@api.get("/blog/{slug}")
async def get_post(slug: str) -> dict:
    post = await db.blog_posts.find_one({"slug": slug, "published": True}, NO_ID)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    related = (
        await db.blog_posts.find(
            {"published": True, "category": post.get("category"), "slug": {"$ne": slug}}, NO_ID
        )
        .sort("created_at", -1)
        .limit(3)
        .to_list(3)
    )
    return {"post": post, "related": related}


@api.get("/gallery")
async def list_gallery(category: str = Query("", max_length=60)) -> dict:
    query: dict = {}
    if category:
        query["category"] = category
    items = await db.gallery_items.find(query, NO_ID).sort("created_at", -1).to_list(500)
    cats = await db.gallery_items.distinct("category")
    return {"items": items, "categories": sorted([c for c in cats if c])}


@api.get("/team")
async def list_team() -> List[dict]:
    return await db.team_members.find({}, NO_ID).sort("order", 1).to_list(100)


@api.get("/testimonials")
async def list_testimonials() -> List[dict]:
    return await db.testimonials.find({}, NO_ID).sort("order", 1).to_list(50)


@api.get("/milestones")
async def list_milestones() -> List[dict]:
    return await db.milestones.find({}, NO_ID).sort("order", 1).to_list(100)


@api.get("/careers")
async def list_careers() -> List[dict]:
    return await db.careers.find({"active": True}, NO_ID).sort("created_at", -1).to_list(50)


async def _record_email_status(submission_id: str, sub_doc: dict) -> None:
    kind = sub_doc.get("type", "contact").title()
    sent, detail = await send_notification(
        f"New {kind} submission - {sub_doc.get('name', '')}", submission_email_html(sub_doc)
    )
    await db.submissions.update_one(
        {"id": submission_id}, {"$set": {"email_sent": sent, "email_status": detail}}
    )


@api.post("/submissions")
async def create_submission(payload: SubmissionInput, background_tasks: BackgroundTasks) -> dict:
    # Honeypot: silently accept but drop obvious bots
    if payload.website:
        return {"success": True, "message": "Thank you! We will get back to you soon."}
    doc = payload.model_dump(exclude={"website"})
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "status": "new",
            "email_sent": False,
            "email_status": "pending" if email_configured() else "not_configured",
            "created_at": now_iso(),
        }
    )
    await db.submissions.insert_one(dict(doc))
    background_tasks.add_task(_record_email_status, doc["id"], doc)
    messages = {
        "contact": "Thank you for reaching out. Our team will reply within 2-3 working days.",
        "volunteer": "Thank you for volunteering! Our volunteer coordinator will contact you before the next drive.",
        "partner": "Thank you for your interest in partnering with us. Our team will get in touch shortly.",
    }
    return {"success": True, "message": messages.get(payload.type, "Thank you!")}


@api.post("/newsletter")
async def subscribe_newsletter(payload: NewsletterInput) -> dict:
    email = payload.email.lower().strip()
    existing = await db.newsletter_subscribers.find_one({"email": email})
    if existing:
        return {"success": True, "message": "You are already subscribed. Thank you for staying with us!"}
    await db.newsletter_subscribers.insert_one(
        {"id": str(uuid.uuid4()), "email": email, "created_at": now_iso()}
    )
    return {"success": True, "message": "Subscribed! You will receive updates on our drives and impact."}


@api.post("/donations")
async def create_donation(payload: DonationInput) -> dict:
    payment_mode = (os.environ.get("PAYMENT_MODE") or "mock").strip().lower()
    reference = f"MOCK-{uuid.uuid4().hex[:10].upper()}"
    doc = payload.model_dump()
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "reference": reference,
            "payment_mode": payment_mode,
            "status": "demo_recorded" if payment_mode == "mock" else "initiated",
            "created_at": now_iso(),
        }
    )
    await db.donations.insert_one(dict(doc))
    return {
        "success": True,
        "mock": payment_mode == "mock",
        "reference": reference,
        "message": (
            "This is a DEMO donation - no money has been charged. "
            "Online payments will be enabled once the payment gateway keys are configured. "
            "You can donate today via the bank transfer details below."
            if payment_mode == "mock"
            else "Donation initiated."
        ),
    }


# --------------------------------------------------------------------------
# Admin endpoints
# --------------------------------------------------------------------------
@admin.post("/login")
async def admin_login(payload: LoginInput) -> dict:
    user = await db.admin_users.find_one({"email": payload.email.lower().strip()})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["email"], user.get("name", "Admin"))
    return {"token": token, "email": user["email"], "name": user.get("name", "Admin")}


@admin.get("/me")
async def admin_me(current: dict = Depends(get_current_admin)) -> dict:
    return current


@admin.get("/dashboard")
async def admin_dashboard(current: dict = Depends(get_current_admin)) -> dict:
    new_submissions = await db.submissions.count_documents({"status": "new"})
    totals = {
        "programs": await db.programs.count_documents({}),
        "blog_posts": await db.blog_posts.count_documents({}),
        "gallery_items": await db.gallery_items.count_documents({}),
        "team_members": await db.team_members.count_documents({}),
        "careers": await db.careers.count_documents({}),
        "submissions": await db.submissions.count_documents({}),
        "new_submissions": new_submissions,
        "donations": await db.donations.count_documents({}),
        "subscribers": await db.newsletter_subscribers.count_documents({}),
    }
    pipeline = [{"$group": {"_id": None, "sum": {"$sum": "$amount"}}}]
    agg = await db.donations.aggregate(pipeline).to_list(1)
    totals["donations_amount"] = agg[0]["sum"] if agg else 0
    recent = await db.submissions.find({}, NO_ID).sort("created_at", -1).limit(5).to_list(5)
    return {"totals": totals, "recent_submissions": recent, "email_configured": bool(email_configured())}


def _get_collection(ctype: str) -> AsyncIOMotorCollection:
    if ctype not in CONTENT_COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown content type")
    return db[CONTENT_COLLECTIONS[ctype]]


@admin.get("/content/{ctype}")
async def admin_list_content(ctype: str, current: dict = Depends(get_current_admin)) -> List[dict]:
    coll = _get_collection(ctype)
    sort_field = "order" if ctype in ("programs", "team", "milestones", "testimonials") else "created_at"
    direction = 1 if sort_field == "order" else -1
    return await coll.find({}, NO_ID).sort(sort_field, direction).to_list(1000)


@admin.post("/content/{ctype}")
async def admin_create_content(
    ctype: str, payload: dict, current: dict = Depends(get_current_admin)
) -> dict:
    coll = _get_collection(ctype)
    payload.pop("_id", None)
    payload["id"] = str(uuid.uuid4())
    payload["created_at"] = now_iso()
    if ctype in ("programs", "blog") and payload.get("title"):
        base = slugify(payload.get("slug") or payload["title"])
        payload["slug"] = await unique_slug(coll, base)
    if ctype == "blog":
        payload.setdefault("published", True)
        payload["updated_at"] = now_iso()
    await coll.insert_one(dict(payload))
    payload.pop("_id", None)
    return payload


@admin.put("/content/{ctype}/{item_id}")
async def admin_update_content(
    ctype: str, item_id: str, payload: dict, current: dict = Depends(get_current_admin)
) -> Optional[dict]:
    coll = _get_collection(ctype)
    payload.pop("_id", None)
    payload.pop("id", None)
    payload.pop("created_at", None)
    if ctype in ("programs", "blog") and payload.get("title"):
        base = slugify(payload.get("slug") or payload["title"])
        payload["slug"] = await unique_slug(coll, base, exclude_id=item_id)
    payload["updated_at"] = now_iso()
    result = await coll.update_one({"id": item_id}, {"$set": payload})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return await coll.find_one({"id": item_id}, NO_ID)


@admin.delete("/content/{ctype}/{item_id}")
async def admin_delete_content(
    ctype: str, item_id: str, current: dict = Depends(get_current_admin)
) -> dict:
    coll = _get_collection(ctype)
    result = await coll.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True}


@admin.get("/settings")
async def admin_get_settings(current: dict = Depends(get_current_admin)) -> Optional[dict]:
    return await db.site_settings.find_one({"id": "main"}, NO_ID)


@admin.put("/settings")
async def admin_update_settings(
    payload: dict, current: dict = Depends(get_current_admin)
) -> Optional[dict]:
    payload.pop("_id", None)
    payload.pop("id", None)
    payload["updated_at"] = now_iso()
    await db.site_settings.update_one({"id": "main"}, {"$set": payload}, upsert=True)
    return await db.site_settings.find_one({"id": "main"}, NO_ID)


@admin.get("/submissions")
async def admin_list_submissions(
    type: str = Query("", max_length=20),
    status: str = Query("", max_length=20),
    current: dict = Depends(get_current_admin),
) -> List[dict]:
    query: dict = {}
    if type:
        query["type"] = type
    if status:
        query["status"] = status
    return await db.submissions.find(query, NO_ID).sort("created_at", -1).to_list(1000)


@admin.patch("/submissions/{submission_id}")
async def admin_update_submission(
    submission_id: str, payload: StatusUpdate, current: dict = Depends(get_current_admin)
) -> dict:
    result = await db.submissions.update_one({"id": submission_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"success": True}


@admin.delete("/submissions/{submission_id}")
async def admin_delete_submission(
    submission_id: str, current: dict = Depends(get_current_admin)
) -> dict:
    result = await db.submissions.delete_one({"id": submission_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"success": True}


@admin.get("/donations")
async def admin_list_donations(current: dict = Depends(get_current_admin)) -> List[dict]:
    return await db.donations.find({}, NO_ID).sort("created_at", -1).to_list(1000)


@admin.get("/subscribers")
async def admin_list_subscribers(current: dict = Depends(get_current_admin)) -> List[dict]:
    return await db.newsletter_subscribers.find({}, NO_ID).sort("created_at", -1).to_list(5000)


@admin.delete("/subscribers/{subscriber_id}")
async def admin_delete_subscriber(
    subscriber_id: str, current: dict = Depends(get_current_admin)
) -> dict:
    result = await db.newsletter_subscribers.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"success": True}


ALLOWED_UPLOAD_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


@admin.post("/upload")
async def admin_upload(
    file: UploadFile = File(...), current: dict = Depends(get_current_admin)
) -> dict:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_UPLOAD_EXT:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images are allowed")
    content = await file.read()
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 8 MB")
    fname = f"{uuid.uuid4().hex}{ext}"

    if CLOUDINARY_ENABLED:
        result = cloudinary.uploader.upload(
            content, public_id=f"hnes/{uuid.uuid4().hex}", resource_type="image"
        )
        return {"url": result["secure_url"]}

    (UPLOADS_DIR / fname).write_bytes(content)
    return {"url": f"/api/uploads/{fname}"}


app.include_router(api)
app.include_router(admin)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await seed_database(db)
    logger.info("Startup complete - database seeded if empty")


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
