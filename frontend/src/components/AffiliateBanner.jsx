import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Sparkles, Heart, Star } from "lucide-react";
import { Button } from "./ui/button";

const AffiliateBanner = ({ type = "both" }) => {
  const stores = {
    felinejoy: {
      name: "Feline Joy",
      tagline: "Accessoires & T-shirts pour amoureux des chats",
      description: "Découvrez notre collection exclusive de produits pour les passionnés de félins",
      url: "https://www.felinejoycamy.myshopify.com",
      emoji: "🐱",
      gradient: "from-accent/20 via-accent/10 to-primary-light/20",
      buttonColor: "bg-accent hover:bg-accent-hover",
      features: ["T-shirts originaux", "Accessoires chat", "Livraison rapide"],
      badge: "Boutique officielle"
    },
    zinzino: {
      name: "Zinzino",
      tagline: "Compléments alimentaires testés & approuvés",
      description: "Nutrition premium pour votre équilibre et votre vitalité au quotidien",
      url: "https://www.zinzino.com/2020929659",
      emoji: "🌿",
      gradient: "from-primary-light/30 via-primary-light/10 to-secondary-light/20",
      buttonColor: "bg-primary hover:bg-primary-dark",
      features: ["Oméga-3 premium", "Tests personnalisés", "Qualité scandinave"],
      badge: "Partenaire santé"
    }
  };

  const renderBanner = (storeKey) => {
    const store = stores[storeKey];
    return (
      <motion.div
        key={storeKey}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden"
      >
        <a
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-6 md:p-8 rounded-3xl bg-gradient-to-br ${store.gradient} border-2 border-white shadow-soft hover:shadow-float transition-all duration-300`}
          data-testid={`affiliate-banner-${storeKey}`}
        >
          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-text-main shadow-soft">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {store.badge}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Icon */}
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-white shadow-soft flex items-center justify-center flex-shrink-0"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <span className="text-4xl">{store.emoji}</span>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-text-main mb-2">
                {store.name}
              </h3>
              <p className="text-primary-dark font-medium mb-2">{store.tagline}</p>
              <p className="text-text-muted text-sm mb-4">{store.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {store.features.map((feature, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-xs font-medium text-text-muted"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Button className={`${store.buttonColor} text-white shadow-float btn-playful`}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Découvrir
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </a>
      </motion.div>
    );
  };

  if (type === "felinejoy") return renderBanner("felinejoy");
  if (type === "zinzino") return renderBanner("zinzino");

  return (
    <div className="space-y-6" data-testid="affiliate-banners">
      {renderBanner("felinejoy")}
      {renderBanner("zinzino")}
    </div>
  );
};

export default AffiliateBanner;
