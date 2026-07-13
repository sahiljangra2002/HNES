import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, HandHeart, Briefcase, Building2, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api } from "@/lib/api";

const INTERESTS = [
  "Tree Plantation & Greening",
  "Water Conservation",
  "Waste Management & Clean-ups",
  "Teaching & Education",
  "Wildlife Protection",
  "Event Management & Logistics",
  "Photography & Social Media",
];

export default function GetInvolved() {
  const [careers, setCareers] = useState([]);
  const [volunteer, setVolunteer] = useState({ name: "", email: "", phone: "", city: "", interest: "", message: "", website: "" });
  const [partner, setPartner] = useState({ name: "", email: "", phone: "", organization: "", message: "", website: "" });
  const [vLoading, setVLoading] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [vDone, setVDone] = useState(false);
  const [pDone, setPDone] = useState(false);

  useEffect(() => {
    api.get("/careers").then(({ data }) => setCareers(data)).catch(() => {});
  }, []);

  const submitVolunteer = async (e) => {
    e.preventDefault();
    if (!volunteer.interest) {
      toast.error("Please choose an area of interest.");
      return;
    }
    setVLoading(true);
    try {
      const { data } = await api.post("/submissions", { type: "volunteer", ...volunteer });
      toast.success(data.message);
      setVDone(true);
    } catch {
      toast.error("Something went wrong. Please check your details and try again.");
    } finally {
      setVLoading(false);
    }
  };

  const submitPartner = async (e) => {
    e.preventDefault();
    setPLoading(true);
    try {
      const { data } = await api.post("/submissions", { type: "partner", ...partner });
      toast.success(data.message);
      setPDone(true);
    } catch {
      toast.error("Something went wrong. Please check your details and try again.");
    } finally {
      setPLoading(false);
    }
  };

  return (
    <div>
      <Seo
        title="Get Involved - Volunteer & Partner"
        description="Volunteer for plantation drives and education circles, apply for internships, or partner with Human & Natural Environment Society through CSR programs."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Get involved</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Lend your hands to the cause
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Join a weekend drive, take up an internship, or bring your organisation's CSR program to the
            grassroots - there is a place for everyone here.
          </p>
        </div>
      </section>

      {/* Volunteer form */}
      <section className="py-14" id="volunteer">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HandHeart className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-bold text-primary sm:text-3xl">Volunteer with us</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Our 1,200+ volunteers are students, homemakers, professionals and retirees. Most drives happen on
                weekends and need no prior experience - just willingness. Once you sign up, our volunteer
                coordinator will call you before the next drive in your area.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {["Weekend plantation & clean-up drives", "Teaching in evening study circles", "Event photography and social media", "Drive coordination & logistics"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="card-soft rounded-2xl">
              <CardContent className="p-6">
                {vDone ? (
                  <div className="py-10 text-center" data-testid="volunteer-success-message">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-4 font-heading text-xl font-semibold text-primary">Thank you for stepping up!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our volunteer coordinator will contact you before the next drive.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitVolunteer} className="space-y-4" data-testid="volunteer-signup-form">
                    <input type="text" value={volunteer.website} onChange={(e) => setVolunteer({ ...volunteer, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="v-name">Full name *</Label>
                        <Input id="v-name" required minLength={2} value={volunteer.name} onChange={(e) => setVolunteer({ ...volunteer, name: e.target.value })} data-testid="volunteer-name-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="v-email">Email *</Label>
                        <Input id="v-email" type="email" required value={volunteer.email} onChange={(e) => setVolunteer({ ...volunteer, email: e.target.value })} data-testid="volunteer-email-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="v-phone">Phone *</Label>
                        <Input id="v-phone" type="tel" required value={volunteer.phone} onChange={(e) => setVolunteer({ ...volunteer, phone: e.target.value })} data-testid="volunteer-phone-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="v-city">City *</Label>
                        <Input id="v-city" required value={volunteer.city} onChange={(e) => setVolunteer({ ...volunteer, city: e.target.value })} data-testid="volunteer-city-input" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Area of interest *</Label>
                      <Select value={volunteer.interest} onValueChange={(v) => setVolunteer({ ...volunteer, interest: v })}>
                        <SelectTrigger data-testid="volunteer-interest-select" aria-label="Area of interest">
                          <SelectValue placeholder="Choose an area" />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERESTS.map((i) => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="v-message">Anything you'd like to tell us?</Label>
                      <Textarea id="v-message" rows={3} value={volunteer.message} onChange={(e) => setVolunteer({ ...volunteer, message: e.target.value })} data-testid="volunteer-message-input" />
                    </div>
                    <Button type="submit" disabled={vLoading} className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" data-testid="volunteer-form-submit-button">
                      {vLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>) : "Sign up to volunteer"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Careers */}
      <section className="bg-secondary/50 py-14" id="careers">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-primary sm:text-3xl">Careers &amp; internships</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Open roles and internships with the society. To apply, use the volunteer form above mentioning the
              role, or email us with your resume.
            </p>
          </Reveal>
          <Accordion type="single" collapsible className="mt-6" data-testid="careers-list">
            {careers.map((c) => (
              <AccordionItem key={c.id} value={c.id} className="card-soft mb-3 rounded-2xl border px-5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-wrap items-center gap-2 text-left">
                    <span className="font-heading text-base font-semibold text-primary">{c.title}</span>
                    <Badge variant="secondary" className="text-xs">{c.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {c.location}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {careers.length === 0 && (
            <p className="mt-6 text-sm text-muted-foreground">No open positions right now - check back soon or volunteer with us meanwhile.</p>
          )}
        </div>
      </section>

      {/* Partner form */}
      <section className="py-14" id="partner">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-bold text-primary sm:text-3xl">Partner with us</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Bring your organisation's CSR program to the grassroots. Our corporate partners fund rainwater
                harvesting systems, sponsor plantation drives and organise employee volunteering days - all with
                transparent reporting, photos and expenditure statements.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="card-soft rounded-2xl">
              <CardContent className="p-6">
                {pDone ? (
                  <div className="py-10 text-center" data-testid="partner-success-message">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-4 font-heading text-xl font-semibold text-primary">Thank you!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Our team will reach out to discuss the partnership.</p>
                  </div>
                ) : (
                  <form onSubmit={submitPartner} className="space-y-4" data-testid="csr-inquiry-form">
                    <input type="text" value={partner.website} onChange={(e) => setPartner({ ...partner, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="p-name">Contact person *</Label>
                        <Input id="p-name" required minLength={2} value={partner.name} onChange={(e) => setPartner({ ...partner, name: e.target.value })} data-testid="partner-name-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-org">Organization *</Label>
                        <Input id="p-org" required value={partner.organization} onChange={(e) => setPartner({ ...partner, organization: e.target.value })} data-testid="partner-organization-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-email">Work email *</Label>
                        <Input id="p-email" type="email" required value={partner.email} onChange={(e) => setPartner({ ...partner, email: e.target.value })} data-testid="partner-email-input" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-phone">Phone</Label>
                        <Input id="p-phone" type="tel" value={partner.phone} onChange={(e) => setPartner({ ...partner, phone: e.target.value })} data-testid="partner-phone-input" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="p-message">How would you like to partner? *</Label>
                      <Textarea id="p-message" required rows={4} value={partner.message} onChange={(e) => setPartner({ ...partner, message: e.target.value })} data-testid="partner-message-input" placeholder="CSR funding, employee volunteering, in-kind support…" />
                    </div>
                    <Button type="submit" disabled={pLoading} className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" data-testid="csr-inquiry-submit-button">
                      {pLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>) : "Send partnership inquiry"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
