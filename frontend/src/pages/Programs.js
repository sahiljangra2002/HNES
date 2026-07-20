import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, resolveImg } from "@/lib/api";

export default function Programs() {
  const [programs, setPrograms] = useState(null);

  useEffect(() => {
    api.get("/programs").then(({ data }) => setPrograms(data)).catch(() => setPrograms([]));
  }, []);

  return (
    <div>
      <Seo
        title="Our Work & Programs"
        description="Tree plantation, water conservation, waste management, community education and wildlife protection programs run by Human & Natural Environment Society in Delhi."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Our work</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Programs that restore &amp; uplift
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Every program is community-led, measured for impact, and open to volunteers and supporters. Explore
            what we do and find the cause closest to your heart.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {programs === null
              ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
              : programs.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <Link to={`/programs/${p.slug}`} className="group block" data-testid="program-list-card">
                      <Card className="card-soft overflow-hidden rounded-2xl transition-transform duration-200 group-hover:-translate-y-0.5">
                        <div className="grid md:grid-cols-5">
                          <img
                           src={p.title?.includes("Tree Plantation") 
                              ? "https://i.ibb.co/hxKmGk9p/Whats-App-Image-2026-07-14-at-11-36-37-AM.jpg" 
                              : resolveImg(p.image_url)}
                          />
                          <CardContent className="p-6 md:col-span-3 md:p-8">
                            <Badge variant="secondary">{p.category}</Badge>
                            <h2 className="mt-3 font-heading text-xl font-semibold text-primary group-hover:underline sm:text-2xl">
                              {p.title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{p.summary}</p>
                            {p.impact_numbers?.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                                {p.impact_numbers.slice(0, 3).map((n) => (
                                  <div key={n.label}>
                                    <div className="stat-number font-heading text-lg font-bold text-accent">{n.value}</div>
                                    <div className="text-xs text-muted-foreground">{n.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                              View program <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </span>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
