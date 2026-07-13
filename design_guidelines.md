{
  "brand": {
    "name": "Human & Natural Environment Society",
    "short_name": "HNES",
    "attributes": [
      "warm",
      "trustworthy",
      "nature-forward",
      "established (since 2016)",
      "community-first",
      "credible / compliance-aware"
    ],
    "voice_and_tone": {
      "writing": [
        "Use plain, respectful English with India context (Delhi, neighbourhoods, RWAs, schools).",
        "Avoid hype language (no 'revolutionary', 'disrupt').",
        "Prefer evidence-led phrasing: 'Since 2016', 'registered society', 'annual reports', 'project updates'.",
        "Use donor-centric copy: 'Your support helps…' and volunteer-centric copy: 'Join a weekend drive…'."
      ]
    },
    "legal_footer_note": {
      "must_appear_on_every_page": true,
      "exact_text": "Human & Natural Environment Society is a registered society under the Societies Registration Act, 1860. Registration No. S/26652/SDM/NW/2016.",
      "placement": "Footer bottom bar (always visible on scroll end). Also repeat on Donate page near payment methods and on About page in a 'Registration & Compliance' block.",
      "styling": "text-xs text-muted-foreground bg-muted/40 border-t border-border py-3"
    }
  },

  "design_personality": {
    "style_fusion": [
      "Editorial warmth (serif headings) + humanist NGO clarity (sans body)",
      "Soft card UI (rounded corners, off-white surfaces) + 'field report' credibility blocks",
      "Nature-forward textures (subtle grain/noise) + restrained accent CTAs (terracotta/amber)"
    ],
    "layout_principles": [
      "Mobile-first, content-first: mission clarity above fold.",
      "Trust architecture: registration, transparency, partners, and impact stats appear early.",
      "Generous whitespace; avoid dense grids.",
      "Use photography as proof (real people, real work) with captions and dates where possible."
    ]
  },

  "typography": {
    "google_fonts": {
      "heading": {
        "family": "Spectral",
        "fallback": "ui-serif, Georgia, serif",
        "weights": [400, 600, 700]
      },
      "body": {
        "family": "Manrope",
        "fallback": "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        "weights": [400, 500, 600, 700]
      }
    },
    "tailwind_usage": {
      "h1": "font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]",
      "h2": "font-[var(--font-heading)] text-2xl sm:text-3xl tracking-tight leading-snug",
      "h3": "font-[var(--font-heading)] text-xl sm:text-2xl leading-snug",
      "subheading": "font-[var(--font-body)] text-base md:text-lg text-muted-foreground leading-relaxed",
      "body": "font-[var(--font-body)] text-sm sm:text-base leading-relaxed",
      "small": "font-[var(--font-body)] text-xs sm:text-sm text-muted-foreground"
    },
    "content_rules": [
      "Max line length for reading: 68–78ch on blog/program detail pages.",
      "Use sentence case for headings (not ALL CAPS).",
      "Use tabular-nums for stats: 'tabular-nums' utility on counters and finance blocks."
    ]
  },

  "color_system": {
    "notes": [
      "Earthy greens/browns/off-whites; ONE accent for CTAs (terracotta).",
      "No purple. No saturated gradients. Gradients only as subtle section backgrounds and <20% viewport.",
      "Ensure WCAG AA contrast for text on all surfaces."
    ],
    "tokens_hsl_for_shadcn": {
      "light": {
        "background": "36 33% 97%",
        "foreground": "24 18% 12%",
        "card": "36 33% 99%",
        "card-foreground": "24 18% 12%",
        "popover": "36 33% 99%",
        "popover-foreground": "24 18% 12%",

        "primary": "152 28% 22%",
        "primary-foreground": "36 33% 98%",

        "secondary": "36 22% 92%",
        "secondary-foreground": "24 18% 14%",

        "muted": "36 18% 93%",
        "muted-foreground": "24 10% 38%",

        "accent": "18 62% 44%",
        "accent-foreground": "36 33% 98%",

        "border": "30 14% 84%",
        "input": "30 14% 84%",
        "ring": "18 62% 44%",

        "destructive": "0 72% 46%",
        "destructive-foreground": "0 0% 98%",

        "chart-1": "152 28% 22%",
        "chart-2": "18 62% 44%",
        "chart-3": "34 44% 46%",
        "chart-4": "92 28% 34%",
        "chart-5": "200 34% 34%",

        "radius": "0.9rem"
      },
      "dark_optional_admin": {
        "background": "24 18% 10%",
        "foreground": "36 33% 96%",
        "card": "24 18% 12%",
        "card-foreground": "36 33% 96%",
        "popover": "24 18% 12%",
        "popover-foreground": "36 33% 96%",

        "primary": "36 33% 96%",
        "primary-foreground": "24 18% 12%",

        "secondary": "24 12% 18%",
        "secondary-foreground": "36 33% 96%",

        "muted": "24 12% 18%",
        "muted-foreground": "36 10% 70%",

        "accent": "18 62% 52%",
        "accent-foreground": "24 18% 10%",

        "border": "24 10% 22%",
        "input": "24 10% 22%",
        "ring": "18 62% 52%",

        "destructive": "0 62% 42%",
        "destructive-foreground": "0 0% 98%"
      }
    },
    "semantic_usage": {
      "primary": "Deep forest green for nav, headings accents, admin highlights.",
      "accent": "Terracotta for primary CTAs (Donate, Submit forms).",
      "surfaces": "Off-white/sand for page background; white-ish cards.",
      "borders": "Warm light taupe borders; avoid cold gray.",
      "links": "Use primary (green) with underline on hover; visited state slightly darker."
    },
    "allowed_gradients": {
      "hero_background_only": [
        "linear-gradient(135deg, hsl(36 33% 97%) 0%, hsl(92 28% 92%) 45%, hsl(36 33% 97%) 100%)",
        "radial-gradient(900px circle at 20% 10%, hsla(18,62%,44%,0.10), transparent 55%), radial-gradient(900px circle at 80% 0%, hsla(152,28%,22%,0.10), transparent 55%)"
      ],
      "restriction": "Gradients must not exceed 20% of viewport and must never be used behind long text blocks."
    }
  },

  "global_css_tokens": {
    "where": [
      "/app/frontend/src/index.css (replace :root tokens with the HSL values above)",
      "Add font CSS variables and a subtle noise utility"
    ],
    "additions": {
      "font_vars": ":root { --font-heading: 'Spectral'; --font-body: 'Manrope'; }",
      "selection": "::selection { background: hsla(18,62%,44%,0.25); }",
      "noise_overlay_class": ".noise-overlay{ position:relative; } .noise-overlay:before{ content:''; position:absolute; inset:0; pointer-events:none; background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E'); mix-blend-mode:multiply; opacity:.35; border-radius:inherit; }"
    }
  },

  "grid_and_spacing": {
    "container": {
      "class": "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
      "reading_container": "mx-auto w-full max-w-3xl px-4 sm:px-6"
    },
    "section_spacing": {
      "default": "py-12 sm:py-16",
      "dense_admin": "py-6",
      "between_blocks": "gap-6 sm:gap-8"
    },
    "cards": {
      "radius": "rounded-2xl",
      "shadow": "shadow-[0_10px_30px_-18px_rgba(20,20,20,0.25)]",
      "border": "border border-border/70"
    }
  },

  "components": {
    "component_path": {
      "shadcn_ui": {
        "button": "/app/frontend/src/components/ui/button.jsx",
        "card": "/app/frontend/src/components/ui/card.jsx",
        "badge": "/app/frontend/src/components/ui/badge.jsx",
        "tabs": "/app/frontend/src/components/ui/tabs.jsx",
        "table": "/app/frontend/src/components/ui/table.jsx",
        "input": "/app/frontend/src/components/ui/input.jsx",
        "textarea": "/app/frontend/src/components/ui/textarea.jsx",
        "select": "/app/frontend/src/components/ui/select.jsx",
        "checkbox": "/app/frontend/src/components/ui/checkbox.jsx",
        "radio_group": "/app/frontend/src/components/ui/radio-group.jsx",
        "switch": "/app/frontend/src/components/ui/switch.jsx",
        "dialog": "/app/frontend/src/components/ui/dialog.jsx",
        "sheet": "/app/frontend/src/components/ui/sheet.jsx",
        "navigation_menu": "/app/frontend/src/components/ui/navigation-menu.jsx",
        "accordion": "/app/frontend/src/components/ui/accordion.jsx",
        "pagination": "/app/frontend/src/components/ui/pagination.jsx",
        "carousel": "/app/frontend/src/components/ui/carousel.jsx",
        "calendar": "/app/frontend/src/components/ui/calendar.jsx",
        "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx",
        "breadcrumb": "/app/frontend/src/components/ui/breadcrumb.jsx",
        "separator": "/app/frontend/src/components/ui/separator.jsx",
        "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
        "dropdown_menu": "/app/frontend/src/components/ui/dropdown-menu.jsx",
        "avatar": "/app/frontend/src/components/ui/avatar.jsx",
        "skeleton": "/app/frontend/src/components/ui/skeleton.jsx"
      }
    },
    "public_site_shell": {
      "header": {
        "pattern": "Sticky top header with subtle blur; left logo + nav; right CTA buttons.",
        "classes": "sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        "nav": "Use NavigationMenu for desktop; Sheet for mobile.",
        "cta": [
          "Primary: Donate (accent/terracotta)",
          "Secondary: Get Involved (outline/green)"
        ],
        "data_testids": {
          "donate": "header-donate-button",
          "get_involved": "header-get-involved-button",
          "mobile_menu": "header-mobile-menu-button"
        }
      },
      "footer": {
        "pattern": "3-column footer: About + Quick links + Contact; bottom legal bar with registration note.",
        "trust_row": "Add small row for 'Registered since 2016' + 'Delhi, India' + 'Transparency' links.",
        "data_testids": {
          "newsletter": "footer-newsletter-form",
          "legal_note": "footer-legal-registration-note"
        }
      }
    },
    "home_page_sections": {
      "hero": {
        "layout": "Split on desktop (text left, photo right). On mobile: stacked with CTAs first.",
        "background": "Use allowed subtle gradient + noise overlay (max 20% viewport).",
        "cta": "Two buttons + small trust chips (Registered Society, Since 2016, Delhi).",
        "components": ["Card", "Button", "Badge"],
        "data_testids": {
          "hero_primary": "home-hero-donate-button",
          "hero_secondary": "home-hero-get-involved-button"
        }
      },
      "impact_stats": {
        "pattern": "Horizontal stats bar with animated counters; each stat has label + small caption.",
        "components": ["Card", "Separator"],
        "motion": "Count-up on in-view; respect prefers-reduced-motion.",
        "data_testids": {
          "stats_bar": "home-impact-stats-bar"
        }
      },
      "programs_preview": {
        "pattern": "3-up card grid (1 col mobile, 2 col sm, 3 col lg). Each card: photo, title, 2-line summary, impact mini-metric, CTA.",
        "components": ["Card", "Badge", "Button"],
        "data_testids": {
          "program_card": "home-program-card"
        }
      },
      "featured_blog": {
        "pattern": "Featured post as large card with image + excerpt; secondary list of 3 links.",
        "components": ["Card", "Badge"],
        "data_testids": {
          "featured_blog": "home-featured-blog"
        }
      },
      "testimonials_partners": {
        "pattern": "Testimonials carousel (short quotes) + partner logos strip.",
        "components": ["Carousel", "Card"],
        "data_testids": {
          "testimonials": "home-testimonials-carousel",
          "partners": "home-partners-strip"
        }
      },
      "newsletter": {
        "pattern": "Compact signup card with 1 input + submit; reassure privacy.",
        "components": ["Card", "Input", "Button"],
        "data_testids": {
          "newsletter_email": "newsletter-email-input",
          "newsletter_submit": "newsletter-submit-button"
        }
      }
    },

    "about_page_sections": {
      "registration_block": {
        "pattern": "Credibility card with registration details, year founded, governance notes, and downloadable docs links (annual report, registration certificate).",
        "components": ["Card", "Button", "Separator"],
        "data_testids": {
          "registration_block": "about-registration-credibility-block"
        }
      },
      "team_grid": {
        "pattern": "Avatar + name + role + short bio; optional LinkedIn icon.",
        "components": ["Card", "Avatar"],
        "data_testids": {
          "team_grid": "about-team-grid"
        }
      },
      "timeline": {
        "pattern": "Milestones since 2016 as vertical timeline; each node is a small card.",
        "components": ["Card", "Badge"],
        "data_testids": {
          "timeline": "about-milestones-timeline"
        }
      }
    },

    "program_detail": {
      "layout": "Hero image + title + quick facts; sticky side card on desktop with Support CTA.",
      "gallery": "Use Dialog as lightbox; thumbnails in responsive grid.",
      "impact_numbers": "Use Card with 2x2 grid of metrics.",
      "data_testids": {
        "support_cta": "program-support-cta-button",
        "lightbox": "program-gallery-lightbox"
      }
    },

    "gallery_page": {
      "filters": "Use Tabs or ToggleGroup for categories; include search input.",
      "lightbox": "Dialog with carousel navigation.",
      "data_testids": {
        "gallery_filters": "gallery-filters",
        "gallery_grid": "gallery-grid"
      }
    },

    "get_involved_page": {
      "volunteer_form": {
        "components": ["Form", "Input", "Select", "Checkbox", "Textarea", "Button", "Calendar"],
        "notes": "Use Calendar for availability date selection; keep form short; show success toast via Sonner.",
        "data_testids": {
          "volunteer_form": "volunteer-signup-form",
          "submit": "volunteer-form-submit-button"
        }
      },
      "careers": {
        "pattern": "Listings as Accordion items; each has Apply button opening Dialog.",
        "components": ["Accordion", "Dialog", "Button"],
        "data_testids": {
          "careers_list": "careers-list"
        }
      },
      "csr_form": {
        "pattern": "Corporate partnership inquiry form with organization fields and message.",
        "components": ["Form", "Input", "Textarea", "Button"],
        "data_testids": {
          "csr_form": "csr-inquiry-form",
          "csr_submit": "csr-inquiry-submit-button"
        }
      }
    },

    "donate_page": {
      "donation_form": {
        "pattern": "Amount presets + custom amount + one-time/recurring toggle; donor details; summary card.",
        "components": ["Card", "RadioGroup", "Input", "Switch", "Button", "Separator"],
        "payment": "MOCK Razorpay: show 'Proceed to Payment' button that triggers a Dialog explaining this is a demo.",
        "data_testids": {
          "preset": "donation-amount-preset",
          "custom": "donation-custom-amount-input",
          "recurring": "donation-recurring-toggle",
          "submit": "donation-submit-button"
        }
      },
      "bank_details": {
        "pattern": "Bank transfer/cheque details in a bordered Card with copy-to-clipboard buttons.",
        "components": ["Card", "Button", "Tooltip"],
        "data_testids": {
          "bank_details": "donation-bank-details"
        }
      },
      "transparency": {
        "pattern": "Simple 'Where your money goes' breakdown using Progress bars (not gradients).",
        "components": ["Card", "Progress"],
        "data_testids": {
          "transparency": "donation-transparency-breakdown"
        }
      }
    },

    "blog": {
      "list": {
        "pattern": "Search + category filter + cards list; pagination.",
        "components": ["Input", "Select", "Card", "Pagination"],
        "data_testids": {
          "blog_search": "blog-search-input",
          "blog_category": "blog-category-select"
        }
      },
      "detail": {
        "pattern": "Reading container, sticky TOC on desktop (optional), related posts.",
        "components": ["Separator", "Badge"],
        "data_testids": {
          "blog_title": "blog-detail-title"
        }
      }
    },

    "contact": {
      "map": "Embed Google Map in AspectRatio; lazy-load iframe; provide 'Open in Google Maps' link.",
      "form": {
        "components": ["Form", "Input", "Textarea", "Button"],
        "data_testids": {
          "contact_form": "contact-form",
          "contact_submit": "contact-form-submit-button"
        }
      }
    },

    "admin_cms": {
      "visual": "Clean, utilitarian, warm-neutral surfaces; avoid heavy imagery; prioritize tables and forms.",
      "layout": "Sidebar + topbar; breadcrumb; page header with primary action.",
      "components": ["Table", "Tabs", "Dialog", "Sheet", "DropdownMenu", "Input", "Select", "Button", "Badge", "Pagination", "Skeleton"],
      "data_testids": {
        "admin_sidebar": "admin-sidebar",
        "admin_logout": "admin-logout-button"
      }
    }
  },

  "buttons": {
    "style": "Professional-warm (medium radius, subtle elevation).",
    "tokens": {
      "radius": "rounded-xl",
      "primary": "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent))]/90 focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
      "secondary": "border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5",
      "ghost": "text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/8"
    },
    "interaction": {
      "hover": "Use transition-colors duration-200; add subtle shadow on primary hover only.",
      "press": "active:scale-[0.98] (avoid transition-all).",
      "loading": "Show spinner + 'Processing…' label; disable button."
    }
  },

  "motion_and_microinteractions": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": [
        "Use for section entrance (fade+slide 12px), counters in-view, and dialog transitions.",
        "Respect prefers-reduced-motion: disable transforms and count-up animation."
      ]
    },
    "patterns": {
      "scroll_reveal": "Sections animate once when 20% in view.",
      "parallax": "Very subtle (2–6px) on hero image only; disable on reduced motion.",
      "cta": "Primary CTA hover: slight lift shadow; no glow."
    }
  },

  "data_visualization": {
    "library": {
      "recommended": "recharts",
      "install": "npm i recharts",
      "use_cases": [
        "Admin dashboard: donations over time, submissions volume, newsletter growth.",
        "Donate page transparency: simple bar chart or progress bars (prefer Progress for public)."
      ]
    },
    "chart_style": {
      "grid": "stroke: hsl(var(--border))",
      "primary_series": "hsl(var(--primary))",
      "accent_series": "hsl(var(--accent))",
      "tooltip": "Use shadcn Tooltip/Popover styling; avoid heavy shadows."
    }
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast for all text.",
      "Keyboard navigable menus, dialogs, forms (Radix/shadcn defaults help).",
      "Visible focus ring using --ring.",
      "Alt text required for all images; captions for sensitive/important photos.",
      "Use semantic headings order (H1 once per page).",
      "Provide error messages with aria-live region for forms."
    ],
    "forms": {
      "rules": [
        "Always use shadcn Form + Label components.",
        "Error text: text-sm text-destructive; include data-testid='form-error-message'.",
        "Success: Sonner toast + inline confirmation block."
      ]
    }
  },

  "performance": {
    "rules": [
      "Lazy-load below-the-fold images (loading='lazy').",
      "Use responsive images with width/height to prevent CLS.",
      "Use Skeleton components for loading states.",
      "Avoid large background videos; if used, provide poster + reduced motion fallback."
    ]
  },

  "image_urls": {
    "hero": [
      {
        "url": "https://images.unsplash.com/photo-1564665619149-8ec9aa5c3d0d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwaW5kaWF8ZW58MHx8fGdyZWVufDE3ODM5Mjk2MzZ8MA&ixlib=rb-4.1.0&q=85",
        "description": "Community members near a tree; use as warm, human hero image (add overlay for readability)."
      }
    ],
    "program_cards": [
      {
        "url": "https://images.unsplash.com/photo-1617153817979-283ffdcd52f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB2b2x1bnRlZXJzJTIwcGxhbnRpbmclMjBzYXBsaW5nc3xlbnwwfHx8Z3JlZW58MTc4MzkyOTY1N3ww&ixlib=rb-4.1.0&q=85",
        "description": "Hands planting sapling; use for 'Urban Greening' program card."
      },
      {
        "url": "https://images.unsplash.com/photo-1601911025787-51f019f1d052?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjB2b2x1bnRlZXJzJTIwcGxhbnRpbmclMjBzYXBsaW5nc3xlbnwwfHx8Z3JlZW58MTc4MzkyOTY1N3ww&ixlib=rb-4.1.0&q=85",
        "description": "People working near water/fields; use for 'Wetland & Water Stewardship' program card."
      }
    ],
    "gallery_placeholders": [
      {
        "url": "https://images.unsplash.com/photo-1600105515723-275d95d09cf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxjb21tdW5pdHklMjB0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzJTIwaW5kaWF8ZW58MHx8fGdyZWVufDE3ODM5Mjk2MzZ8MA&ixlib=rb-4.1.0&q=85",
        "description": "Green open landscape; use as gallery filler until NGO uploads real photos."
      }
    ]
  },

  "instructions_to_main_agent": {
    "critical": [
      "Remove default CRA App.css centering/dark header patterns; do not use .App { text-align:center }.",
      "Update /app/frontend/src/index.css :root HSL tokens to match this palette; keep shadcn structure.",
      "Use .js components (not .tsx).",
      "Every interactive and key informational element MUST include data-testid in kebab-case.",
      "Donation payment is MOCK Razorpay: clearly label as demo in UI and logs."
    ],
    "page_build_order": [
      "1) Public shell (Header/Footer with legal note)",
      "2) Home sections (hero, stats, programs, featured blog, testimonials/partners, newsletter)",
      "3) About (registration block, team, timeline)",
      "4) Donate (form + bank details + transparency)",
      "5) Programs index/detail + gallery lightbox",
      "6) Get involved forms + careers",
      "7) Blog list/detail",
      "8) Contact",
      "9) Admin CMS shell + CRUD tables/forms"
    ],
    "copy_guidance": [
      "Use realistic NGO copy (Delhi localities, 2016 founding, community welfare + environment).",
      "Add 'Transparency' links: annual report, governance, contact.",
      "Add small captions under photos: location + month/year when available."
    ]
  },

  "appendix_general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
