import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useSettings } from "@/context/SettingsContext";

const QUICK_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Our Work" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "News & Stories" },
  { to: "/get-involved", label: "Volunteer" },
  { to: "/donate", label: "Donate" },
];

export const Footer = () => {
  const { settings } = useSettings();
  const org = settings?.org || {};
  const social = settings?.social || {};
  
  // Add your actual Instagram URL inside the quotes on line 21
 const socials = [
    // Replace "YOUR_FACEBOOK_USERNAME" with your actual page handle
    { href: "https://www.facebook.com/YOUR_FACEBOOK_USERNAME/", icon: Facebook, label: "Facebook" },
    { href: "https://www.instagram.com/hnes.india/", icon: Instagram, label: "Instagram" },
    { href: social.twitter, icon: Twitter, label: "Twitter / X" },
    { href: social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.youtube.com/@HNES2016", icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-bold text-primary">
                Human &amp; Natural Environment Society
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {org.tagline || "Caring for people. Restoring nature."} Working across Delhi since 2016 on
              tree plantation, water conservation, waste management and community welfare.
            </p>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-2">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="font-heading text-base font-semibold text-primary">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-heading text-base font-semibold text-primary">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{org.address || "H.No-372, Main Road, Village Ladpur, Delhi-110081"}</span>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${org.email || "hnes2016@gmail.com"}`} className="hover:text-primary hover:underline">
                  {org.email || "hnes2016@gmail.com"}
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
              Registered Society since 2016 &middot; Delhi, India
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-primary">Stay Updated</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Monthly updates on drives, impact and volunteer opportunities. No spam, ever.
            </p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-muted/40 py-4">
        <div
          className="mx-auto w-full max-w-6xl space-y-2 px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8"
          data-testid="footer-legal-registration-note"
        >
          <p>
            <strong>Human &amp; Natural Environment Society</strong> is a registered society under the
            Societies Registration Act, 1860. Registration No. {org.reg_no || "S/26652/SDM/NW/2016"}.
          </p>
          <p>
            Human &amp; Natural Environment Society is a private body (society). Its name and registration do
            not imply endorsement of any commercial product, trade or profession.
          </p>
          <p>&copy; {new Date().getFullYear()} Human &amp; Natural Environment Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
