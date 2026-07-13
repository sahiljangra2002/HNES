import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, resolveImg } from "@/lib/api";

export default function GalleryPage() {
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api.get("/gallery").then(({ data }) => setData(data)).catch(() => setData({ items: [], categories: [] }));
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    return category ? data.items.filter((i) => i.category === category) : data.items;
  }, [data, category]);

  const openAt = (idx) => setLightboxIndex(idx);
  const move = (dir) =>
    setLightboxIndex((i) => (i === null ? null : (i + dir + items.length) % items.length));
  const current = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div>
      <Seo
        title="Gallery"
        description="Photos from plantation drives, clean-up shramdaans, education circles and community events organised by Human & Natural Environment Society."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Gallery</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Moments from the field
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Real people, real work - drives, distributions and celebrations captured by our volunteers.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" data-testid="gallery-filters" role="group" aria-label="Filter gallery by category">
            <Button
              variant={category === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory("")}
              className={`rounded-full ${category === "" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary/30 text-primary hover:bg-primary/5"}`}
            >
              All
            </Button>
            {(data?.categories || []).map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(c)}
                className={`rounded-full ${category === c ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary/30 text-primary hover:bg-primary/5"}`}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="gallery-grid">
            {data === null
              ? [...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)
              : items.map((item, idx) => (
                  <Reveal key={item.id} delay={(idx % 4) * 0.04}>
                    <button
                      onClick={() => openAt(idx)}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Open photo: ${item.title}`}
                      data-testid="gallery-item"
                    >
                      <img
                        src={resolveImg(item.image_url)}
                        alt={item.title}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width="300"
                        height="300"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left">
                        <span className="block text-xs font-medium text-white">{item.title}</span>
                        <span className="block text-[10px] text-white/70">{item.caption}</span>
                      </span>
                    </button>
                  </Reveal>
                ))}
          </div>
          {data !== null && items.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">No photos in this category yet.</p>
          )}
        </div>
      </section>

      <Dialog open={Boolean(current)} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">{current?.title || "Gallery photo"}</DialogTitle>
          {current && (
            <div className="relative">
              <img
                src={resolveImg(current.image_url)}
                alt={current.title}
                className="max-h-[80vh] w-full rounded-2xl object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-sm font-medium text-white">{current.title}</div>
                <div className="text-xs text-white/70">{current.caption}</div>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={() => move(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => move(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
