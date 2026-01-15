import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-resume", label: "Create Resume" },
    { href: "/job-description", label: "Job Match" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex h-14 items-center justify-between rounded-full border border-border/50 bg-card/80 backdrop-blur-xl px-4 shadow-soft">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-soft group-hover:shadow-glow transition-all duration-300">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Resume<span className="text-gradient">Builder</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive(link.href)
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/create-resume">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                {/* User Avatar */}
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-accent/40">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl animate-slide-up shadow-elevated">
          <nav className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-border/40">
              {!user ? (
                <>
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/create-resume" className="flex-1">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
