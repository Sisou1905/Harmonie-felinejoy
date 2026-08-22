import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: "Feline Joy", url: "https://www.felinejoycamy.myshopify.com", description: "Accessoires & T-shirts chats", emoji: "🐱" },
    { name: "Zinzino", url: "https://www.zinzino.com/2020929659/fr/fr-fr", description: "Nutrition testee & approuvee", emoji: "🌿" }
  ];

  const quickLinks = [
    { name: "Accueil", path: "/" },
    { name: "Bien-etre Humain", path: "/bien-etre-humain" },
    { name: "Bien-etre Animal", path: "/bien-etre-animal" },
    { name: "La Connexion", path: "/connexion" },
    { name: "Recherche", path: "/search" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-primary-light/20 border-t border-primary-light/30" data-testid="footer">
      <div className="container-custom section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-float">
                <span className="text-white text-2xl font-heading font-bold">H</span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-main">Harmonie Joy</h3>
                <p className="text-xs text-text-muted font-ui">Blog Bien-etre</p>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Votre guide holistique pour le bien-etre humain et animal.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-text-muted hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Nos Boutiques</h4>
            <ul className="space-y-4">
              {shopLinks.map((shop) => (
                <li key={shop.url}>
                  <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary text-sm">
                    {shop.name} - {shop.description}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Contact</h4>
            <a href="mailto:contact@felinejoy.com" className="flex items-center gap-3 text-text-muted hover:text-primary text-sm">
              <Mail className="h-5 w-5" />
              contact@felinejoy.com
            </a>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-primary-light/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Harmonie Joy. Tous droits reserves.
          </p>
          <Link to="/privacy" className="text-text-muted text-sm hover:text-primary transition-colors">
            Politique de confidentialite
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
