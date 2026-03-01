import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Phone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "الرئيسية", path: "/" },
  { name: "الأطباء", path: "/doctors" },
  { name: "حجز موعد", path: "/booking" },
  { name: "المقالات", path: "/articles" },
  { name: "تواصل معنا", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("medicare_logged_in") === "true");
  }, [location]);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="container-narrow flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-hero-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            ميدي<span className="text-primary">كير</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              الطوارئ
            </Button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => { localStorage.removeItem("medicare_logged_in"); setIsLoggedIn(false); }}>
                خروج
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline">تسجيل الدخول</Button>
            </Link>
          )}
          <Link to="/booking">
            <Button size="sm" className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25">احجز الآن</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full gap-2"><LayoutDashboard className="w-4 h-4" />لوحة التحكم</Button>
                    </Link>
                    <Link to="/booking" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gradient-hero-bg text-primary-foreground border-0">احجز الآن</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                    </Link>
                    <Link to="/booking" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gradient-hero-bg text-primary-foreground border-0">احجز الآن</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
