import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Seo } from "@/components/Seo";
import { api, resolveImg } from "@/lib/api";

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setProgram(null);
    setNotFound(false);
    api
      .get(`/programs/${slug}`)
      .then(({ data }) => setProgram(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">Program not found</h1>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link to="/programs"><ArrowLeft className="mr-1 h-4 w-4" /> Back to programs</Link>
        </Button>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="mt-6 h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <Seo title={program.title} description={program.summary} image={program.image_url} />
      <div className="relative">
        <img
          src={resolveImg(program.image_url)}
          alt={program.title}
          className="h-64 w-full object-cover sm:h-80 lg:h-96"
          width="1400"
          height="384"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
            <Badge className="bg-accent text-accent-foreground">{program.category}</Badge>
            <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">{program.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/programs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> All programs
          </Link>
          <div className="prose-ngo mt-6 max-w-[75ch] text-[15px] text-foreground/85">
            {(program.description || "").split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {program.gallery?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-primary">Photo gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {program.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(img)}
                    className="group overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Open photo ${i + 1} of ${program.title}`}
                  >
                    <img
                      src={resolveImg(img)}
                      alt={`${program.title} - photo ${i + 1}`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width="320"
                      height="240"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-24 space-y-6">
            {program.impact_numbers?.length > 0 && (
              <Card className="card-soft rounded-2xl">
                <CardContent className="p-5">
                  <h2 className="font-heading text-lg font-semibold text-primary">Impact so far</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {program.impact_numbers.map((n) => (
                      <div key={n.label} className="rounded-xl bg-secondary/70 p-3">
                        <div className="stat-number font-heading text-xl font-bold text-accent">{n.value}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{n.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="card-soft rounded-2xl border-accent/30">
              <CardContent className="p-5">
                <h2 className="font-heading text-lg font-semibold text-primary">Support this program</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your donation funds saplings, equipment and volunteer logistics. Every rupee is accounted for.
                </p>
                <Button
                  asChild
                  className="mt-4 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="program-support-cta-button"
                >
                  <Link to={`/donate?program=${program.slug}`}>
                    <Heart className="mr-1.5 h-4 w-4" /> Donate to this program
                  </Link>
                </Button>
                <Button asChild variant="outline" className="mt-2 w-full rounded-xl border-primary/30 text-primary hover:bg-primary/5">
                  <Link to="/get-involved">
                    <HandHeart className="mr-1.5 h-4 w-4" /> Volunteer with us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      <Dialog open={Boolean(lightbox)} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none" data-testid="program-gallery-lightbox">
          <DialogTitle className="sr-only">Program photo</DialogTitle>
          {lightbox && (
            <img src={resolveImg(lightbox)} alt={program.title} className="w-full rounded-2xl object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
