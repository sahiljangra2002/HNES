"""Idempotent database seeding with realistic NGO content.
Only inserts when a collection is empty - never overwrites admin edits.
"""
import logging
import os
import uuid
from datetime import datetime, timezone

from auth import hash_password

logger = logging.getLogger("seed")


def _id() -> str:
    return str(uuid.uuid4())


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


U = "https://images.unsplash.com/"
Q = "?auto=format&fit=crop&w=1200&q=75"

IMG = {
    "hero": "https://images.unsplash.com/photo-1564665619149-8ec9aa5c3d0d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    "planting_hands": "https://images.unsplash.com/photo-1617153817979-283ffdcd52f5?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    "water_field": "https://images.unsplash.com/photo-1601911025787-51f019f1d052?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    "girl_planting": U + "photo-1542601906990-b4d3fb778b09" + Q,
    "forest": U + "photo-1441974231531-c6227db76b6e" + Q,
    "watering": U + "photo-1416879595882-3373a0480b5b" + Q,
    "sapling_hand": U + "photo-1501004318641-b39e6451bec6" + Q,
    "sunbeam": U + "photo-1469474968028-56623f02e42e" + Q,
    "field_sunset": U + "photo-1500382017468-9049fed747ef" + Q,
    "classroom": U + "photo-1497486751825-1233686d5d80" + Q,
    "books_kids": U + "photo-1509062522246-3755977927d7" + Q,
    "kids_india": U + "photo-1544027993-37dbfe43562a" + Q,
    "children_smile": U + "photo-1559027615-cd4628902d4a" + Q,
    "helping_hands": U + "photo-1488521787991-ed7bbaae773c" + Q,
    "volunteers_boxes": U + "photo-1593113598332-cd288d649433" + Q,
    "water_drop": U + "photo-1519455953755-af066f52f1a6" + Q,
    "fox": U + "photo-1474511320723-9a56873867b5" + Q,
    "recycling": U + "photo-1611284446314-60a58ac0deb9" + Q,
    "bins": U + "photo-1604187351574-c75ca79f5807" + Q,
    "community": U + "photo-1532629345422-7515f3d16bb6" + Q,
    "dam": U + "photo-1538300342682-cf57afb97285" + Q,
    "river": U + "photo-1504297050568-910d24c426d3" + Q,
    "mist_forest": U + "photo-1470071459604-3b5ec3a7fe05" + Q,
    "reservoir": U + "photo-1468421870903-4df1664ac249" + Q,
    "leopard": U + "photo-1549366021-9f761d450615" + Q,
    "panda": U + "photo-1564349683136-77e08dba1ef7" + Q,
    "cleanup": U + "photo-1618477388954-7852f32655ec" + Q,
}


DEFAULT_SETTINGS = {
    "id": "main",
    "org": {
        "legal_name": "Human & Natural Environment Society",
        "short_name": "HNES",
        "tagline": "Caring for people. Restoring nature.",
        "mission": "To protect and restore the natural environment of Delhi and beyond while uplifting the communities that depend on it - through tree plantation, water conservation, waste management, education and welfare programs.",
        "vision": "A green, clean and compassionate India where every community lives in harmony with nature and no household is left behind.",
        "story": "Human & Natural Environment Society began in 2016 as a small circle of neighbours in Village Ladpur, North-West Delhi, who were troubled by shrinking green cover, water scarcity and growing waste in their locality. What started as weekend plantation drives grew into a registered society working across North-West Delhi. Since then, our volunteers have planted thousands of trees, brought rainwater harvesting to schools, run cleanliness drives in dozens of colonies, and supported families through education and welfare initiatives.",
        "reg_no": "S/26652/SDM/NW/2016",
        "reg_act": "The Societies Registration Act, 1860",
        "reg_date": "11 August 2016",
        "reg_authority": "Registrar of Societies, District North-West, Govt. of NCT of Delhi",
        "address": "H.No-372, Main Road, Village Ladpur, Landmark Dhobi Wali Gali, Delhi-110081",
        "phone": "+91 98XXXXXX21",
        "email": "hnes2016@gmail.com",
    },
    "impact_stats": [
        {"id": _id(), "label": "Trees Planted", "value": 25000, "suffix": "+", "caption": "across North-West Delhi since 2016"},
        {"id": _id(), "label": "Communities Served", "value": 40, "suffix": "+", "caption": "villages, colonies and school communities"},
        {"id": _id(), "label": "Active Volunteers", "value": 1200, "suffix": "+", "caption": "students, residents and professionals"},
        {"id": _id(), "label": "Years of Service", "value": 9, "suffix": "", "caption": "registered society since August 2016"},
    ],
    "social": {
        "facebook": "https://facebook.com",
        "instagram": "https://instagram.com",
        "twitter": "https://x.com",
        "linkedin": "https://linkedin.com",
        "youtube": "",
    },
    "bank_details": {
        "account_name": "Human & Natural Environment Society",
        "bank_name": "State Bank of India",
        "branch": "Kanjhawala, Delhi",
        "account_number": "Update in Admin Panel",
        "ifsc": "Update in Admin Panel",
        "cheque_payable_to": "Human & Natural Environment Society",
        "note": "After making a bank transfer or sending a cheque, please email the details to hnes2016@gmail.com so we can issue a receipt.",
    },
    "tax_80g_enabled": False,
    "tax_80g_note": "Donations to Human & Natural Environment Society are eligible for tax exemption under Section 80G of the Income Tax Act, 1961.",
    "donation_presets": [500, 1000, 2500, 5000],
    "partners": [
        "Local RWAs of North-West Delhi",
        "Government & MCD Schools",
        "Delhi Development Authority Parks",
        "District Administration, North-West Delhi",
        "Corporate CSR Volunteers",
    ],
    "map_query": "Village Ladpur, Delhi 110081",
    "updated_at": _now(),
}


