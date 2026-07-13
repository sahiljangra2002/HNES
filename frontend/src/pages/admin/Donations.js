import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatINR, formatDate } from "@/lib/api";

export default function Donations() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/admin/donations").then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, []);

  const total = (items || []).reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary">Donations Log</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        All donation intents recorded on the website. Entries are in DEMO mode until payment gateway keys are
        configured - no real money has been charged.
      </p>

      <Card className="card-soft mt-6 max-w-xs rounded-2xl">
        <CardContent className="p-5">
          <div className="stat-number font-heading text-2xl font-bold text-primary">{formatINR(total)}</div>
          <div className="text-xs text-muted-foreground">Total pledged across {(items || []).length} records</div>
        </CardContent>
      </Card>

      <div className="card-soft mt-6 overflow-hidden rounded-2xl">
        {items === null ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id} data-testid="donation-row">
                  <TableCell>
                    <div className="font-medium">{d.donor_name}</div>
                    <div className="text-xs text-muted-foreground">{d.email}</div>
                  </TableCell>
                  <TableCell className="stat-number font-semibold">{formatINR(d.amount)}</TableCell>
                  <TableCell>{d.frequency === "monthly" ? "Monthly" : "One-time"}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{d.program_title || "General fund"}</TableCell>
                  <TableCell className="text-xs">{d.reference}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(d.created_at)}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No donations recorded yet.
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
