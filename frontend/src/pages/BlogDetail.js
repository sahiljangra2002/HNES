import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo } from "@/components/Seo";
import { api, resolveImg, formatDate } from "@/lib/api";

export default function BlogDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setData(null);
    setNotFound(false);
    window.scrollTo(0, 0);
    api
      .get(`/blog/${slug}`)
      .then(({ data }) => setData(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">Story not found</h1>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link to="/blog"><ArrowLeft className="mr-1 h-4 w-4" /> Back to stories</Link>
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="mt-6 h-8 w-2/3 rounded" />
        <Skeleton className="mt-4 h-40 rounded-2xl" />
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div>
      <Seo title={post.title} description={post.excerpt} image={post.cover_image} />
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> All stories
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{post.category}</Badge>
          <span>{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" aria-hidden="true" /> {post.author}
          </span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl" data-testid="blog-detail-title">
          {post.title}
        </h1>
        <img
          src={resolveImg(post.cover_image)}
          alt={post.title}
          className="mt-8 w-full rounded-2xl object-cover"
          width="768"
          height="400"
        />
        <div className="prose-ngo mt-8 max-w-[75ch] text-[15px] leading-relaxed text-foreground/85 sm:text-base">
          {(post.content || "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} variant="outline" className="border-primary/25 text-primary">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </article>

      {related?.length > 0 && (
        <section className="border-t border-border bg-secondary/50 py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-semibold text-primary">Related stories</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                  <Card className="card-soft h-full overflow-hidden rounded-2xl">
                    <img
                      src={resolveImg(p.cover_image)}
                      alt={p.title}
                      loading="lazy"
                      className="h-36 w-full object-cover"
                      width="360"
                      height="144"
                    />
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">{formatDate(p.created_at)}</div>
                      <h3 className="line-clamp-2 mt-1 font-heading text-base font-semibold text-primary group-hover:underline">
                        {p.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Separator />
    </div>
  );
}