def _programs():
    return [
        {
            "id": _id(), "slug": "tree-plantation-urban-greening",
            "title": "Tree Plantation & Urban Greening",
            "category": "Environment",
            "summary": "Native-species plantation drives, Miyawaki mini-forests and park restoration across North-West Delhi, with three years of after-care for every sapling.",
            "description": "Delhi loses green cover every year to construction and neglect. Our plantation program works with RWAs, schools and the district administration to bring it back - one neighbourhood at a time.\n\nEvery drive begins with a site survey to choose native, climate-suited species such as neem, peepal, amaltas and jamun. Volunteers prepare pits, plant saplings and - most importantly - commit to a three-year care schedule of watering, mulching and tree-guard maintenance. Survival, not just plantation, is our measure of success.\n\nSince 2016 we have planted over 25,000 saplings with a survival rate above 80%, created two Miyawaki-method mini-forests, and restored green belts in more than 15 parks. Schools that join the program receive a 'Green Campus' toolkit so students can adopt and monitor their own trees.",
            "image_url": IMG["planting_hands"],
            "gallery": [IMG["girl_planting"], IMG["sapling_hand"], IMG["watering"], IMG["forest"]],
            "impact_numbers": [
                {"label": "Saplings planted", "value": "25,000+"},
                {"label": "Survival rate", "value": "80%"},
                {"label": "Parks restored", "value": "15+"},
                {"label": "Mini-forests created", "value": "2"},
            ],
            "featured": True, "order": 1, "created_at": _now(),
        },
        {
            "id": _id(), "slug": "water-conservation",
            "title": "Water Conservation & Rainwater Harvesting",
            "category": "Environment",
            "summary": "Rainwater harvesting in schools, pond revival in rural pockets and water-wise awareness campaigns for a water-stressed Delhi.",
            "description": "North-West Delhi's groundwater table has been falling for decades. Our water program tackles the crisis from two directions: capturing rain where it falls, and changing daily habits.\n\nWe help schools and community buildings install simple rooftop rainwater harvesting systems, then train caretakers to maintain them. In the rural belt around Ladpur and Kanjhawala, volunteers work with village committees to de-silt and revive traditional ponds (johads) that once recharged local wells.\n\nAlongside the hardware, our 'Har Boond Keemti Hai' (Every Drop Counts) campaign reaches households with practical water-saving methods - from tap aerators to greywater reuse for gardens. Five school systems installed so far harvest an estimated 12 lakh litres of rain every monsoon.",
            "image_url": IMG["water_field"],
            "gallery": [IMG["water_drop"], IMG["dam"], IMG["field_sunset"], IMG["forest"]],
            "impact_numbers": [
                {"label": "RWH systems installed", "value": "5"},
                {"label": "Rainwater harvested / yr", "value": "12 lakh L"},
                {"label": "Ponds under revival", "value": "3"},
                {"label": "Households reached", "value": "4,000+"},
            ],
            "featured": True, "order": 2, "created_at": _now(),
        },
        {
            "id": _id(), "slug": "waste-management",
            "title": "Waste Management & Clean Colony Drives",
            "category": "Environment",
            "summary": "Door-to-door segregation awareness, community composting and monthly shramdaan clean-up drives that keep colonies and green spaces waste-free.",
            "description": "Clean surroundings are the first step to a healthy community. Our waste program helps colonies move from 'collect and dump' to 'segregate, compost and recycle'.\n\nVolunteers run door-to-door campaigns teaching two-bin segregation, help RWAs set up community composting pits for wet waste, and connect dry-waste collectors with recyclers so that plastic, paper and metal find their way back into the economy instead of landfills.\n\nEvery month, our shramdaan (voluntary labour) drives bring residents, students and municipal workers together to clean parks, market areas and drains. Since 2018, more than 120 such drives have removed an estimated 60 tonnes of waste - and, more importantly, built local pride that keeps the spaces clean afterwards.",
            "image_url": IMG["recycling"],
            "gallery": [IMG["bins"], IMG["volunteers_boxes"], IMG["community"]],
            "impact_numbers": [
                {"label": "Clean-up drives", "value": "120+"},
                {"label": "Waste diverted", "value": "60 tonnes"},
                {"label": "Colonies segregating", "value": "18"},
                {"label": "Compost pits set up", "value": "25"},
            ],
            "featured": True, "order": 3, "created_at": _now(),
        },
        {
            "id": _id(), "slug": "community-education",
            "title": "Community Education & Awareness",
            "category": "Community Welfare",
            "summary": "Evening study support for first-generation learners, environment clubs in schools, and awareness camps on health, hygiene and citizen rights.",
            "description": "Environmental change begins in classrooms and community halls. Our education program works where the need is greatest - with children of daily-wage families and government school students in North-West Delhi.\n\nVolunteer-led evening study circles help first-generation learners keep pace with schoolwork, while our Eco-Club program in schools turns students into environment ambassadors who run their own campus plantation, waste and water projects.\n\nFor adults, we organise awareness camps on health and hygiene, government welfare schemes, and digital literacy. During winter, the program extends to welfare distribution - blankets, books and stationery - for families who need them most.",
            "image_url": IMG["classroom"],
            "gallery": [IMG["books_kids"], IMG["helping_hands"], IMG["children_smile"]],
            "impact_numbers": [
                {"label": "Children in study circles", "value": "350+"},
                {"label": "School eco-clubs", "value": "12"},
                {"label": "Awareness camps", "value": "75+"},
                {"label": "Welfare kits distributed", "value": "2,500+"},
            ],
            "featured": True, "order": 4, "created_at": _now(),
        },
        {
            "id": _id(), "slug": "wildlife-habitat-protection",
            "title": "Wildlife & Habitat Protection",
            "category": "Environment",
            "summary": "Protecting urban wildlife - birds, pollinators and small mammals - through habitat creation, water bowls in summer, and anti-poaching awareness.",
            "description": "Cities are habitats too. Delhi's birds, bees, butterflies and small mammals are under pressure from vanishing green cover and rising heat. This program gives them a fighting chance.\n\nVolunteers install and maintain water bowls and feeders across parks during Delhi's brutal summers, build nest boxes for sparrows and owls, and plant native flowering species that support pollinators. Our butterfly-and-bee garden patches in five parks now host dozens of pollinator species.\n\nWe also run awareness sessions with school children on co-existing with urban wildlife - from snake rescue helplines to why feeding monkeys harms them - and support the forest department in reporting illegal bird trapping.",
            "image_url": IMG["fox"],
            "gallery": [IMG["leopard"], IMG["mist_forest"], IMG["sunbeam"]],
            "impact_numbers": [
                {"label": "Water points maintained", "value": "200+"},
                {"label": "Nest boxes installed", "value": "450"},
                {"label": "Pollinator gardens", "value": "5"},
                {"label": "Students sensitised", "value": "6,000+"},
            ],
            "featured": False, "order": 5, "created_at": _now(),
        },
    ]


