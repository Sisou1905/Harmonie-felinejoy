import { ExternalLink, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const ProductSpotlight = ({ type = "cats" }) => {
  const products = {
    cats: {
      title: "Feline Joy",
      subtitle: "Articles & T-shirts pour amoureux des chats",
      description: "Découvrez notre sélection d'accessoires et vêtements inspirés par nos amis félins.",
      url: "https://www.felinejoycamy.myshopify.com",
      image: "https://images.pexels.com/photos/675463/pexels-photo-675463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
      badge: "Boutique Chats",
    },
    supplements: {
      title: "Zinzino",
      subtitle: "Compléments alimentaires testés & approuvés",
      description: "Des suppléments nutritionnels de qualité pour votre bien-être quotidien.",
      url: "https://www.zinzino.com/2020929659",
      image: "https://images.unsplash.com/photo-1556383689-b86b57bac7a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxoZWFsdGh5JTIwaGVyYmFsJTIwdGVhJTIwYW5kJTIwYm9va3MlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyMTQ3MjMzfDA&ixlib=rb-4.1.0&q=85",
      badge: "Nutrition",
    },
  };

  const product = products[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden shadow-soft border border-border card-hover"
      data-testid={`product-spotlight-${type}`}
    >
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              {product.badge}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-semibold text-text-main mb-1">
                {product.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-2">{product.subtitle}</p>
              <p className="text-text-muted text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
              <ExternalLink className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default ProductSpotlight;
