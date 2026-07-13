/* Field configuration for the generic admin CRUD manager.
   Field types: text, number, textarea, switch, image, images, tags, pairs, select */

export const CONTENT_CONFIG = {
  programs: {
    title: "Programs",
    description: "The initiatives shown on the Our Work page. Changes appear on the website immediately.",
    itemLabel: (item) => item.title,
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "featured", label: "On homepage", render: (v) => (v ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Program title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", placeholder: "Environment / Community Welfare" },
      { name: "summary", label: "Short summary (shown on cards)", type: "textarea", rows: 3, required: true },
      { name: "description", label: "Full description (blank line = new paragraph)", type: "textarea", rows: 10 },
      { name: "image_url", label: "Cover image", type: "image" },
      { name: "gallery", label: "Photo gallery", type: "images" },
      { name: "impact_numbers", label: "Impact numbers", type: "pairs", pairLabels: ["Label (e.g. Saplings planted)", "Value (e.g. 25,000+)"] },
      { name: "featured", label: "Show on homepage", type: "switch" },
      { name: "order", label: "Display order (1 = first)", type: "number" },
    ],
    defaults: { featured: false, order: 10, gallery: [], impact_numbers: [] },
  },
  blog: {
    title: "Blog Posts",
    description: "News and stories shown on the News page and homepage.",
    itemLabel: (item) => item.title,
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "published", label: "Published", render: (v) => (v ? "Yes" : "Draft") },
    ],
    fields: [
      { name: "title", label: "Post title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", placeholder: "Plantation Drives / Water Conservation" },
      { name: "excerpt", label: "Excerpt (shown on cards)", type: "textarea", rows: 3, required: true },
      { name: "content", label: "Full article (blank line = new paragraph)", type: "textarea", rows: 12, required: true },
      { name: "cover_image", label: "Cover image", type: "image" },
      { name: "tags", label: "Tags (comma separated)", type: "tags" },
      { name: "author", label: "Author", type: "text", placeholder: "HNES Field Team" },
      { name: "published", label: "Published (visible on site)", type: "switch" },
    ],
    defaults: { published: true, tags: [], author: "HNES Team" },
  },
  gallery: {
    title: "Gallery",
    description: "Photos shown on the Gallery page, organised by category.",
    itemLabel: (item) => item.title,
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "caption", label: "Caption" },
    ],
    fields: [
      { name: "title", label: "Photo title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true, placeholder: "Plantation Drives / Community Events" },
      { name: "image_url", label: "Photo", type: "image", required: true },
      { name: "caption", label: "Caption (location + month/year)", type: "text", placeholder: "Rohini, August 2025" },
    ],
    defaults: {},
  },
  team: {
    title: "Team Members",
    description: "People shown in the About page team grid.",
    itemLabel: (item) => item.name,
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role / designation", type: "text", required: true },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "photo_url", label: "Photo (optional - initials shown if empty)", type: "image" },
      { name: "order", label: "Display order (1 = first)", type: "number" },
    ],
    defaults: { order: 10, photo_url: "" },
  },
  testimonials: {
    title: "Testimonials",
    description: "Quotes shown on the homepage carousel.",
    itemLabel: (item) => item.name,
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "quote", label: "Quote", render: (v) => (v || "").slice(0, 60) + "…" },
    ],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
      { name: "name", label: "Person's name", type: "text", required: true },
      { name: "role", label: "Role / context", type: "text", placeholder: "RWA President, Rohini" },
      { name: "order", label: "Display order", type: "number" },
    ],
    defaults: { order: 10 },
  },
  milestones: {
    title: "Milestones",
    description: "Timeline entries on the About page.",
    itemLabel: (item) => `${item.year} - ${item.title}`,
    columns: [
      { key: "year", label: "Year" },
      { key: "title", label: "Title" },
    ],
    fields: [
      { name: "year", label: "Year", type: "text", required: true, placeholder: "2025" },
      { name: "title", label: "Milestone title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "order", label: "Display order (1 = first)", type: "number" },
    ],
    defaults: { order: 10 },
  },
  careers: {
    title: "Careers & Internships",
    description: "Openings listed on the Get Involved page.",
    itemLabel: (item) => item.title,
    columns: [
      { key: "title", label: "Role" },
      { key: "type", label: "Type" },
      { key: "active", label: "Active", render: (v) => (v ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Role title", type: "text", required: true },
      { name: "type", label: "Type", type: "text", placeholder: "Internship (3 months) / Full-time / Volunteer" },
      { name: "location", label: "Location", type: "text", placeholder: "North-West Delhi / Remote" },
      { name: "description", label: "Description", type: "textarea", rows: 5 },
      { name: "active", label: "Active (visible on site)", type: "switch" },
    ],
    defaults: { active: true },
  },
};
