import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Bookmark, ChevronDown, Search, Settings, Sparkles } from "lucide-react";
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
  const navigate = useNavigate();

  const navItems = [
    { name: "Accueil", path: "/", icon: "🏠" },
    { name: "Bien-être Humain", path: "/bien-etre-humain", icon: "🧘" },
    { name: "Bien-être Animal", path: "/bien-etre-animal", icon: "🐱" },
    { name: "La Connexion", path: "/connexion", icon: "💕" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-light/30 shadow-[0_4px_30px_rgba(95,160,152,0.08)]" data-testid="header">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo with playful animation */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <motion.div 
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-float"
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-white text-xl font-heading font-semibold">H</span>
              <motion.div
                className="absolute -top-1 -right-1 text-sm"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg font-semibold text-text-main leading-tight group-hover:text-primary transition-colors">
                Harmonie
              </h1>
              <p className="text-xs text-text-muted font-ui">Féline & Humaine</p>
            </div>
          </Link>

          {/* Desktop Navigation with playful hover effects */}
          <nav className="hidden lg:flex items-center gap-1 bg-primary-light/20 rounded-full p-1.5" data-testid="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive(item.path)
                    ? "bg-white text-primary-dark shadow-soft"
                    : "text-text-muted hover:text-primary-dark hover:bg-white/60"
                }`}
                data-testid={`nav-${item.path.replace("/", "") || "home"}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button with bounce */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/search")}
                className="rounded-full hover:bg-secondary-light text-text-muted w-10 h-10 p-0"
                data-testid="search-btn"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Language Selector */}
            <LanguageSelector />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary-light/30 hover:bg-primary-light border-2 border-transparent hover:border-primary/20 transition-all"
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-semibold text-text-main">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-float border-primary-light">
                  <DropdownMenuItem asChild className="rounded-xl py-3">
                    <Link to="/dashboard" className="flex items-center gap-3" data-testid="dashboard-link">
                      <span className="text-lg">💾</span>
                      <span>Mes favoris</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl py-3">
                    <Link to="/admin" className="flex items-center gap-3" data-testid="admin-link">
                      <span className="text-lg">⚙️</span>
                      <span>Administration</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-600 rounded-xl py-3"
                    data-testid="logout-btn"
                  >
                    <span className="text-lg mr-3">👋</span>
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={login}
                  className="btn-primary btn-playful text-sm flex items-center gap-2 shadow-float"
                  data-testid="login-btn"
                >
                  <User className="h-4 w-4" />
                  Connexion
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-primary-light/30 hover:bg-primary-light transition-colors"
              whileTap={{ scale: 0.9 }}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary-dark" />
              ) : (
                <Menu className="h-6 w-6 text-primary-dark" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation with smooth animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden pb-6 overflow-hidden"
              data-testid="mobile-nav"
            >
              <div className="flex flex-col gap-2 pt-4 border-t border-primary-light/30">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-primary-light to-secondary-light text-primary-dark shadow-soft"
                          : "text-text-muted hover:text-text-main hover:bg-primary-light/30"
                      }`}
                      data-testid={`mobile-nav-${item.path.replace("/", "") || "home"}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
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
