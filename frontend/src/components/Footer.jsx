import { Link } from "react-router-dom";
import { Heart, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    {
      name: "Feline Joy - Articles pour chats",
      url: "https://www.felinejoycamy.myshopify.com",
      description: "Accessoires & T-shirts chats"
    },
    {
      name: "Zinzino - Compléments alimentaires",
      url: "https://www.zinzino.com/2020929659",
      description: "Nutrition testée & approuvée"
    }
  ];

  const quickLinks = [
    { name: "Accueil", path: "/" },
    { name: "Bien-être Humain", path: "/bien-etre-humain" },
    { name: "Bien-être Animal", path: "/bien-etre-animal" },
    { name: "La Connexion", path: "/connexion" },
  ];

  return (
    <footer className="bg-white border-t border-border" data-testid="footer">
      <div className="container-custom section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white text-xl font-heading font-semibold">H</span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-main">Harmonie</h3>
                <p className="text-xs text-text-muted font-ui">Féline & Humaine</p>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Votre guide holistique pour le bien-être humain et animal. 
              Des articles scientifiques pour une vie plus équilibrée.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                    data-testid={`footer-link-${link.path.replace("/", "") || "home"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Nos Boutiques</h4>
            <ul className="space-y-4">
              {shopLinks.map((shop) => (
                <li key={shop.url}>
                  <a
                    href={shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                    data-testid={`shop-link-${shop.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-2 text-text-main group-hover:text-primary transition-colors text-sm font-medium">
                      {shop.name}
                      <ExternalLink className="h-3 w-3" />
                    </div>
                    <p className="text-xs text-text-light mt-0.5">{shop.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Contact</h4>
            <div className="space-y-4">
              <a
                href="mailto:contact@harmonie-feline-humaine.com"
                className="flex items-center gap-3 text-text-muted hover:text-primary transition-colors text-sm"
              >
                <Mail className="h-5 w-5" />
                contact@harmonie.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-light text-sm">
            © {currentYear} Harmonie Féline & Humaine. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2 text-text-light text-sm">
            Fait avec <Heart className="h-4 w-4 text-accent fill-accent" /> pour votre bien-être
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
