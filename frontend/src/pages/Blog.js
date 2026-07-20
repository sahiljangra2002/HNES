import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, resolveImg, formatDate } from "@/lib/api";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    api.get("/blog/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setData(null);
    api
      .get("/blog", { params: { search, category, page, limit: 9 } })
      .then(({ data }) => setData(data))
      .catch(() => setData({ posts: [], total: 0, pages: 1 }));
  }, [search, category, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next);
  };

  return (
    <div>
      <Seo
        title="News & Stories"
        description="Field stories, drive reports and updates from Human & Natural Environment Society's work across Delhi."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">News & stories</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            From the field
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Drive reports, milestones and stories from the communities we work with.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <form
              className="relative flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                updateParams({ search: searchInput, page: "" });
              }}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search stories…"
                className="pl-9"
                aria-label="Search blog posts"
                data-testid="blog-search-input"
              />
            </form>
            <Select
              value={category || "all"}
              onValueChange={(v) => updateParams({ category: v === "all" ? "" : v, page: "" })}
            >
              <SelectTrigger className="w-full sm:w-56" data-testid="blog-category-select" aria-label="Filter by category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data === null
              ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)
              : data.posts.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.05}>
                    <Link to={`/blog/${p.slug}`} className="group block h-full" data-testid="blog-post-card">
                      <Card className="card-soft h-full overflow-hidden rounded-2xl transition-transform duration-200 group-hover:-translate-y-1">
                        <img
                          src={
                            p.title?.toLowerCase().includes("narela")
                              ? "YOUR_TREE_PLANTING_OR_NARELA_CLOUDINARY_URL"
                              : p.title?.toLowerCase().includes("sapling")
                              ? "YOUR_SAPLING_ROHINI_CLOUDINARY_URL"
                              : p.title?.toLowerCase().includes("rainwater")
                              ? "YOUR_RAINWATER_CLOUDINARY_URL"
                              : resolveImg(p.cover_image)
                          }
                          alt={p.title || "Blog post image"}
                          loading="lazy"
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          width="400"
                          height="176"
                        />
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <Badge variant="secondary">{p.category}</Badge>
                            <span>{formatDate(p.created_at)}</span>
                          </div>
                          <h2 className="line-clamp-2 mt-3 font-heading text-lg font-semibold leading-snug text-primary group-hover:underline">
                            {p.title}
                          </h2>
                          <p className="line-clamp-3 mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
          </div>

          {data !== null && data.posts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">No stories match your search.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl border-primary/30 text-primary"
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({});
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {data !== null && data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })} className="rounded-xl">
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.pages}
              </span>
              <Button variant="outline" disabled={page >= data.pages} onClick={() => updateParams({ page: String(page + 1) })} className="rounded-xl">
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
