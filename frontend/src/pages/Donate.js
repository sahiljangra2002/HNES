import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Heart, Copy, Landmark, Info, CheckCircle2, TreePine, Droplets, GraduationCap, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { api, formatINR } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

const FUND_USAGE = [
  { icon: TreePine, label: "Plantation & green cover", pct: 40 },
  { icon: Droplets, label: "Water conservation projects", pct: 25 },
  { icon: GraduationCap, label: "Education & community welfare", pct: 20 },
  { icon: Recycle, label: "Waste management & drives", pct: 10 },
  { icon: Info, label: "Administration (kept minimal)", pct: 5 },
];

export default function Donate() {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState([]);
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [donor, setDonor] = useState({ donor_name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const programSlug = searchParams.get("program");

  useEffect(() => {
    api.get("/programs").then(({ data }) => setPrograms(data)).catch(() => {});
  }, []);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.slug === programSlug),
    [programs, programSlug]
  );

  const presets = settings?.donation_presets || [500, 1000, 2500, 5000];
  const bank = settings?.bank_details || {};
  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied to clipboard`));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/donations", {
        ...donor,
        amount: effectiveAmount,
        frequency: recurring ? "monthly" : "one_time",
        program_id: selectedProgram?.id || null,
        program_title: selectedProgram?.title || null,
      });
      setResult(data);
    } catch {
      toast.error("Could not record the donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Seo
        title="Donate"
        description="Support tree plantation, water conservation and community welfare in Delhi. Donate to Human & Natural Environment Society - every rupee is accounted for."
      />
      <section className="hero-gradient noise-overlay">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Donate</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Your support plants the future
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {selectedProgram
              ? `You are supporting: ${selectedProgram.title}. `
              : ""}
            Every contribution - big or small - funds saplings, rainwater systems, study materials and clean-up
            drives across Delhi. We publish transparent reports for every rupee received.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Donation form */}
          <Reveal className="lg:col-span-3">
            <Card className="card-soft rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                <h2 className="font-heading text-xl font-semibold text-primary sm:text-2xl">Make a donation</h2>
                {selectedProgram && (
                  <p className="mt-1 text-sm text-accent">Supporting: {selectedProgram.title}</p>
                )}
                <form onSubmit={submit} className="mt-6 space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Choose an amount (INR)</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {presets.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setAmount(p);
                            setCustomAmount("");
                          }}
                          data-testid="donation-amount-preset"
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                            !customAmount && amount === p
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-card text-foreground hover:border-accent/50"
                          }`}
                        >
                          {formatINR(p)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="custom-amount" className="text-xs text-muted-foreground">
                        Or enter a custom amount
                      </Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="1"
                        placeholder="e.g. 1500"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        data-testid="donation-custom-amount-input"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">Make this monthly</div>
                      <div className="text-xs text-muted-foreground">Sustained support helps us plan long-term</div>
                    </div>
                    <Switch checked={recurring} onCheckedChange={setRecurring} data-testid="donation-recurring-toggle" aria-label="Make this a monthly donation" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="d-name">Full name *</Label>
                      <Input id="d-name" required minLength={2} value={donor.donor_name} onChange={(e) => setDonor({ ...donor, donor_name: e.target.value })} data-testid="donation-name-input" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="d-email">Email *</Label>
                      <Input id="d-email" type="email" required value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} data-testid="donation-email-input" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="d-phone">Phone</Label>
                      <Input id="d-phone" type="tel" value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} data-testid="donation-phone-input" />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">You are donating</div>
                      <div className="stat-number font-heading text-2xl font-bold text-primary">
                        {formatINR(effectiveAmount || 0)}
                        {recurring && <span className="text-sm font-normal text-muted-foreground"> / month</span>}
                      </div>
                    </div>
                    <Button type="submit" size="lg" disabled={loading} className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]" data-testid="donation-submit-button">
                      {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>) : (<><Heart className="mr-1.5 h-4 w-4" /> Proceed to Payment</>)}
                    </Button>
                  </div>
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Online payment gateway (Razorpay) is in demo mode until the society's payment keys are
                    configured. No money will be charged. You can donate today using the bank details alongside.
                  </p>
                  {settings?.tax_80g_enabled && (
                    <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary" data-testid="donation-80g-note">
                      {settings.tax_80g_note}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </Reveal>

          {/* Bank details + transparency */}
          <div className="space-y-6 lg:col-span-2">
            <Reveal delay={0.08}>
              <Card className="card-soft rounded-2xl" data-testid="donation-bank-details">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h2 className="font-heading text-lg font-semibold text-primary">Bank transfer / Cheque</h2>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    {[
                      ["Account name", bank.account_name],
                      ["Bank", bank.bank_name],
                      ["Branch", bank.branch],
                      ["Account number", bank.account_number],
                      ["IFSC", bank.ifsc],
                      ["Cheque payable to", bank.cheque_payable_to],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-2">
                          <div>
                            <dt className="text-xs text-muted-foreground">{label}</dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary" onClick={() => copyText(value, label)} aria-label={`Copy ${label}`}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                  </dl>
                  {bank.note && <p className="mt-4 rounded-xl bg-secondary/70 p-3 text-xs text-muted-foreground">{bank.note}</p>}
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.14}>
              <Card className="card-soft rounded-2xl" data-testid="donation-transparency-breakdown">
                <CardContent className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-primary">Where your money goes</h2>
                  <div className="mt-4 space-y-4">
                    {FUND_USAGE.map(({ icon: Icon, label, pct }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-accent" aria-hidden="true" /> {label}
                          </span>
                          <span className="stat-number font-semibold">{pct}%</span>
                        </div>
                        <Progress value={pct} className="mt-1.5 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mock payment result dialog */}
      <Dialog open={Boolean(result)} onOpenChange={() => setResult(null)}>
        <DialogContent data-testid="donation-demo-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading text-primary">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Donation recorded (Demo mode)
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              {result?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-secondary/70 p-4 text-sm">
            <div className="text-xs text-muted-foreground">Reference ID</div>
            <div className="stat-number font-semibold">{result?.reference}</div>
          </div>
          <Button onClick={() => setResult(null)} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
