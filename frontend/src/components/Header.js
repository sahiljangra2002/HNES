import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Leaf, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Our Work" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "News" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" data-testid="header-logo-link" aria-label="Human & Natural Environment Society - Home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-lg font-bold tracking-tight text-primary">HNES</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Human &amp; Natural Environment Society
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/8 text-primary bg-secondary"
                    : "text-foreground/75 hover:bg-secondary hover:text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="outline"
            onClick={() => navigate("/get-involved")}
            data-testid="header-get-involved-button"
            className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
          >
            Get Involved
          </Button>
          <Button
            onClick={() => navigate("/donate")}
            data-testid="header-donate-button"
            className="rounded-xl bg-accent text-accent-foreground shadow-sm transition-colors duration-200 hover:bg-accent/90 active:scale-[0.98]"
          >
            <Heart className="mr-1 h-4 w-4" aria-hidden="true" /> Donate Now
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              data-testid="header-mobile-menu-button"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background">
            <SheetTitle className="font-heading text-primary">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium ${
                      isActive ? "bg-secondary text-primary" : "text-foreground/80 hover:bg-secondary"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/get-involved"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-secondary"
              >
                Get Involved
              </NavLink>
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/donate");
                }}
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="mobile-donate-button"
              >
                <Heart className="mr-1 h-4 w-4" /> Donate Now
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
