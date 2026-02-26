import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Bookmark, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Bien-être Humain", path: "/bien-etre-humain" },
    { name: "Bien-être Animal", path: "/bien-etre-animal" },
    { name: "La Connexion", path: "/connexion" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20" data-testid="header">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-soft group-hover:shadow-float transition-all duration-300">
              <span className="text-white text-xl font-heading font-semibold">H</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg font-semibold text-text-main leading-tight">
                Harmonie
              </h1>
              <p className="text-xs text-text-muted font-ui">Féline & Humaine</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-primary-light text-primary-dark"
                    : "text-text-muted hover:text-text-main hover:bg-primary-light/30"
                }`}
                data-testid={`nav-${item.path.replace("/", "") || "home"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary-light/30"
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-text-main">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2" data-testid="dashboard-link">
                      <Bookmark className="h-4 w-4" />
                      Mes favoris
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600"
                    data-testid="logout-btn"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                className="btn-primary text-sm"
                data-testid="login-btn"
              >
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-light/30 transition-colors"
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-text-main" />
              ) : (
                <Menu className="h-6 w-6 text-text-main" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-6 overflow-hidden"
              data-testid="mobile-nav"
            >
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-primary-light text-primary-dark"
                        : "text-text-muted hover:text-text-main hover:bg-primary-light/30"
                    }`}
                    data-testid={`mobile-nav-${item.path.replace("/", "") || "home"}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
