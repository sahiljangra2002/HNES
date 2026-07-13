import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TreePine, Newspaper, Images, Users, Inbox, HeartHandshake, MailPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, formatINR, formatDate } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setData(data)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const t = data.totals;
  const cards = [
    { label: "New submissions", value: t.new_submissions, icon: Inbox, to: "/admin/inbox", highlight: t.new_submissions > 0 },
    { label: "Donations logged", value: t.donations, icon: HeartHandshake, to: "/admin/donations", sub: formatINR(t.donations_amount) },
    { label: "Newsletter subscribers", value: t.subscribers, icon: MailPlus, to: "/admin/subscribers" },
    { label: "Programs", value: t.programs, icon: TreePine, to: "/admin/programs" },
    { label: "Blog posts", value: t.blog_posts, icon: Newspaper, to: "/admin/blog" },
    { label: "Gallery photos", value: t.gallery_items, icon: Images, to: "/admin/gallery" },
    { label: "Team members", value: t.team_members, icon: Users, to: "/admin/team" },
    { label: "Total submissions", value: t.submissions, icon: Inbox, to: "/admin/inbox" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">A quick look at your website's activity.</p>

      <div className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${data.email_configured ? "border-primary/30 bg-primary/5 text-primary" : "border-amber-300 bg-amber-50 text-amber-900"}`} data-testid="admin-email-status">
        {data.email_configured ? (
          <><CheckCircle2 className="h-4 w-4" /> Email notifications are active.</>
        ) : (
          <><AlertCircle className="h-4 w-4" /> Email notifications are not configured yet - submissions are stored here in the Inbox. Add SendGrid/SMTP keys in the server .env to enable email alerts.</>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to, sub, highlight }) => (
          <Link key={label} to={to} className="group">
            <Card className={`card-soft rounded-2xl transition-transform duration-150 group-hover:-translate-y-0.5 ${highlight ? "border-accent/50" : ""}`}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="stat-number font-heading text-2xl font-bold text-primary">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  {sub && <div className="mt-0.5 text-xs font-semibold text-accent">{sub}</div>}
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${highlight ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-heading text-lg font-semibold text-primary">Recent submissions</h2>
      <div className="mt-3 space-y-2">
        {data.recent_submissions.length === 0 && (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        )}
        {data.recent_submissions.map((s) => (
          <Link key={s.id} to="/admin/inbox" className="block">
            <Card className="card-soft rounded-xl transition-colors hover:bg-secondary/50">
              <CardContent className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">{s.type}</Badge>
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.status === "new" && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  <span className="text-xs text-muted-foreground">{formatDate(s.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
