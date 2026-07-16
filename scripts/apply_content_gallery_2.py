"""One-time content update: add a fresh batch of real NGO event photos to the
gallery (plantation drives with Delhi Police, plant handovers, a voluntary
blood donation camp on International Women's Day, and felicitation /
appreciation ceremonies).

Run this exactly like scripts/apply_content.py, once the images below have
been copied into backend/uploads/:

    python scripts/apply_content_gallery_2.py

It is idempotent - re-running it will not create duplicates.
"""
import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv("/app/backend/.env")
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]


def _id():
    return str(uuid.uuid4())


def now():
    return datetime.now(timezone.utc).isoformat()


U = "/api/uploads"

# ---------- Gallery items ----------
gallery = [
    {
        "title": "Plantation drive at the Delhi Police cyber helpdesk",
        "category": "Plantation Drives",
        "image_url": f"{U}/gallery-plantation-police-helpdesk.jpg",
        "caption": "Saplings handed over with Delhi Police staff and neighbourhood families at the Integrated Helpdesk",
    },
    {
        "title": "Plant gifted between fellow social workers",
        "category": "Plantation Drives",
        "image_url": f"{U}/gallery-plant-handover-social-workers.jpg",
        "caption": "A sapling exchanged as a token of goodwill between community volunteers",
    },
    {
        "title": "Sapling distributed to a local resident",
        "category": "Plantation Drives",
        "image_url": f"{U}/gallery-sapling-distribution-resident.jpg",
        "caption": "Door-to-door sapling distribution in the neighbourhood",
    },
    {
        "title": "Voluntary blood donation camp - International Women's Day",
        "category": "Community Events",
        "image_url": f"{U}/gallery-blood-donation-womens-day.jpg",
        "caption": "Swaichhik Raktdaan Shivir held on 8 March with the Red Cross Society and NSS volunteers",
    },
    {
        "title": "Honoured at a Milan Samaroh community function",
        "category": "Community Events",
        "image_url": f"{U}/gallery-milan-samaroh-honour.jpg",
        "caption": "Our society recognised with a memento at a community Milan Samaroh",
    },
    {
        "title": "Certificate of appreciation presented to the society",
        "category": "Community Events",
        "image_url": f"{U}/gallery-certificate-appreciation.jpg",
        "caption": "A prashasti patra received in recognition of ongoing community service",
    },
    {
        "title": "Community function attended by our volunteers",
        "category": "Community Events",
        "image_url": f"{U}/gallery-community-function-stage.jpg",
        "caption": "Members on stage at a local community celebration",
    },
]

for g in gallery:
    if not db.gallery_items.find_one({"image_url": g["image_url"]}):
        db.gallery_items.insert_one({"id": _id(), "created_at": now(), **g})
        print("gallery item added:", g["title"])
    else:
        print("gallery item exists:", g["title"])

print("DONE")
