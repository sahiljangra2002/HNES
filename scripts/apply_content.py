"""One-time content update: add real NGO photos/news and President info."""
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

# ---------- 1. Blog / News posts ----------
posts = [
    {
        "id": _id(),
        "slug": "voluntary-blood-donation-camp-june-2026",
        "title": "Voluntary blood donation camp on the eve of World Blood Donor Day",
        "excerpt": "Join us on Saturday, 13 June 2026 at JJ Blood Centre, Bahadurgarh for a voluntary blood donation camp led by our President, Geeta Deroliya. One unit of your blood can save a life.",
        "content": "On the eve of World Blood Donor Day, Human & Natural Environment Society is organising a voluntary blood donation camp (Swaichhik Raktdaan Shivir) in Bahadurgarh, Haryana.\n\nCamp details:\nDate: Saturday, 13 June 2026\nTime: 9:00 AM to 3:00 PM\nVenue: JJ Blood Centre, near Metro Pillar No. 792, Bahadurgarh, Haryana\n\nThe camp is being led by our President, Geeta Deroliya (Teacher), who has appealed to residents, students and members of the community to come forward: 'Raktdaan is Mahadaan - one unit of your blood can save someone's life. Please give twenty minutes of your day for someone you may never meet.'\n\nDonation is safe, voluntary and life-giving. All donors will be screened by qualified staff at the blood centre, and refreshments will be provided after donation.\n\nFor queries and registration, contact: 8595765789. Walk-in donors are equally welcome.",
        "cover_image": f"{U}/poster-blood-donation-camp.jpg",
        "category": "Events",
        "tags": ["blood donation", "health", "bahadurgarh"],
        "author": "HNES Team",
        "published": True,
        "created_at": "2026-06-01T09:00:00+00:00",
        "updated_at": "2026-06-01T09:00:00+00:00",
    },
    {
        "id": _id(),
        "slug": "student-receives-51000-education-support",
        "title": "Student receives Rs 51,000 education support - in the news",
        "excerpt": "A B.Pharma student, Pooja, received Rs 51,000 in financial assistance for her education at a ceremony in Bahadurgarh attended by our members. The initiative was covered by the local press.",
        "content": "Education support reached a deserving student this month. At a meeting held at Devkarn Dharamshala in Bahadurgarh, Pooja, a B.Pharma student from an economically weaker family, was presented with financial assistance of Rs 51,000 to support her studies.\n\nThe assistance was presented as part of an ongoing effort to help poor and economically weaker students of the community continue their education without interruption. Community elders, trustees and social workers - including our President, Geeta Deroliya - were present on the occasion and blessed the student for her future.\n\nThe event was covered by local newspapers, whose reporting is reproduced in the image alongside.\n\nHuman & Natural Environment Society believes that no capable student should have to abandon studies for want of money. If you know a student who needs such support, or if you would like to sponsor a student's education, please reach out through our Contact page.",
        "cover_image": f"{U}/photo-cheque-presentation.jpg",
        "category": "Media Coverage",
        "tags": ["education", "welfare", "media"],
        "author": "HNES Team",
        "published": True,
        "created_at": "2026-05-10T09:00:00+00:00",
        "updated_at": "2026-05-10T09:00:00+00:00",
    },
    {
        "id": _id(),
        "slug": "talent-felicitation-ceremony-media-coverage",
        "title": "Honouring young talent: felicitation ceremony covered by the press",
        "excerpt": "Students who excelled in education and sports were honoured with certificates at a grand talent felicitation ceremony at Ravidas Bhawan, Rohtak - an initiative our members proudly supported.",
        "content": "'Honouring talent is the strong foundation of nation-building and a source of inspiration' - that was the message of a grand talent felicitation ceremony (Pratibha Samman Samaroh) held at Ravidas Bhawan, Rohtak, where students who excelled in education and sports were honoured with certificates.\n\nThe ceremony began with the traditional lighting of the lamp by the chief guest, social worker and educationist Sandeep Kataria, who told the gathering that the real strength of the nation lies in its youth and students, and that education and sports are the two main pillars of personality development.\n\nSpeakers emphasised that honouring talented students not only raises their morale but also becomes a source of inspiration for other children. Young awardees were urged to keep working hard with discipline and a positive outlook.\n\nMembers of our society joined the ceremony and congratulated every child on stage. The event received warm coverage in the local press, reproduced in the image above. We remain committed to encouraging education and sports among children in the years ahead.",
        "cover_image": f"{U}/news-talent-felicitation.jpg",
        "category": "Media Coverage",
        "tags": ["education", "children", "media"],
        "author": "HNES Team",
        "published": True,
        "created_at": "2026-04-02T09:00:00+00:00",
        "updated_at": "2026-04-02T09:00:00+00:00",
    },
]

