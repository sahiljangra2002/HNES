import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export const NewsletterForm = ({ compact = false }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/newsletter", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.detail?.[0]?.msg || "Please enter a valid email address."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      data-testid="footer-newsletter-form"
      className={`flex w-full gap-2 ${compact ? "" : "max-w-md"}`}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address for newsletter"
        data-testid="newsletter-email-input"
        className="bg-card"
      />
      <Button
        type="submit"
        disabled={loading}
        data-testid="newsletter-submit-button"
        className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        <span className="ml-1 hidden sm:inline">Subscribe</span>
      </Button>
    </form>
  );
};
