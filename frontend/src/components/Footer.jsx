import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, ExternalLink, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    {
      name: "Feline Joy",
      subtitle: "Articles pour chats",
      url: "https://www.felinejoycamy.myshopify.com",
      description: "Accessoires & T-shirts chats",
      emoji: "🐱"
    },
    {
      name: "Zinzino",
      subtitle: "Compléments alimentaires",
      url: "https://www.zinzino.com/2020929659",
      description: "Nutrition testée & approuvée",
      emoji: "🌿"
    }
  ];

  const quickLinks = [
    { name: "Accueil", path: "/", emoji: "🏠" },
    { name: "Bien-être Humain", path: "/bien-etre-humain", emoji: "🧘" },
    { name: "Bien-être Animal", path: "/bien-etre-animal", emoji: "🐾" },
    { name: "La Connexion", path: "/connexion", emoji: "💕" },
    { name: "Recherche", path: "/search", emoji: "🔍" },
  ];

  const guideLinks = [
    { name: "Méditation pour Débutants", path: "/guide/meditation-debutant", emoji: "🧘‍♀️" },
    { name: "Santé du Chat Senior", path: "/guide/sante-chat-senior", emoji: "🐈" },
    { name: "Bienfaits Aquarium", path: "/guide/aquarium-bienfaits-mental", emoji: "🐠" },
    { name: "Yoga Débutants", path: "/guide/yoga-debutants", emoji: "🌸" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-primary-light/20 border-t border-primary-light/30" data-testid="footer">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full overflow-hidden">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 30C200 60 400 0 720 30C1040 60 1240 0 1440 30V60H0V30Z" fill="white"/>
        </svg>
      </div>

      <div className="container-custom section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand with animation */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-float"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-2xl font-heading font-bold">H</span>
              </motion.div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-main group-hover:text-primary transition-colors">Harmonie</h3>
                <p className="text-xs text-text-muted font-ui">Féline & Humaine ✨</p>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Votre guide holistique pour le bien-être humain et animal. 
              Des articles scientifiques pour une vie plus équilibrée. 🌿
            </p>
            {/* Social proof */}
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="px-3 py-1.5 bg-white rounded-full shadow-soft font-medium">20+ Articles</span>
              <span className="px-3 py-1.5 bg-white rounded-full shadow-soft font-medium">15 Guides</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6 flex items-center gap-2">
              <span>🧭</span> Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.path} whileHover={{ x: 4 }}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm group"
                    data-testid={`footer-link-${link.path.replace("/", "") || "home"}`}
                  >
                    <span className="text-sm opacity-70 group-hover:opacity-100">{link.emoji}</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* SEO Guide Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6 flex items-center gap-2">
              <span>📚</span> Guides Pratiques
            </h4>
            <ul className="space-y-3">
              {guideLinks.map((link) => (
                <motion.li key={link.path} whileHover={{ x: 4 }}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm group"
                    data-testid={`footer-guide-${link.path.split('/').pop()}`}
                  >
                    <span className="text-sm opacity-70 group-hover:opacity-100">{link.emoji}</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Shop Links with cards */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6 flex items-center gap-2">
              <span>🛍️</span> Nos Boutiques
            </h4>
            <ul className="space-y-4">
              {shopLinks.map((shop) => (
                <motion.li key={shop.url} whileHover={{ scale: 1.02 }}>
                  <a
                    href={shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-3 bg-white rounded-xl shadow-soft hover:shadow-float transition-all border border-transparent hover:border-primary-light"
                    data-testid={`shop-link-${shop.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{shop.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-text-main group-hover:text-primary transition-colors text-sm font-semibold">
                          {shop.name}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-text-light mt-0.5">{shop.description}</p>
                      </div>
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6 flex items-center gap-2">
              <span>💌</span> Contact
            </h4>
            <div className="space-y-4">
              <motion.a
                href="mailto:contact@felinejoy.com"
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-soft hover:shadow-float transition-all text-text-muted hover:text-primary group border border-transparent hover:border-primary-light"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="h-5 w-5 text-primary-dark group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-text-light">Écrivez-nous</p>
                  <p className="text-sm font-medium">contact@felinejoy.com</p>
                </div>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-light/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} Harmonie Féline & Humaine. Tous droits réservés.
          </p>
          <motion.p 
            className="flex items-center gap-2 text-text-muted text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Fait avec 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-accent fill-accent" />
            </motion.span>
            pour votre bien-être 🌟
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
