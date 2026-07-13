import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Leaf, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seo } from "@/components/Seo";
import { api, isLoggedIn } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("hnes_token", data.token);
      localStorage.setItem("hnes_admin", JSON.stringify({ email: data.email, name: data.name }));
      toast.success(`Welcome back, ${data.name}`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-4">
      <Seo title="Admin Login" />
      <Card className="card-soft w-full max-w-md rounded-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">Human &amp; Natural Environment Society</p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4" data-testid="admin-login-form">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-testid="admin-email-input"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                data-testid="admin-password-input"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" data-testid="admin-login-submit-button">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>) : (<><Lock className="mr-2 h-4 w-4" /> Sign in</>)}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Authorised staff only. Sessions expire after 7 days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
