import requests
import json

BASE_URL = "https://green-community-ngo.preview.emergentagent.com/api"

# Login
login_response = requests.post(f"{BASE_URL}/admin/login", json={
    "email": "hnes2016@gmail.com",
    "password": "HNES@321"
})
token = login_response.json()["token"]
headers = {"Authorization": f"Bearer {token}"}

# Create the tree plantation program (from seed.py)
tree_program = {
    "slug": "tree-plantation-urban-greening",
    "title": "Tree Plantation & Urban Greening",
    "category": "Environment",
    "summary": "Native-species plantation drives, Miyawaki mini-forests and park restoration across North-West Delhi, with three years of after-care for every sapling.",
    "description": "Delhi loses green cover every year to construction and neglect. Our plantation program works with RWAs, schools and the district administration to bring it back - one neighbourhood at a time.\n\nEvery drive begins with a site survey to choose native, climate-suited species such as neem, peepal, amaltas and jamun. Volunteers prepare pits, plant saplings and - most importantly - commit to a three-year care schedule of watering, mulching and tree-guard maintenance. Survival, not just plantation, is our measure of success.\n\nSince 2016 we have planted over 25,000 saplings with a survival rate above 80%, created two Miyawaki-method mini-forests, and restored green belts in more than 15 parks. Schools that join the program receive a 'Green Campus' toolkit so students can adopt and monitor their own trees.",
    "image_url": "https://images.unsplash.com/photo-1617153817979-283ffdcd52f5?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    "gallery": [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=75",
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=75",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=75",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=75"
    ],
    "impact_numbers": [
        {"label": "Saplings planted", "value": "25,000+"},
        {"label": "Survival rate", "value": "80%"},
        {"label": "Parks restored", "value": "15+"},
        {"label": "Mini-forests created", "value": "2"}
    ],
    "featured": True,
    "order": 1
}

print("Creating tree plantation program...")
create_response = requests.post(
    f"{BASE_URL}/admin/content/programs",
    headers=headers,
    json=tree_program
)
print(f"Create response: {create_response.status_code}")
if create_response.status_code == 200:
    print(f"Created: {create_response.json()}")
else:
    print(f"Error: {create_response.text}")

# Verify programs
programs = requests.get(f"{BASE_URL}/programs").json()
print(f"\nTotal programs: {len(programs)}")
for p in programs:
    print(f"  - {p['slug']} (order: {p['order']})")
