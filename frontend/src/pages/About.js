import { useEffect, useState } from "react";
import { ShieldCheck, Landmark, CalendarDays, MapPin, ScrollText, Eye, Target, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, resolveImg } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function About() {
  const { settings } = useSettings();
  const [team, setTeam] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    api.get("/team").then(({ data }) => setTeam(data)).catch(() => {});
    api.get("/milestones").then(({ data }) => setMilestones(data)).catch(() => {});
  }, []);

  const org = settings?.org || {};

  return (
    <div>
      <Seo
        title="About Us"
        description="Our mission, story, team and legal registration details. Human & Natural Environment Society is a registered society working in Delhi since 2016."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">About us</p>
          <h1 className="mt-2 max-w-3xl font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            A community that chose to act
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {org.story?.split("\n")[0] ||
              "Human & Natural Environment Society began in 2016 as a small circle of neighbours in Village Ladpur, North-West Delhi."}
          </p>
        </div>
      </section>

      {/* Mission / Vision / Story */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Target, title: "Our Mission", text: org.mission },
            { icon: Eye, title: "Our Vision", text: org.vision },
            { icon: BookOpen, title: "Our Story", text: org.story },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <Card className="card-soft h-full rounded-2xl">
                <CardContent className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-heading text-xl font-semibold text-primary">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Registration & legal credibility */}
      <section className="bg-secondary/50 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Card className="card-soft rounded-2xl" data-testid="about-registration-credibility-block">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl">
                      Registration &amp; Compliance
                    </h2>
                    <p className="text-sm text-muted-foreground">Verified legal credentials of the society</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legal name</div>
                      <div className="text-sm font-medium">{org.legal_name || "Human & Natural Environment Society"}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registered under</div>
                      <div className="text-sm font-medium">{org.reg_act || "The Societies Registration Act, 1860"}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration No.</div>
                      <div className="text-sm font-medium">{org.reg_no || "S/26652/SDM/NW/2016"}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        (to be verified against the original certificate before publication)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration date</div>
                      <div className="text-sm font-medium">{org.reg_date || "11 August 2016"}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Governing authority</div>
                      <div className="text-sm font-medium">{org.reg_authority || "Registrar of Societies, District North-West, Govt. of NCT of Delhi"}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registered address</div>
                      <div className="text-sm font-medium">{org.address}</div>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                  <p>
                    <strong>Human &amp; Natural Environment Society</strong> is a private body (society) registered
                    under the Societies Registration Act, 1860. The full legal name is used in all official and
                    legal contexts without translation or abbreviation, as required by the terms of registration.
                  </p>
                  <p>
                    The society's name and registration must not be presented as endorsing any commercial product,
                    trade or profession.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Our people</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Team &amp; governing body
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="about-team-grid">
            {team.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05}>
                <Card className="card-soft h-full rounded-2xl">
                  <CardContent className="flex gap-4 p-5">
                    <Avatar className="h-14 w-14 border border-border">
                      {m.photo_url ? <AvatarImage src={resolveImg(m.photo_url)} alt={m.name} /> : null}
                      <AvatarFallback className="bg-primary/10 font-heading font-semibold text-primary">
                        {initials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-primary">{m.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">{m.role}</Badge>
                      <p className="line-clamp-3 mt-2 text-xs leading-relaxed text-muted-foreground">{m.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-secondary/50 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Milestones</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Our journey since 2016
            </h2>
          </Reveal>
          <ol className="relative mt-10 space-y-8 border-l-2 border-primary/20 pl-6" data-testid="about-milestones-timeline">
            {milestones.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.04}>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-background" />
                  <Badge className="bg-primary text-primary-foreground">{m.year}</Badge>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-primary">{m.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
