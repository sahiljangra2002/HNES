import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

export const Layout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <ScrollToTop />
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
