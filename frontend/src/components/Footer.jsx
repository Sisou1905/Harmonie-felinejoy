import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              Des guides français, pratiques et sourcés sur le bien-être quotidien, l’apprentissage, le chat d’intérieur et la relation humain-animal.
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
            <h4 className="font-heading text-base font-semibold text-text-main mb-6">Notre méthode</h4>
            <p className="text-text-muted text-sm leading-relaxed">Chaque guide indique ses sources lorsque le sujet le demande et rappelle les limites de l’information générale.</p>
            <Link to="/a-propos" className="inline-block mt-3 text-sm text-primary hover:text-primary-dark transition-colors">Lire la méthode éditoriale</Link>
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
            © {currentYear} Harmonie Joy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-text-muted text-sm hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/legal" className="text-text-muted text-sm hover:text-primary transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>

        <p className="mt-5 text-xs text-text-muted leading-relaxed max-w-3xl">Les contenus sont informatifs et ne remplacent pas un avis médical, vétérinaire ou professionnel individualisé.</p>

      </div>
    </footer>
  );
};

export default Footer;
