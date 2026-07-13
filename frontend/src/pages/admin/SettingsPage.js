import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

const Section = ({ title, description, children }) => (
  <Card className="card-soft rounded-2xl">
    <CardContent className="p-6">
      <h2 className="font-heading text-lg font-semibold text-primary">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <Separator className="my-4" />
      <div className="space-y-4">{children}</div>
    </CardContent>
  </Card>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    {children}
  </div>
);

export default function SettingsPage() {
  const { refresh } = useSettings();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  if (!settings) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </div>
    );
  }

  const org = settings.org || {};
  const bank = settings.bank_details || {};
  const social = settings.social || {};
  const stats = settings.impact_stats || [];

  const setOrg = (key, value) => setSettings((s) => ({ ...s, org: { ...s.org, [key]: value } }));
  const setBank = (key, value) => setSettings((s) => ({ ...s, bank_details: { ...s.bank_details, [key]: value } }));
  const setSocial = (key, value) => setSettings((s) => ({ ...s, social: { ...s.social, [key]: value } }));
  const setStat = (i, key, value) =>
    setSettings((s) => ({
      ...s,
      impact_stats: s.impact_stats.map((st, idx) => (idx === i ? { ...st, [key]: value } : st)),
    }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        impact_stats: stats.map((s) => ({ ...s, value: Number(s.value) || 0 })),
        donation_presets: (Array.isArray(settings.donation_presets)
          ? settings.donation_presets
          : String(settings.donation_presets).split(",")
        )
          .map((p) => Number(String(p).trim()))
          .filter((p) => p > 0),
        partners: (Array.isArray(settings.partners)
          ? settings.partners
          : String(settings.partners).split("\n")
        )
          .map((p) => String(p).trim())
          .filter(Boolean),
      };
      await api.put("/admin/settings", payload);
      toast.success("Settings saved - live on the website");
      refresh();
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Site Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organization info, impact stats, donation details and social links.</p>
        </div>
        <Button onClick={save} disabled={saving} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" data-testid="settings-save-button">
          {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>) : (<><Save className="mr-1 h-4 w-4" /> Save all changes</>)}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Section title="Organization" description="Shown across the website. Legal registration fields should match the certificate exactly.">
          <Field label="Tagline"><Input value={org.tagline || ""} onChange={(e) => setOrg("tagline", e.target.value)} data-testid="settings-tagline-input" /></Field>
          <Field label="Mission"><Textarea rows={3} value={org.mission || ""} onChange={(e) => setOrg("mission", e.target.value)} /></Field>
          <Field label="Vision"><Textarea rows={2} value={org.vision || ""} onChange={(e) => setOrg("vision", e.target.value)} /></Field>
          <Field label="Our story"><Textarea rows={5} value={org.story || ""} onChange={(e) => setOrg("story", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Public email"><Input value={org.email || ""} onChange={(e) => setOrg("email", e.target.value)} /></Field>
            <Field label="Public phone"><Input value={org.phone || ""} onChange={(e) => setOrg("phone", e.target.value)} /></Field>
          </div>
          <Field label="Registered address"><Textarea rows={2} value={org.address || ""} onChange={(e) => setOrg("address", e.target.value)} /></Field>
          <Field label="Registration number"><Input value={org.reg_no || ""} onChange={(e) => setOrg("reg_no", e.target.value)} /></Field>
        </Section>

        <div className="space-y-6">
          <Section title="Impact statistics" description="The animated counters on the homepage.">
            {stats.map((s, i) => (
              <div key={s.id || i} className="rounded-xl border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Label"><Input value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} data-testid={`settings-stat-label-${i}`} /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Value"><Input type="number" value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} data-testid={`settings-stat-value-${i}`} /></Field>
                    <Field label="Suffix"><Input value={s.suffix} placeholder="+" onChange={(e) => setStat(i, "suffix", e.target.value)} /></Field>
                  </div>
                </div>
                <Field label="Caption"><Input value={s.caption} onChange={(e) => setStat(i, "caption", e.target.value)} /></Field>
                <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:text-destructive" onClick={() => setSettings((st) => ({ ...st, impact_stats: st.impact_stats.filter((_, idx) => idx !== i) }))}>
                  <X className="mr-1 h-3.5 w-3.5" /> Remove stat
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSettings((st) => ({ ...st, impact_stats: [...st.impact_stats, { id: String(Date.now()), label: "", value: 0, suffix: "+", caption: "" }] }))}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Add stat
            </Button>
          </Section>

          <Section title="Donations" description="Bank details shown on the Donate page, preset amounts, and the 80G tax note.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account name"><Input value={bank.account_name || ""} onChange={(e) => setBank("account_name", e.target.value)} /></Field>
              <Field label="Bank name"><Input value={bank.bank_name || ""} onChange={(e) => setBank("bank_name", e.target.value)} /></Field>
              <Field label="Branch"><Input value={bank.branch || ""} onChange={(e) => setBank("branch", e.target.value)} /></Field>
              <Field label="Account number"><Input value={bank.account_number || ""} onChange={(e) => setBank("account_number", e.target.value)} data-testid="settings-account-number-input" /></Field>
              <Field label="IFSC"><Input value={bank.ifsc || ""} onChange={(e) => setBank("ifsc", e.target.value)} /></Field>
              <Field label="Cheque payable to"><Input value={bank.cheque_payable_to || ""} onChange={(e) => setBank("cheque_payable_to", e.target.value)} /></Field>
            </div>
            <Field label="Note shown under bank details"><Textarea rows={2} value={bank.note || ""} onChange={(e) => setBank("note", e.target.value)} /></Field>
            <Field label="Donation preset amounts (comma separated)">
              <Input
                value={Array.isArray(settings.donation_presets) ? settings.donation_presets.join(", ") : settings.donation_presets}
                onChange={(e) => setSettings((s) => ({ ...s, donation_presets: e.target.value }))}
                data-testid="settings-presets-input"
              />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
              <div>
                <div className="text-sm font-medium">Show 80G tax-exemption note</div>
                <div className="text-xs text-muted-foreground">Enable only after 80G/12A registration is confirmed.</div>
              </div>
              <Switch checked={Boolean(settings.tax_80g_enabled)} onCheckedChange={(v) => setSettings((s) => ({ ...s, tax_80g_enabled: v }))} data-testid="settings-80g-toggle" aria-label="Show 80G note" />
            </div>
            <Field label="80G note text"><Textarea rows={2} value={settings.tax_80g_note || ""} onChange={(e) => setSettings((s) => ({ ...s, tax_80g_note: e.target.value }))} /></Field>
          </Section>

          <Section title="Social links & partners" description="Leave a social link blank to hide its icon.">
            <div className="grid gap-4 sm:grid-cols-2">
              {["facebook", "instagram", "twitter", "linkedin", "youtube"].map((key) => (
                <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                  <Input value={social[key] || ""} onChange={(e) => setSocial(key, e.target.value)} placeholder="https://…" />
                </Field>
              ))}
            </div>
            <Field label="Partners strip (one per line)">
              <Textarea
                rows={4}
                value={Array.isArray(settings.partners) ? settings.partners.join("\n") : settings.partners}
                onChange={(e) => setSettings((s) => ({ ...s, partners: e.target.value }))}
              />
            </Field>
          </Section>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>) : (<><Save className="mr-1 h-4 w-4" /> Save all changes</>)}
        </Button>
      </div>
    </div>
  );
}
