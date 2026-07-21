import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone, CheckCircle2, ExternalLink, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const org = settings?.org || {};
  const social = settings?.social || {};
  const mapQuery = encodeURIComponent(settings?.map_query || "Village Ladpur, Delhi 110081");
  const socials = [
    { href: social.facebook, icon: Facebook, label: "Facebook" },
    { href: social.instagram, icon: Instagram, label: "Instagram" },
    { href: social.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/submissions", { type: "contact", ...form });
      toast.success(data.message);
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Seo
        title="Contact Us"
        description="Reach Human & Natural Environment Society at Village Ladpur, Delhi-110081. Write to us about volunteering, donations, partnerships or media."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Contact</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            We'd love to hear from you
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Questions about volunteering, donations, partnerships or media - drop us a line and we will reply
            within 2-3 working days.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <Card className="card-soft rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                {done ? (
                  <div className="py-12 text-center" data-testid="contact-success-message">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-4 font-heading text-xl font-semibold text-primary">Message received!</h2>
                    <p className="mt-2 text-sm text-muted-foreground">We will reply within 2-3 working days.</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4" data-testid="contact-form">
                    <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <h2 className="font-heading text-xl font-semibold text-primary">Send a message</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="c-name">Full name *</Label>
                        <Input id="c-name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="contact-name-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="c-email">Email *</Label>
                        <Input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="contact-email-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="c-phone">Phone</Label>
                        <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="contact-phone-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="c-subject">Subject</Label>
                        <Input id="c-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} data-testid="contact-subject-input" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-message">Message *</Label>
                      <Textarea id="c-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="contact-message-input" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" data-testid="contact-form-submit-button">
                      {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>) : "Send message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.08}>
              <Card className="card-soft rounded-2xl">
                <CardContent className="space-y-4 p-6">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registered address</div>
                      <p className="text-sm font-medium">{org.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</div>
                      <a href={`mailto:${org.email}`} className="text-sm font-medium hover:text-primary hover:underline">{org.email}</a>
                    </div>
                  </div>
                  {org.phone && (
                    <div className="flex gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</div>
                        <p className="text-sm font-medium">{org.phone}</p>
                      </div>
                    </div>
                  )}
                  {socials.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {socials.map(({ href, icon: Icon, label }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground">
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.14}>
              <Card className="card-soft overflow-hidden rounded-2xl">
                <iframe
                  title="Map showing the registered address of Human & Natural Environment Society"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="p-3 text-right">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