def _blog_posts():
    return [
        {
            "id": _id(), "slug": "1500-saplings-rohini-plantation-drive",
            "title": "1,500 saplings take root in Rohini's community parks",
            "excerpt": "Over 300 volunteers - students, RWA members and corporate teams - joined our largest monsoon plantation drive yet, greening four parks in a single weekend.",
            "content": "The monsoon of 2025 will be remembered fondly by four parks in Rohini. Over one energetic weekend, more than 300 volunteers came together to plant 1,500 native saplings - neem, amaltas, jamun, peepal and gulmohar - in what became our largest single plantation drive since 2016.\n\nThe drive was months in the making. Our field team surveyed each park with horticulture staff, marked pits, and arranged saplings from certified nurseries. RWA volunteers arranged water tankers, while students from three local schools took charge of mulching and tree guards.\n\nWhat happens next matters most. Each park now has an 'adoption roster' - families and students who have committed to watering and monitoring specific trees through their first three summers. Our volunteers will audit survival every quarter and replace losses.\n\nIf your colony or school wants to host the next drive, write to us through the Get Involved page. Saplings, tools and training come from us - you bring the hands and the heart.",
            "cover_image": IMG["girl_planting"],
            "category": "Plantation Drives", "tags": ["plantation", "volunteers", "rohini"],
            "author": "HNES Field Team", "published": True,
            "created_at": "2025-08-18T09:00:00+00:00", "updated_at": "2025-08-18T09:00:00+00:00",
        },
        {
            "id": _id(), "slug": "rainwater-harvesting-five-schools",
            "title": "Rainwater harvesting comes to five more schools",
            "excerpt": "With support from CSR partners, rooftop rainwater harvesting systems are now capturing monsoon rain at five government schools in North-West Delhi.",
            "content": "Every monsoon, lakhs of litres of rain used to run off the rooftops of government schools in our district - straight into drains. This year, five of those rooftops are working for the water table instead.\n\nWith support from our CSR partners, we completed rooftop rainwater harvesting installations at five schools around Kanjhawala and Ladpur. Each system filters roof runoff and channels it into recharge pits, returning an estimated 2-3 lakh litres per school to the ground every year.\n\nThe real innovation is maintenance. Each school's Eco-Club has adopted its system - students check filters after every major shower and maintain a simple logbook that our volunteers review monthly. Caretakers received hands-on training, and laminated instructions in Hindi hang beside every unit.\n\nOur goal is twenty school systems by the end of next year. If you represent a school or a CSR program that wants to be part of this, please reach out through the Partner With Us form.",
            "cover_image": IMG["water_drop"],
            "category": "Water Conservation", "tags": ["water", "schools", "csr"],
            "author": "Program Team", "published": True,
            "created_at": "2025-07-02T09:00:00+00:00", "updated_at": "2025-07-02T09:00:00+00:00",
        },
        {
            "id": _id(), "slug": "plastic-free-narela-drive",
            "title": "Volunteers collect 800 kg of plastic in Narela clean-up",
            "excerpt": "Our monthly shramdaan turned into a record-setter as 150 volunteers cleared plastic waste from the Narela market belt and sent it for recycling.",
            "content": "Sunday mornings look different when 150 people show up with gloves and gunny bags. Our October shramdaan in the Narela market belt collected a record 800 kilograms of plastic waste in under four hours - all of it now on its way to authorised recyclers instead of a landfill.\n\nShopkeepers joined in as the morning progressed, and the market association has now agreed to place segregated bins at six points, with a local dry-waste collector making scheduled pickups.\n\nClean-ups alone don't fix waste - systems do. That is why every drive we run ends with a conversation: with shopkeepers about bin placement, with RWAs about composting, with schools about single-use plastic. The waste we collect is weighed, logged and reported so communities can see their own progress.\n\nJoin the next drive - dates are announced on our social channels and to registered volunteers every month.",
            "cover_image": IMG["volunteers_boxes"],
            "category": "Cleanliness", "tags": ["waste", "shramdaan", "narela"],
            "author": "HNES Field Team", "published": True,
            "created_at": "2025-10-14T09:00:00+00:00", "updated_at": "2025-10-14T09:00:00+00:00",
        },
        {
            "id": _id(), "slug": "winter-warmth-distribution-2024",
            "title": "Winter warmth: blankets and books for 400 families",
            "excerpt": "As temperatures dropped, our volunteers distributed blankets, school books and stationery to families of daily-wage workers across North-West Delhi.",
            "content": "Delhi winters are hardest on those who build and clean the city. As January temperatures dipped below 5 degrees, our volunteers reached 400 families of daily-wage workers with blankets, woollens, school books and stationery kits.\n\nDistribution lists were prepared with local anganwadi workers and verified door-to-door, so support reached households with elderly members, young children or a single earner first. Each school-going child in these families also received a stationery kit and, where needed, help with school fees documentation.\n\nThis welfare work runs alongside our environmental mission because the two are inseparable - the communities most exposed to environmental stress are also the most economically vulnerable. Our donors' contributions made every kit possible.\n\nWinter distribution happens every December-January. Donations marked for community welfare between October and December fund this program directly.",
            "cover_image": IMG["helping_hands"],
            "category": "Community Welfare", "tags": ["welfare", "winter", "donation"],
            "author": "Welfare Team", "published": True,
            "created_at": "2025-01-20T09:00:00+00:00", "updated_at": "2025-01-20T09:00:00+00:00",
        },
    ]


