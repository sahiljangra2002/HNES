# PRD - Human & Natural Environment Society Website

## Product
Donor/volunteer-facing website + lightweight CMS for a registered Delhi NGO (Reg. No. S/26652/SDM/NW/2016, Societies Registration Act 1860, registered 11 Aug 2016).

## User decisions
- Stack: FastAPI + React + MongoDB (user approved switch from Node/Express)
- Donations: MOCK Razorpay mode, env-var placeholders (no keys yet)
- Email: env-var placeholders (SendGrid OR SMTP), user said "later"; recipient hnes2016@gmail.com; all submissions stored in DB inbox regardless
- Certificate image not provided - proceed with given details + "verify digits" caveat on About page
- Admin credentials: hnes2016@gmail.com / HNES@321

## Delivered (Phase 2 complete, tested 97.98% pass)
- Public: Home (hero, animated stats, program cards, featured blog, testimonials, partners, newsletter), About (mission/vision/story, legal block, team, timeline), Programs + detail (lightbox, impact numbers, support CTA), Gallery (filters + lightbox), Get Involved (volunteer form, careers, CSR form), Donate (presets/custom/monthly, mock checkout dialog, bank details w/ copy, transparency bars, 80G gated OFF), Blog (search/category/pagination) + detail, Contact (form, map, socials), 404
- Admin CMS: JWT login, dashboard, generic CRUD (programs/blog/gallery/team/testimonials/milestones/careers), inbox w/ status, donations log, subscribers + CSV export, settings editor (org, stats, bank, 80G, socials, partners), image upload (/api/uploads)
- SEO: helmet per-page meta/OG, sitemap.xml, robots.txt, schema.org NGO JSON-LD
- Compliance footer on every page (legal name, reg no, private body, non-endorsement)
- Seeded realistic content; honeypot spam protection; provider-agnostic mailer (activates via env)

## Key files
- Backend: server.py, seed.py, auth.py, mailer.py, models.py
- Frontend: src/pages/*, src/pages/admin/*, src/components/*, src/context/SettingsContext.js

## Real photography added (user-uploaded, applied via /app/scripts/apply_content.py)
- 3 news posts: blood donation camp (13 Jun 2026, Bahadurgarh, poster cover), Rs 51,000 student aid (photo cover + clipping in gallery), talent felicitation (clipping cover)
- 5 gallery items (Community Events + Education categories) from real photos/clippings
- President: Geeta Deroliya (Teacher & President) - portrait extracted from blood-camp poster, replaces placeholder president in Team; photo at /api/uploads/president-geeta-deroliya.jpg
- Homepage: new "Message from the President" section (admin-editable via Site Settings -> Organization -> President block; hidden if president name blank)
- All uploaded files persisted in /app/backend/uploads/

## Pending / future
- Real Razorpay keys + live checkout wiring
- SendGrid/SMTP credentials from user
- Verify registration number against certificate
- Real bank account details (admin editable)
- Admin password change feature (nice-to-have)
