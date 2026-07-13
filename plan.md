# plan.md — Human & Natural Environment Society Website (Updated)

## 1. Objectives
- Deliver a production-ready, responsive NGO website + lightweight CMS for **Human & Natural Environment Society**.
- Public site covers 8 primary pages (Home, About, Programs+detail, Gallery, Get Involved, Donate, Blog+detail, Contact) + a 404 page, powered by admin-managed content.
- Admin panel provides JWT login and CRUD for all key content + an inbox for submissions.
- Store all forms/newsletter/donation logs in MongoDB; email notifications activate via ENV vars when credentials are added.
- Meet non-negotiable compliance: full legal name usage in official contexts, private-body caption, non-endorsement, and required footer disclaimer on every page.
- SEO-ready (unique meta, OG, sitemap/robots, schema.org) + performance/accessibility targets.

**Current status:** The full-stack app is built, seeded with realistic NGO content, compliance is implemented, and testing has been completed (Iteration 1). Remaining work is mainly production activation items (real payment/email credentials, final verification details, and optional hardening).

## 2. Implementation Steps

### Phase 1 — POC (Skipped)
- Skipped: core risks (payments/email) are mocked or placeholder-driven; app is standard CRUD + simple JWT.

### Phase 2 — V1 App Development (Public site + working CMS) — **COMPLETED**
**Backend (FastAPI + MongoDB) — Completed**
- Env-var driven config, CORS, logging.
- JWT admin auth + bcrypt password hashing; seeded admin user.
- Idempotent database seeding with realistic NGO content (no lorem ipsum).
- Collections implemented:
  - programs, blog_posts, gallery_items, team_members, testimonials, milestones, careers
  - site_settings (org info, partners, impact stats, bank details, 80G toggle)
  - submissions (contact/volunteer/partner), newsletter_subscribers, donations
- Public REST endpoints implemented:
  - settings read
  - programs list/detail
  - blog list/search/filter + categories + detail + related
  - gallery list/filter + categories
  - team/testimonials/milestones/careers
  - submissions create (with honeypot)
  - newsletter subscribe (dedupe)
  - donations create (MOCK mode; generates `MOCK-...` reference)
- Admin REST endpoints implemented:
  - login + dashboard
  - generic CRUD for programs/blog/gallery/team/testimonials/milestones/careers
  - inbox list + status patch + delete
  - donations log, subscribers list + delete
  - settings get/update
  - image upload endpoint serving `/api/uploads/...`
- Provider-agnostic mailer implemented:
  - SendGrid OR SMTP configuration via env vars
  - submissions always stored in DB; email send attempted only if configured; status stored

**Frontend (React + Tailwind + shadcn/ui) — Completed**
- Global design tokens applied (earthy palette + terracotta CTAs), fonts (Spectral + Manrope), and layout.
- Public pages implemented (all responsive, real copy):
  1) Home (hero + CTAs, animated editable impact stats, programs preview, featured blog, testimonials carousel, partners strip, newsletter)
  2) About (mission/vision/story, legal registration block, team grid, milestones timeline)
  3) Programs index + program detail (gallery, impact numbers, support CTA)
  4) Gallery (filters + lightbox)
  5) Get Involved (volunteer form, careers accordion, CSR inquiry form)
  6) Donate (fund usage transparency, presets/custom amount, one-time/monthly toggle, MOCK payment dialog + log, editable bank details, 80G note gated OFF by default)
  7) Blog list/detail (search, category filter, pagination, related posts)
  8) Contact (address, social links, map embed, contact form)
  + 404 (NotFound)
- Admin CMS implemented (12+ screens):
  - Login, Admin layout, Dashboard
  - Generic Content Manager for Programs/Blog/Gallery/Team/Testimonials/Milestones/Careers
  - Inbox (submissions), Donations log, Subscribers list (CSV export), Site Settings editor

**SEO / Compliance / UX — Completed (folded into Phase 2)**
- Per-page title/meta/OG via react-helmet-async.
- `public/sitemap.xml` and `public/robots.txt`.
- Schema.org NGO JSON-LD in `public/index.html`.
- Compliance footer note on every public page with required legal text:
  - “Human & Natural Environment Society is a registered society under the Societies Registration Act, 1860. Registration No. S/26652/SDM/NW/2016.”
  - Private-body caption + non-endorsement statement included.
- Form UX: validation, loading/success states; accessibility-friendly components.

**Image Audit — Completed**
- Audited placeholder images for mismatches; replaced incorrect Unsplash mappings.
- Database reseeded where necessary to reflect corrected imagery.

