# Human & Natural Environment Society - Website

A production-ready website + admin panel (CMS) for **Human & Natural Environment Society**, a registered society under the Societies Registration Act, 1860 (Reg. No. S/26652/SDM/NW/2016), working on environmental conservation and community welfare in Delhi.

---

## For NGO Staff: How to Update the Website (no coding needed)

### 1. Log in to the Admin Panel
1. Open the website and add `/admin` to the address (e.g. `https://your-site.com/admin`).
2. Sign in with:
   - **Email:** hnes2016@gmail.com
   - **Password:** HNES@321
3. You will land on the **Dashboard** - a summary of new form submissions, donations and subscribers.

> Please change the password before going fully public (ask your developer to update `ADMIN_PASSWORD` in the server settings and delete the old admin user from the database, or request a password-change feature).

### 2. What you can edit (left sidebar)
| Menu | What it controls |
|---|---|
| **Inbox** | Messages from the Contact form, Volunteer signups and Partnership inquiries. Mark them New / Read / Responded. Everything is stored here even if email alerts are off. |
| **Programs** | The initiatives on the "Our Work" page. Add photos, description, impact numbers. "Show on homepage" puts a program in the homepage cards. |
| **Blog Posts** | News & stories. Write in plain text - a blank line starts a new paragraph. Untick "Published" to keep a draft hidden. |
| **Gallery** | Photos on the Gallery page. Give each photo a category (e.g. "Plantation Drives") - filters are created automatically. Upload from your computer or paste an image link. |
| **Team** | People shown on the About page. Photo is optional - initials are shown otherwise. |
| **Testimonials** | Quotes on the homepage carousel. |
| **Milestones** | The timeline on the About page. |
| **Careers** | Openings on the Get Involved page. Untick "Active" to hide one. |
| **Donations** | Every donation intent recorded on the site. DEMO entries until the payment gateway is activated. |
| **Subscribers** | Newsletter email list - use "Export CSV" to download it. |
| **Site Settings** | Tagline, mission, story, contact details, the 4 homepage impact counters, bank account details for donations, the 80G tax note toggle, social media links and the partners strip. Click **"Save all changes"** after editing. |

### 3. Important toggles
- **80G tax note** (Site Settings → Donations): OFF by default. Turn it ON **only after** the society's 80G/12A registration is confirmed.
- **Bank details**: currently placeholders - update the account number and IFSC in Site Settings before sharing the Donate page.
- **Registration number**: shown on About and in the footer. Verify the digits against the original certificate, then edit in Site Settings → Organization if needed.

---

## For Developers

### Stack
- **Frontend:** React (CRA + craco), TailwindCSS, shadcn/ui, framer-motion — `/frontend`
- **Backend:** FastAPI + Motor (async MongoDB) — `/backend`
- **Database:** MongoDB (collections auto-seeded on first startup, never overwrites edits)
- **Auth:** JWT (7-day expiry), bcrypt-hashed admin password

### Environment variables (`backend/.env`)
| Variable | Purpose |
|---|---|
| `MONGO_URL`, `DB_NAME` | Database connection |
| `JWT_SECRET` | Token signing - change in production |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeded admin login (only used if the admin user doesn't exist yet) |
| `SENDGRID_API_KEY` + `SENDER_EMAIL` | Option A: enables email alerts via SendGrid |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SENDER_EMAIL` | Option B: enables email alerts via any SMTP (e.g. Gmail app password) |
| `NOTIFY_EMAIL` | Address that receives form-submission alerts |
| `PAYMENT_MODE` | `mock` (default). Set to `live` + add `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` once the gateway account exists (the checkout call itself still needs to be wired to Razorpay's SDK when keys arrive). |

Email alerts activate automatically as soon as SendGrid **or** SMTP variables are filled in and the backend restarts - no code changes needed. Submissions are always stored in the Inbox regardless.

### API overview
- Public: `/api/settings`, `/api/programs`, `/api/blog`, `/api/gallery`, `/api/team`, `/api/testimonials`, `/api/milestones`, `/api/careers`, `POST /api/submissions`, `POST /api/newsletter`, `POST /api/donations`
- Admin (Bearer token): `POST /api/admin/login`, `/api/admin/dashboard`, generic CRUD `/api/admin/content/{programs|blog|gallery|team|testimonials|milestones|careers}`, `/api/admin/settings`, `/api/admin/submissions`, `/api/admin/donations`, `/api/admin/subscribers`, `POST /api/admin/upload` (images, served from `/api/uploads/...`)

### SEO
- Per-page titles/descriptions + Open Graph via react-helmet-async
- `public/sitemap.xml`, `public/robots.txt`
- Schema.org NGO JSON-LD in `public/index.html`

### Legal compliance (baked in - do not remove)
1. Footer of every page: "Human & Natural Environment Society is a registered society under the Societies Registration Act, 1860. Registration No. S/26652/SDM/NW/2016."
2. Private-body caption and non-endorsement statement in the footer and the About page legal block.
3. Full legal name used in all official/legal contexts (short form "HNES" only in casual UI labels).
