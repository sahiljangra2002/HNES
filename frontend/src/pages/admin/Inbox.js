import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Building2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, formatDate } from "@/lib/api";

const STATUS_COLORS = {
  new: "bg-accent text-accent-foreground",
  read: "bg-secondary text-secondary-foreground",
  responded: "bg-primary text-primary-foreground",
};

export default function Inbox() {
  const [type, setType] = useState("all");
  const [items, setItems] = useState(null);

  const load = () => {
    api
      .get("/admin/submissions", { params: type === "all" ? {} : { type } })
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    setItems(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/submissions/${id}`, { status });
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast.success("Status updated");
    } catch {
      toast.error("Could not update status");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/submissions/${id}`);
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Submission deleted");
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary">Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact messages, volunteer signups and partnership inquiries. Everything is stored here even when
        email notifications are not configured.
      </p>

      <Tabs value={type} onValueChange={setType} className="mt-6">
        <TabsList data-testid="inbox-type-tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteers</TabsTrigger>
          <TabsTrigger value="partner">Partners</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-5 space-y-3">
        {items === null && [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        {items !== null && items.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No submissions in this category yet.</p>
        )}
        {(items || []).map((s) => (
          <Card key={s.id} className="card-soft rounded-2xl" data-testid="inbox-submission-card">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{s.type}</Badge>
                  <span className="font-semibold">{s.name}</span>
                  <Badge className={STATUS_COLORS[s.status] || ""}>{s.status}</Badge>
                  {s.email_sent ? (
                    <span className="flex items-center gap-1 text-xs text-primary"><CheckCircle2 className="h-3 w-3" /> emailed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><AlertCircle className="h-3 w-3" /> stored only</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(s.created_at)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <a href={`mailto:${s.email}`} className="flex items-center gap-1 hover:text-primary hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {s.email}
                </a>
                {s.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {s.phone}</span>}
                {s.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {s.city}</span>}
                {s.organization && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {s.organization}</span>}
                {s.interest && <Badge variant="outline" className="border-primary/25 text-primary">{s.interest}</Badge>}
              </div>
              {(s.subject || s.message) && (
                <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-sm">
                  {s.subject && <div className="font-medium">{s.subject}</div>}
                  {s.message && <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{s.message}</p>}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between gap-2">
                <Select value={s.status} onValueChange={(v) => setStatus(s.id, v)}>
                  <SelectTrigger className="w-36" aria-label="Change status" data-testid="inbox-status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(s.id)} data-testid="inbox-delete-button">
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