def _gallery():
    items = [
        ("Monsoon plantation drive, Rohini", "Plantation Drives", IMG["girl_planting"], "Rohini, August 2025"),
        ("Sapling ready for planting", "Plantation Drives", IMG["sapling_hand"], "Ladpur nursery, July 2025"),
        ("Volunteers watering young trees", "Plantation Drives", IMG["watering"], "Kanjhawala, September 2025"),
        ("Restored green belt", "Plantation Drives", IMG["forest"], "District Park, 2024"),
        ("Pond revival in progress", "Water Conservation", IMG["water_field"], "Village pond, Kanjhawala belt"),
        ("Every drop counts", "Water Conservation", IMG["water_drop"], "Awareness campaign, 2025"),
        ("Community clean-up shramdaan", "Cleanliness Drives", IMG["bins"], "Narela market, October 2025"),
        ("Segregation awareness with recyclers", "Cleanliness Drives", IMG["recycling"], "North-West Delhi, 2025"),
        ("Evening study circle", "Education", IMG["classroom"], "Community centre, Ladpur"),
        ("Book distribution day", "Education", IMG["books_kids"], "Government school, 2025"),
        ("Winter welfare distribution", "Community Events", IMG["volunteers_boxes"], "January 2025"),
        ("Community volunteers after a drive", "Community Events", IMG["helping_hands"], "Volunteer meet, 2025"),
    ]
    return [
        {"id": _id(), "title": t, "category": c, "image_url": u, "caption": cap, "created_at": _now()}
        for t, c, u, cap in items
    ]


