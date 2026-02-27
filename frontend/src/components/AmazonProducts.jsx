import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "./ui/button";

// Amazon affiliate products - Replace AFFILIATE_ID with your Amazon Associates ID
const AMAZON_AFFILIATE_ID = "harmoniefel-21"; // Placeholder - à remplacer

const AmazonProducts = ({ category = "all" }) => {
  const [activeCategory, setActiveCategory] = useState(category === "all" ? "cats" : category);

  // Product recommendations with Amazon affiliate links
  const products = {
    cats: [
      {
        id: 1,
        name: "Fontaine à eau pour chat",
        description: "Fontaine automatique 2.4L - Silencieuse",
        price: "29,99 €",
        rating: 4.5,
        reviews: 12453,
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300",
        asin: "B08XYZ1234",
        tag: "Best-seller"
      },
      {
        id: 2,
        name: "Arbre à chat géant",
        description: "Tour d'activité 150cm - Multi-niveaux",
        price: "79,99 €",
        rating: 4.7,
        reviews: 8921,
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300",
        asin: "B08ABC5678",
        tag: "Top qualité"
      },
      {
        id: 3,
        name: "Griffoir en carton premium",
        description: "Design moderne - Herbe à chat incluse",
        price: "24,99 €",
        rating: 4.4,
        reviews: 5632,
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300",
        asin: "B09DEF9012",
        tag: "Écologique"
      },
      {
        id: 4,
        name: "Jouets interactifs chat (lot)",
        description: "12 jouets variés - Plumes, balles, souris",
        price: "15,99 €",
        rating: 4.3,
        reviews: 7845,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
        asin: "B07GHI3456",
        tag: "Pack complet"
      }
    ],
    wellness: [
      {
        id: 5,
        name: "Tapis de yoga premium",
        description: "Antidérapant - Épaisseur 6mm - Écologique",
        price: "34,99 €",
        rating: 4.6,
        reviews: 9876,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
        asin: "B08JKL7890",
        tag: "Best-seller"
      },
      {
        id: 6,
        name: "Diffuseur huiles essentielles",
        description: "Ultrasonique 500ml - 7 couleurs LED",
        price: "27,99 €",
        rating: 4.5,
        reviews: 15234,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300",
        asin: "B09MNO1234",
        tag: "Relaxation"
      },
      {
        id: 7,
        name: "Coussin de méditation",
        description: "Zafu traditionnel - Sarrasin bio",
        price: "39,99 €",
        rating: 4.8,
        reviews: 3421,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300",
        asin: "B08PQR5678",
        tag: "Premium"
      },
      {
        id: 8,
        name: "Lampe luminothérapie",
        description: "10000 Lux - Contre la fatigue hivernale",
        price: "49,99 €",
        rating: 4.4,
        reviews: 6543,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
        asin: "B07STU9012",
        tag: "Santé"
      }
    ]
  };

  const categories = [
    { id: "cats", name: "Pour votre chat", emoji: "🐱" },
    { id: "wellness", name: "Bien-être", emoji: "🧘" }
  ];

  const generateAmazonLink = (asin) => {
    return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_AFFILIATE_ID}`;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : star - 0.5 <= rating
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-text-muted ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-secondary-light/30 to-primary-light/20 rounded-3xl p-6 md:p-8" data-testid="amazon-products">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-soft mb-4"
        >
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-text-main">Produits recommandés</span>
        </motion.div>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text-main mb-2">
          Nos sélections Amazon
        </h2>
        <p className="text-text-muted">
          Produits de qualité sélectionnés pour vous et vos compagnons
        </p>
      </div>

      {/* Category Tabs */}
      {category === "all" && (
        <div className="flex justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-white shadow-soft text-primary-dark"
                  : "bg-white/50 text-text-muted hover:bg-white/80"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{cat.emoji}</span>
              {cat.name}
            </motion.button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products[activeCategory].map((product, index) => (
          <motion.a
            key={product.id}
            href={generateAmazonLink(product.asin)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-float transition-all"
            data-testid={`amazon-product-${product.id}`}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Tag */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-accent text-white text-xs font-bold rounded-full">
                  {product.tag}
                </span>
              </div>
              {/* Heart */}
              <motion.div 
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <Heart className="h-4 w-4 text-accent" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-text-main text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-text-muted text-xs mb-2 line-clamp-1">
                {product.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {renderStars(product.rating)}
                <span className="text-xs text-text-light">({product.reviews.toLocaleString()})</span>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-dark">{product.price}</span>
                <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-text-light mt-6">
        🔗 Liens affiliés Amazon - En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.
      </p>
    </div>
  );
};

export default AmazonProducts;
