# plan.md — Human & Natural Environment Society Website

## 1. Objectives
- Deliver a production-ready, responsive NGO website + lightweight CMS for **Human & Natural Environment Society**.
- Public site covers 8 pages (Home, About, Programs+detail, Gallery, Get Involved, Donate, Blog+detail, Contact) powered by admin-managed content.
- Admin panel provides JWT login and CRUD for all key content + inbox for submissions.
- Store all forms/newsletter/donation logs in MongoDB; email notifications activate via ENV vars when credentials are added.
- Meet non-negotiable compliance: legal name usage, private body caption, non-endorsement, footer disclaimer on every page.
- SEO-ready (unique meta, OG, sitemap/robots, schema.org) + performance/accessibility targets.

## 2. Implementation Steps

### Phase 1 — POC (Skipped)
- Skipped: core risks (payments/email) are mocked or placeholder-driven; app is standard CRUD + simple JWT.

### Phase 2 — V1 App Development (Public site + working CMS basics)
**Backend (FastAPI + MongoDB)**
- Project setup: env-var config, CORS, logging, health check.
- Models/collections: programs, blog_posts, gallery_items, team_members, impact_stats, careers, site_settings, submissions (contact/volunteer/partner), newsletter_subscribers, donations.
- REST endpoints (public): list/detail for programs/blog, gallery list/filter, settings read, submit contact/volunteer/partner, newsletter subscribe, donation create (MOCK).
- REST endpoints (admin): JWT login + CRUD for all collections, inbox list/detail/update status, export helpers (CSV optional).
- Seed realistic NGO copy/content (no lorem) for all pages.

**Frontend (React + Tailwind)**
- Global layout: header/nav, footer (with required legal note), responsive design system (colors/typography/components).
- Public pages:
  1) Home (hero + CTAs, animated editable impact stats, programs preview, featured blog, partners/testimonials strip, newsletter)
  2) About (mission/vision/story, legal credibility block, team grid, milestones timeline)
  3) Programs index + program detail (gallery, impact numbers, support CTA)
  4) Gallery (filters + lightbox)
  5) Get Involved (volunteer form, careers listings, CSR inquiry form)
  6) Donate (usage copy, amount presets/custom, one-time/recurring toggle, MOCK checkout, editable bank/cheque details, 80G note gated OFF by default)
  7) Blog list/detail (categories/tags, search)
  8) Contact (address, phone/email, Google map embed, contact form, socials)
- Admin panel (MVP): login, CRUD screens, simple media uploader for gallery, inbox screens, settings editor.

**V1 Testing (end-to-end)**
- Run one full pass: public browsing, submissions saved, admin login, CRUD updates reflect on public pages, donation mock creates log.
- Fix until stable.

**Phase 2 — User Stories (min 5)**
1. As a visitor, I want to quickly understand the mission and impact so I can decide to support.
2. As a donor, I want a clear donation flow with transparent fund usage so I feel confident donating.
3. As a volunteer, I want to submit my interests and contact details so the NGO can reach me.
4. As a reader, I want to browse and search news/blog posts so I can follow ongoing work.
5. As an admin, I want to update programs, stats, and gallery so the website stays current without developers.

### Phase 3 — Production Features (SEO, compliance hardening, email activation wiring, UX polish)
**Compliance/Legal**
- Ensure footer disclaimer on every page: "Human & Natural Environment Society is a registered society under the Societies Registration Act, 1860. Registration No. S/26652/SDM/NW/2016."
- About page legal block includes: registered under act, reg date, authority, registered address, private body/society caption, non-endorsement statement.
- Add “verify exact digits against the certificate before publishing” note near registration number (until certificate confirmed).

**Email Notifications (ENV placeholders; activate when keys provided)**
- Implement provider-agnostic mailer: SendGrid (API key) OR SMTP, controlled by env.
- On submission: always persist to DB; attempt email send if configured; record send status in DB.

**SEO/Performance/Accessibility**
- Unique titles/meta per route; Open Graph + Twitter cards.
- Generate sitemap.xml and robots.txt.
- Add schema.org Organization/NGO structured data (with registration details).
- Image optimization: lazy loading, responsive sizes; Lighthouse target 90+.
- Form UX: validation, loading/error states, keyboard navigation, alt text.

**Phase 3 — User Stories (min 5)**
1. As an admin, I want every form submission to appear in an inbox even if email fails.
2. As an admin, I want email alerts to start automatically once credentials are added.
3. As a visitor, I want fast-loading pages and accessible navigation so I can use the site on any device.
4. As a donor, I want donation-related disclaimers (like 80G) to only appear when officially enabled.
5. As a search engine, I want structured metadata so the NGO is represented accurately in results.

### Phase 4 — Final QA, Documentation, and Release Readiness
- Security pass: env vars only, rate-limit submissions, basic spam protection (honeypot + server-side checks).
- Admin hardening: password hashing, token expiry/refresh strategy, audit fields.
- Content review checklist: registration number verification, contact details, bank details.
- Write README for non-technical staff: how to log in, edit pages, add blog posts, upload gallery, view inbox, enable 80G note, configure email keys.
- Final end-to-end testing and bugfix round.

**Phase 4 — User Stories (min 5)**
1. As a staff member, I want simple instructions to update content so I can manage the site confidently.
2. As an admin, I want secure login and session expiry so access remains controlled.
3. As a visitor, I want consistent footer/legal text on every page so credibility is clear.
4. As an admin, I want to quickly export newsletters/submissions so I can follow up offline.
5. As a maintainer, I want environment-based configuration so deployments are safe and repeatable.

## 3. Next Actions
- Confirm domain/brand assets (logo, hero images) or proceed with tasteful placeholders.
- Implement backend scaffold + DB models + seed data.
- Implement frontend layout + routing + core public pages.
- Implement admin auth + minimum CRUD screens.
- Run first end-to-end test pass; fix issues.

## 4. Success Criteria
- Public site fully navigable with real NGO copy and mobile-first responsive UI.
- Admin can log in (hnes2016@gmail.com / HNES@321) and update all content types; changes reflect immediately on public pages.
- All forms: saved to MongoDB; inbox view works; email send attempts activate via env vars when provided.
- Donation page creates MOCK donation records and handles success/failure states without real gateway keys.
- Compliance footer appears on every page with full legal name; About legal block present; non-endorsement and private body caption included.
- SEO artifacts present (meta, OG, sitemap, robots, schema) and Lighthouse ~90+ on key pages.
