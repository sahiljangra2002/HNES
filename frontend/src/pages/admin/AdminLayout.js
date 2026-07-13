import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, TreePine, Newspaper, Images, Users, Quote, Flag, Briefcase,
  Inbox as InboxIcon, HeartHandshake, MailPlus, Settings, LogOut, Leaf, Menu, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { logout } from "@/lib/api";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/admin/programs", label: "Programs", icon: TreePine },
  { to: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/milestones", label: "Milestones", icon: Flag },
  { to: "/admin/careers", label: "Careers", icon: Briefcase },
  { to: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { to: "/admin/subscribers", label: "Subscribers", icon: MailPlus },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

const SidebarNav = ({ onNavigate }) => (
  <nav className="flex flex-col gap-0.5" aria-label="Admin navigation">
    {NAV.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onNavigate}
        data-testid={`admin-nav-${label.toLowerCase().replace(/\s/g, "-")}`}
        className={({ isActive }) =>
          `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-secondary hover:text-primary"
          }`
        }
      >
        <Icon className="h-4 w-4" /> {label}
      </NavLink>
    ))}
  </nav>
);

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const admin = JSON.parse(localStorage.getItem("hnes_admin") || "{}");

  const doLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card p-4 lg:flex" data-testid="admin-sidebar">
        <div className="flex items-center gap-2 px-2 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="font-heading text-sm font-bold text-primary">HNES Admin</div>
            <div className="text-[10px] text-muted-foreground">Content Management</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="border-t border-border pt-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-primary">
            <ExternalLink className="h-4 w-4" /> View website
          </a>
          <button onClick={doLogout} data-testid="admin-logout-button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Log out
          </button>
          <div className="mt-2 truncate px-3 text-[11px] text-muted-foreground">{admin.email}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-heading text-sm font-bold text-primary">HNES Admin</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open admin menu" data-testid="admin-mobile-menu-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card">
              <SheetTitle className="font-heading text-primary">Admin Menu</SheetTitle>
              <div className="mt-4">
                <SidebarNav onNavigate={() => setOpen(false)} />
                <button onClick={doLogout} className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
