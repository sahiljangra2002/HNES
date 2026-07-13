import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, HandHeart, Leaf, ShieldCheck, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, resolveImg, formatDate } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

const HERO_IMG =
  "https://images.unsplash.com/photo-1564665619149-8ec9aa5c3d0d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

export default function Home() {
  const { settings } = useSettings();
  const [programs, setPrograms] = useState(null);
  const [posts, setPosts] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get("/programs").then(({ data }) => setPrograms(data)).catch(() => setPrograms([]));
    api.get("/blog", { params: { limit: 4 } }).then(({ data }) => setPosts(data.posts)).catch(() => setPosts([]));
    api.get("/testimonials").then(({ data }) => setTestimonials(data)).catch(() => {});
  }, []);

  const org = settings?.org || {};
  const stats = settings?.impact_stats || [];
  const partners = settings?.partners || [];
  const featured = (programs || []).filter((p) => p.featured).slice(0, 4);
  const featuredPost = posts?.[0];
  const morePosts = posts?.slice(1, 4) || [];

  return (
    <div>
      <Seo />
      {/* Hero */}
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/30 bg-card text-primary">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Registered Society
              </Badge>
              <Badge variant="outline" className="border-primary/30 bg-card text-primary">
                Since 2016
              </Badge>
              <Badge variant="outline" className="border-primary/30 bg-card text-primary">
                <MapPin className="mr-1 h-3.5 w-3.5" /> Delhi, India
              </Badge>
            </div>
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Caring for people.
              <br />
              Restoring nature.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {org.mission ||
                "We work with communities across Delhi on tree plantation, water conservation, waste management, education and welfare - so people and nature can thrive together."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-accent text-accent-foreground shadow-sm transition-colors duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98]"
                data-testid="home-hero-donate-button"
              >
                <Link to="/donate">
                  <Heart className="mr-1.5 h-4 w-4" /> Donate Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                data-testid="home-hero-get-involved-button"
              >
                <Link to="/get-involved">
                  <HandHeart className="mr-1.5 h-4 w-4" /> Get Involved
                </Link>
              </Button>
            </div>
          </div>
          <Reveal className="relative">
            <img
              src={HERO_IMG}
              alt="Community members planting a tree together in Delhi"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_20px_50px_-20px_rgba(20,20,20,0.4)]"
              width="700"
              height="525"
            />
            <div className="absolute -bottom-4 left-4 rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-md">
              <span className="font-semibold text-primary">25,000+ trees</span>
              <span className="text-muted-foreground"> planted &amp; cared for</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Impact stats */}
      <section className="border-y border-border bg-primary text-primary-foreground" data-testid="home-impact-stats-bar">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.id || s.label} className="text-center">
              <div className="font-heading text-3xl font-bold sm:text-4xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm font-semibold">{s.label}</div>
              <div className="mt-0.5 text-xs text-primary-foreground/70">{s.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs preview */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">Our programs</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  Where your support goes to work
                </h2>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:bg-primary/8 hover:bg-secondary">
                <Link to="/programs">
                  View all programs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs === null
              ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
              : featured.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.06}>
                    <Link to={`/programs/${p.slug}`} className="group block h-full" data-testid="home-program-card">
                      <Card className="card-soft h-full overflow-hidden rounded-2xl transition-transform duration-200 group-hover:-translate-y-1">
                        <img
                          src={resolveImg(p.image_url)}
                          alt={p.title}
                          loading="lazy"
                          className="h-40 w-full object-cover"
                          width="400"
                          height="160"
                        />
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
                          <h3 className="font-heading text-lg font-semibold leading-snug text-primary">{p.title}</h3>
                          <p className="line-clamp-3 mt-2 text-sm text-muted-foreground">{p.summary}</p>
                          <span className="mt-3 inline-flex items-center text-sm font-medium text-accent">
                            Learn more <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Featured story */}
      <section className="bg-secondary/50 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">From the field</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Latest stories &amp; updates
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            {posts === null ? (
              <Skeleton className="h-96 rounded-2xl lg:col-span-3" />
            ) : featuredPost ? (
              <Reveal className="lg:col-span-3">
                <Link to={`/blog/${featuredPost.slug}`} className="group block h-full" data-testid="home-featured-blog">
                  <Card className="card-soft h-full overflow-hidden rounded-2xl">
                    <img
                      src={resolveImg(featuredPost.cover_image)}
                      alt={featuredPost.title}
                      loading="lazy"
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      width="720"
                      height="256"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary">{featuredPost.category}</Badge>
                        <span>{formatDate(featuredPost.created_at)}</span>
                      </div>
                      <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-primary group-hover:underline sm:text-2xl">
                        {featuredPost.title}
                      </h3>
                      <p className="line-clamp-3 mt-2 text-sm leading-relaxed text-muted-foreground">
                        {featuredPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ) : null}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {morePosts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <Card className="card-soft rounded-2xl p-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary">{p.category}</Badge>
                        <span>{formatDate(p.created_at)}</span>
                      </div>
                      <h3 className="line-clamp-2 mt-2 font-heading text-base font-semibold text-primary group-hover:underline">
                        {p.title}
                      </h3>
                    </Card>
                  </Link>
                </Reveal>
              ))}
              <Button asChild variant="outline" className="mt-auto rounded-xl border-primary/30 text-primary hover:bg-primary/5">
                <Link to="/blog">
                  Read all stories <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials + partners */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Voices from the community</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              People we work with
            </h2>
          </Reveal>
          {testimonials.length > 0 && (
            <Carousel className="mt-8" opts={{ align: "start", loop: true }} data-testid="home-testimonials-carousel">
              <CarouselContent>
                {testimonials.map((t) => (
                  <CarouselItem key={t.id} className="md:basis-1/2">
                    <Card className="card-soft h-full rounded-2xl p-6">
                      <Quote className="h-6 w-6 text-accent" aria-hidden="true" />
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{t.quote}</p>
                      <div className="mt-4">
                        <div className="font-semibold text-primary">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-4 flex justify-end gap-2">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          )}
          {partners.length > 0 && (
            <div className="mt-10 rounded-2xl border border-border bg-secondary/50 p-6" data-testid="home-partners-strip">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Working alongside
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {partners.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 text-sm font-medium text-primary/80">
                    <Leaf className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-secondary/50 py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Get our monthly impact update
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            One email a month with drive announcements, impact numbers and volunteer opportunities.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
