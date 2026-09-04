import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
      data-testid="newsletter-section"
    >
      {/* Playful card design */}
      <div className="relative bg-gradient-to-br from-primary-light/60 via-white to-secondary-light/60 rounded-[2.5rem] p-8 md:p-12 shadow-float border-2 border-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        
        {/* Floating emojis */}
        <motion.div 
          className="absolute top-4 right-8 text-3xl opacity-50"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          📬
        </motion.div>
        <motion.div 
          className="absolute bottom-4 left-8 text-2xl opacity-50"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          ✨
        </motion.div>

        <div className="relative z-10 text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-soft border border-primary-light/30 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              💌
            </motion.span>
            <span className="text-sm font-semibold text-primary-dark">Guides Harmonie Joy</span>
          </motion.div>

          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text-main mb-3">
            Découvrez les derniers guides
          </h2>
          <p className="text-text-muted text-base mb-8 max-w-md mx-auto">
            Des articles pratiques et sourcés sur le sommeil, la vie avec un chat et la cohabitation au quotidien.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { emoji: "📚", text: "Sources identifiables" },
              { emoji: "🐾", text: "Conseils prudents" },
              { emoji: "🌿", text: "Aucun achat nécessaire" },
            ].map((item, i) => (
              <motion.span 
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full text-xs font-medium text-text-muted shadow-soft"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <span>{item.emoji}</span>
                {item.text}
              </motion.span>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/blog" className="inline-flex items-center gap-2 btn-primary btn-playful h-14 px-8 shadow-float whitespace-nowrap">
              Voir les articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <p className="mt-6 text-xs text-text-light">Les articles de santé et de bien-être animal sont informatifs et ne remplacent pas un professionnel.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Newsletter;
