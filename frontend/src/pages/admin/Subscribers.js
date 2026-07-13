import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatDate } from "@/lib/api";

export default function Subscribers() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/admin/subscribers").then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/admin/subscribers/${id}`);
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed");
    } catch {
      toast.error("Could not remove");
    }
  };

  const exportCsv = () => {
    const rows = ["email,subscribed_on", ...(items || []).map((s) => `${s.email},${s.created_at}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hnes-newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">{(items || []).length} people receive your updates.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!items?.length} className="rounded-xl" data-testid="subscribers-export-button">
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="card-soft mt-6 overflow-hidden rounded-2xl">
        {items === null ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed on</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id} data-testid="subscriber-row">
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(s.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(s.id)} aria-label={`Remove ${s.email}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                    No subscribers yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