for p in posts:
    if not db.blog_posts.find_one({"slug": p["slug"]}):
        db.blog_posts.insert_one(dict(p))
        print("blog post added:", p["slug"])
    else:
        print("blog post exists:", p["slug"])

# ---------- 2. Gallery items ----------
gallery = [
    {
        "title": "Education support cheque presented to student",
        "category": "Community Events",
        "image_url": f"{U}/photo-cheque-presentation.jpg",
        "caption": "Devkarn Dharamshala, Bahadurgarh",
    },
    {
        "title": "Society members' planning meeting",
        "category": "Community Events",
        "image_url": f"{U}/photo-society-meeting.jpg",
        "caption": "Members discussing upcoming programs",
    },
    {
        "title": "Blood donation camp announcement",
        "category": "Community Events",
        "image_url": f"{U}/poster-blood-donation-camp.jpg",
        "caption": "JJ Blood Centre, Bahadurgarh - 13 June 2026",
    },
    {
        "title": "Talent felicitation ceremony - press coverage",
        "category": "Education",
        "image_url": f"{U}/news-talent-felicitation.jpg",
        "caption": "Ravidas Bhawan, Rohtak",
    },
    {
        "title": "Rs 51,000 education aid - press coverage",
        "category": "Education",
        "image_url": f"{U}/news-student-aid-clipping.jpg",
        "caption": "As reported in the local press",
    },
]

for g in gallery:
    if not db.gallery_items.find_one({"image_url": g["image_url"]}):
        db.gallery_items.insert_one({"id": _id(), "created_at": now(), **g})
        print("gallery item added:", g["title"])
    else:
        print("gallery item exists:", g["title"])

# ---------- 3. Team: real President ----------
president_photo = f"{U}/president-geeta-deroliya.jpg"
existing = db.team_members.find_one({"name": "Geeta Deroliya"})
if not existing:
    placeholder = db.team_members.find_one({"role": {"$regex": "President", "$options": "i"}})
    doc = {
        "name": "Geeta Deroliya",
        "role": "President",
        "bio": "A teacher by profession, Geeta leads Human & Natural Environment Society's education, health and community welfare initiatives, including blood donation camps and student support programs.",
        "photo_url": president_photo,
        "order": 1,
    }
    if placeholder:
        db.team_members.update_one({"id": placeholder["id"]}, {"$set": doc})
        print("team: placeholder president replaced with Geeta Deroliya")
    else:
        db.team_members.insert_one({"id": _id(), "created_at": now(), **doc})
        print("team: Geeta Deroliya added")
else:
    db.team_members.update_one({"id": existing["id"]}, {"$set": {"photo_url": president_photo}})
    print("team: Geeta Deroliya photo updated")

# ---------- 4. Settings: president block for homepage ----------
db.site_settings.update_one(
    {"id": "main"},
    {
        "$set": {
            "org.president_name": "Geeta Deroliya",
            "org.president_role": "Teacher & President, Human & Natural Environment Society",
            "org.president_photo": president_photo,
            "org.president_message": "Since 2016, our society has stood on a simple belief: when we care for nature and for each other, whole communities rise. Every sapling planted, every student supported and every unit of blood donated is a step towards the India we dream of. I invite you to walk with us.",
        }
    },
)
print("settings: president block saved")
print("DONE")