def _team():
    members = [
        ("Rajesh Kumar", "Founder & President", "A lifelong resident of Ladpur, Rajesh founded the society in 2016 after leading informal plantation drives in his village for years."),
        ("Sunita Devi", "General Secretary", "Sunita oversees day-to-day operations and coordinates with RWAs, schools and the district administration."),
        ("Amit Sharma", "Treasurer", "A chartered accountant by profession, Amit ensures every rupee donated is accounted for and reported transparently."),
        ("Dr. Priya Verma", "Program Director - Environment", "An environmental scientist, Priya designs our plantation, water and waste programs and tracks their impact."),
        ("Vikram Singh", "Volunteer Coordinator", "Vikram manages our 1,200-strong volunteer network and organises monthly drives and training sessions."),
        ("Meena Joshi", "Community Outreach Lead", "Meena leads education circles and welfare distribution, working closely with anganwadi workers and local families."),
    ]
    return [
        {"id": _id(), "name": n, "role": r, "bio": b, "photo_url": "", "order": i + 1, "created_at": _now()}
        for i, (n, r, b) in enumerate(members)
    ]


def _milestones():
    rows = [
        ("2016", "Society registered", "Human & Natural Environment Society registered under the Societies Registration Act, 1860 on 11 August 2016."),
        ("2017", "First plantation drives", "Weekend drives in Ladpur and Kanjhawala plant the first 1,000 saplings with local volunteers."),
        ("2018", "Clean colony program begins", "Monthly shramdaan clean-up drives start; first colonies adopt two-bin waste segregation."),
        ("2019", "Water program launched", "First rooftop rainwater harvesting system installed in a government school; pond revival surveys begin."),
        ("2020", "COVID-19 relief", "Volunteers distribute ration kits, masks and sanitisers to daily-wage families through the lockdowns."),
        ("2022", "10,000 trees milestone", "Cumulative plantation crosses 10,000 saplings; first Miyawaki mini-forest established."),
        ("2023", "Education circles expand", "Evening study support reaches 350+ children; twelve school eco-clubs active across the district."),
        ("2025", "25,000 trees & CSR partnerships", "Plantation crosses 25,000 saplings; corporate CSR partners join water and greening programs."),
    ]
    return [
        {"id": _id(), "year": y, "title": t, "description": d, "order": i + 1, "created_at": _now()}
        for i, (y, t, d) in enumerate(rows)
    ]


