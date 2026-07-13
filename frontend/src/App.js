import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import { SettingsProvider } from "@/context/SettingsContext";
import { isLoggedIn } from "@/lib/api";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import ProgramDetail from "@/pages/ProgramDetail";
import GalleryPage from "@/pages/GalleryPage";
import GetInvolved from "@/pages/GetInvolved";
import Donate from "@/pages/Donate";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import ContentManager from "@/pages/admin/ContentManager";
import Inbox from "@/pages/admin/Inbox";
import Donations from "@/pages/admin/Donations";
import Subscribers from "@/pages/admin/Subscribers";
import SettingsPage from "@/pages/admin/SettingsPage";

const RequireAuth = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/admin" replace />;

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:slug" element={<ProgramDetail />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="programs" element={<ContentManager key="programs" ctype="programs" />} />
              <Route path="blog" element={<ContentManager key="blog" ctype="blog" />} />
              <Route path="gallery" element={<ContentManager key="gallery" ctype="gallery" />} />
              <Route path="team" element={<ContentManager key="team" ctype="team" />} />
              <Route path="testimonials" element={<ContentManager key="testimonials" ctype="testimonials" />} />
              <Route path="milestones" element={<ContentManager key="milestones" ctype="milestones" />} />
              <Route path="careers" element={<ContentManager key="careers" ctype="careers" />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="donations" element={<Donations />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
