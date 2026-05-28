import { motion } from "framer-motion";
import { ExternalLink, Star, ShoppingCart } from "lucide-react";

const AMAZON_AFFILIATE_ID = "sissoulily-21";

const products = [
  {
    id: 1,
    name: "Diffuseur Huiles Essentielles",
    description: "Ultrasonique 300ml — Silencieux, 7 couleurs LED, aromathérapie",
    price: "À partir de 22,99 €",
    rating: 4.5,
    reviews: 8420,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300",
    asin: "B07TD59XY6",
    tag: "Relaxation",
    benefit: "Réduit le stress"
  },
  {
    id: 2,
    name: "Lampe de Luminothérapie Beurer",
    description: "10 000 Lux — Combat la fatigue hivernale et les troubles du sommeil",
    price: "À partir de 49,99 €",
    rating: 4.6,
    reviews: 12300,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    asin: "B00MOIWOAK",
    tag: "Santé",
    benefit: "Énergie & sommeil"
  },
  {
    id: 3,
    name: "Correcteur de Posture Dos",
    description: "Homme & Femme — Soulage les douleurs dorsales au bureau",
    price: "À partir de 19,99 €",
    rating: 4.3,
    reviews: 5670,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
    asin: "B0D146DFH8",
    tag: "Bien-être",
    benefit: "Dos sans douleur"
  },
  {
    id: 4,
    name: "Coussin Ergonomique Lombaire",
    description: "Bureau & voiture — Soulage le bas du dos, anti-glissant",
    price: "À partir de 24,99 €",
    rating: 4.4,
    reviews: 3890,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300",
    asin: "B0DNZ76LMP",
    tag: "Confort",
    benefit: "Posture parfaite"
  }
];

const generateAmazonLink = (asin) => {
  return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_AFFILIATE_ID}`;
};

const renderStars = (rating) => (
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

const AmazonProducts = () => {
  return (
    <div className="bg-gradient-to-br from-secondary-light/30 to-primary-light/20 rounded-3xl p-6 md:p-8" data-testid="amazon-products">
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
          Mes sélections bien-être
        </h2>
        <p className="text-text-muted">
          Des produits testés et approuvés pour améliorer votre quotidien
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
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
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-accent text-white text-xs font-bold rounded-full">
                  {product.tag}
                </span>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  ✓ {product.benefit}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-text-main text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-text-muted text-xs mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                {renderStars(product.rating)}
                <span className="text-xs text-text-light">({product.reviews.toLocaleString()})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-dark text-sm">{product.price}</span>
                <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <p className="text-center text-xs text-text-light mt-6">
        🔗 Liens affiliés Amazon — En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises. Cela ne change pas le prix pour vous.
      </p>
    </div>
  );
};

export default AmazonProducts;