def _testimonials():
    rows = [
        ("Our park was a dumping ground for years. HNES volunteers turned it into a green space our children actually use. They didn't just plant trees - they kept coming back to care for them.", "Suresh Gupta", "RWA President, Rohini"),
        ("The rainwater harvesting system and the training our staff received have been excellent. Our eco-club students now maintain the logbook themselves.", "Mrs. Anita Rani", "Principal, Government School"),
        ("As a CSR partner, what stood out was the reporting - photos, survival audits, expenditure statements. Rare transparency for a grassroots organisation.", "Kavita Menon", "CSR Lead, Corporate Partner"),
        ("I joined a Sunday clean-up drive two years ago. Today I coordinate three colonies. This society gives ordinary people a way to do extraordinary things for their city.", "Rohit Malhotra", "Volunteer since 2023"),
    ]
    return [
        {"id": _id(), "quote": q, "name": n, "role": r, "order": i + 1, "created_at": _now()}
        for i, (q, n, r) in enumerate(rows)
    ]


def _careers():
    return [
        {
            "id": _id(), "title": "Field Coordinator - Plantation Program", "type": "Volunteer (Part-time)",
            "location": "North-West Delhi",
            "description": "Coordinate weekend plantation and after-care drives: site preparation, volunteer briefing, sapling logistics and survival tracking. Ideal for someone available on weekends with good local knowledge of Rohini/Kanjhawala areas. Travel reimbursement provided.",
            "active": True, "created_at": _now(),
        },
        {
            "id": _id(), "title": "Content & Social Media Intern", "type": "Internship (3 months)",
            "location": "Remote / Delhi",
            "description": "Help document our drives through photos, reels and blog posts, and manage our social media calendar. Great portfolio opportunity for media/mass-comm students. Certificate and letter of recommendation on completion.",
            "active": True, "created_at": _now(),
        },
        {
            "id": _id(), "title": "Program Associate - Education", "type": "Full-time",
            "location": "Ladpur, Delhi",
            "description": "Run evening study circles, coordinate with school eco-clubs and manage the winter welfare distribution calendar. 1-2 years of teaching or community work experience preferred. Modest stipend as per NGO norms.",
            "active": True, "created_at": _now(),
        },
    ]


async def seed_database(db):
    """Seed collections that are empty. Never overwrites existing data."""
    # Admin user (upsert-if-missing so password changes in DB survive restarts)
    admin_email = (os.environ.get("ADMIN_EMAIL") or "hnes2016@gmail.com").strip()
    admin_password = os.environ.get("ADMIN_PASSWORD") or "HNES@321"
    existing_admin = await db.admin_users.find_one({"email": admin_email})
    if not existing_admin:
        await db.admin_users.insert_one({
            "id": _id(), "email": admin_email, "name": "HNES Admin",
            "password_hash": hash_password(admin_password), "created_at": _now(),
        })
        logger.info("Seeded admin user %s", admin_email)

    if not await db.site_settings.find_one({"id": "main"}):
        await db.site_settings.insert_one(dict(DEFAULT_SETTINGS))
        logger.info("Seeded site settings")

    seeds = {
        "programs": _programs, "blog_posts": _blog_posts, "gallery_items": _gallery,
        "team_members": _team, "milestones": _milestones, "testimonials": _testimonials,
        "careers": _careers,
    }
    for coll_name, factory in seeds.items():
        if await db[coll_name].count_documents({}) == 0:
            await db[coll_name].insert_many(factory())
            logger.info("Seeded %s", coll_name)
