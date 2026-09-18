import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Accueil", path: "/", icon: "🏠" },
    { name: "Bien-être Humain", path: "/bien-etre-humain", icon: "🧘" },
    { name: "Bien-être Animal", path: "/bien-etre-animal", icon: "🐱" },
    { name: "La Connexion", path: "/connexion", icon: "💕" },
    { name: "À propos", path: "/a-propos", icon: "💡" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-light/30 shadow-[0_4px_30px_rgba(95,160,152,0.08)]" data-testid="header">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
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
                Harmonie Joy
              </h1>
              <p className="text-xs text-text-muted font-ui">Blog Bien-être</p>
            </div>
          </Link>

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

          <div className="flex items-center gap-3">
            <LanguageSelector />

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