**Phase 2 Testing (end-to-end) — Completed**
- Testing agent Iteration 1: **97.98% pass**
  - Backend: **48/48 (100%)**
  - Admin UI: **24/24 (100%)**
  - Public UI: **25/27** (2 low-priority test-automation selector/timing artifacts; functionality verified)

**Phase 2 — User Stories (min 5) — Completed**
1. As a visitor, I want to quickly understand the mission and impact so I can decide to support.
2. As a donor, I want a clear donation flow with transparent fund usage so I feel confident donating.
3. As a volunteer, I want to submit my interests and contact details so the NGO can reach me.
4. As a reader, I want to browse and search news/blog posts so I can follow ongoing work.
5. As an admin, I want to update programs, stats, and gallery so the website stays current without developers.

### Phase 3 — Production Activation & Optional Enhancements (Remaining / Future)
**Payments (Razorpay live mode) — Pending**
- When keys are provided:
  - Set `PAYMENT_MODE=live` and add `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
  - Wire Razorpay live checkout + webhook verification (replace mock dialog).
  - Update donation status lifecycle (initiated/paid/failed) and receipts workflow.

**Email Notifications (SendGrid/SMTP) — Pending**
- When credentials are provided:
  - Fill env vars (SendGrid API key + verified sender OR SMTP host/user/pass).
  - Restart backend; email notifications automatically activate.
  - Optional: add a “Test email” action in admin settings.

**Content Verification & Go-live Checklist — Pending**
- Verify registration number digits against the certificate image (currently shown with a “verify” caveat on About page).
- Replace placeholder phone number with official phone.
- Update bank account details (Account number + IFSC) in Admin → Site Settings.
- Add real NGO photography to Gallery and Programs (with location/month/year captions where possible).

**Security / Deliverability Hardening (Optional) — Pending**
- Add rate limiting for submissions/newsletter (e.g., per-IP) and basic abuse controls.
- Add reCAPTCHA/hCaptcha (optional) if spam increases.
- Add admin password change flow (self-service) and optional 2FA.
- Add audit log entries for admin content changes.

**Phase 3 — User Stories (min 5) — Pending**
1. As an admin, I want online donations to actually charge via Razorpay so supporters can donate instantly.
2. As an admin, I want email alerts to be delivered when users submit forms so we can respond quickly.
3. As an admin, I want to verify legal/bank details before go-live to ensure credibility.
4. As a maintainer, I want rate limiting and spam controls so forms remain reliable.
5. As an admin, I want to change my password without developer help.

### Phase 4 — Final QA, Documentation, and Release Readiness — **PARTIALLY COMPLETED**
- README for non-technical staff written: `/app/README.md` — **Completed**
- PRD stored: `/app/memory/PRD.md` — **Completed**
- Final QA before go-live (repeat after adding real payment/email keys) — Pending:
  - Donation live-mode end-to-end
  - Email deliverability tests
  - Lighthouse re-check after final images

**Phase 4 — User Stories (min 5) — Partially completed**
1. As a staff member, I want simple instructions to update content so I can manage the site confidently. (**Done: README**) 
2. As an admin, I want secure login and session expiry so access remains controlled. (**Done**) 
3. As a visitor, I want consistent footer/legal text on every page so credibility is clear. (**Done**) 
4. As an admin, I want to quickly export newsletters/submissions so I can follow up offline. (**Done: CSV export for subscribers; inbox available**) 
5. As a maintainer, I want environment-based configuration so deployments are safe and repeatable. (**Done**) 

## 3. Next Actions
1. Provide (when ready):
   - Razorpay live keys (or confirm gateway choice)
   - SendGrid API key + verified sender email OR SMTP credentials
2. Verify registration number digits from the certificate and confirm final value for public publishing.
3. Update bank details in Admin → Site Settings.
4. Optional: enable security hardening (rate limiting / captcha) before public launch.
5. Run a final full end-to-end test pass after enabling payment/email.

## 4. Success Criteria
- Public site fully navigable with realistic NGO copy and mobile-first responsive UI. (**Met**)
- Admin can log in (hnes2016@gmail.com / HNES@321) and update all content types; changes reflect on public pages. (**Met**)
- All forms saved to MongoDB; inbox view works; emails auto-activate when env keys are provided. (**Met for storage + activation wiring**)
- Donation page records MOCK donations with references; ready to switch to live gateway when keys arrive. (**Met for mock; live pending**) 
- Compliance footer appears on every page with full legal name and registration note; About legal block present with private-body + non-endorsement statements. (**Met**)
- SEO artifacts present (meta, OG, sitemap, robots, schema) and ready for indexing. (**Met**)
- Testing completed with high pass rate; remaining items are low-priority automation artifacts and production activation steps. (**Met**)