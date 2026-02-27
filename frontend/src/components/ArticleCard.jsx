import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Bookmark, Share2, Calendar, User, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ArticleCard = ({ article, index = 0 }) => {
  const categoryConfig = {
    human: {
      bg: "bg-gradient-to-r from-primary-light to-primary-light/60",
      text: "text-primary-dark",
      emoji: "🧘",
      name: "Bien-être Humain"
    },
    animal: {
      bg: "bg-gradient-to-r from-accent to-accent/60",
      text: "text-accent-foreground",
      emoji: "🐱",
      name: "Bien-être Animal"
    },
    connection: {
      bg: "bg-gradient-to-r from-secondary to-secondary/60",
      text: "text-secondary-foreground",
      emoji: "💕",
      name: "La Connexion"
    },
  };

  const config = categoryConfig[article.category] || categoryConfig.human;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: `${window.location.origin}/article/${article.slug}`,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/article/${article.slug}`);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group h-full"
      data-testid={`article-card-${article.slug}`}
    >
      <Link to={`/article/${article.slug}`} className="block h-full">
        <motion.div 
          className="card-organic bg-white h-full flex flex-col overflow-hidden"
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Image with overlay effects */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl img-zoom">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge */}
            <motion.div 
              className="absolute top-4 left-4"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold ${config.bg} ${config.text} shadow-soft backdrop-blur-sm`}>
                <span>{config.emoji}</span>
                {config.name}
              </span>
            </motion.div>

            {/* Arrow indicator on hover */}
            <motion.div 
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            >
              <ArrowUpRight className="h-5 w-5 text-primary-dark" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-heading text-xl font-semibold text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
              {article.excerpt}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-primary-light/30 text-primary-dark rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-primary-light/30">
              <div className="flex items-center gap-4 text-text-muted text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">✍️</span>
                  {article.author?.split(" ")[0] || "Équipe"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">📅</span>
                  {article.created_at ? format(new Date(article.created_at), "d MMM", { locale: fr }) : "Récent"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-text-muted text-xs">
                  <motion.span whileHover={{ scale: 1.2 }} className="text-sm">❤️</motion.span>
                  {article.likes_count || 0}
                </span>
                <motion.button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-secondary-light transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid={`share-btn-${article.slug}`}
                >
                  <Share2 className="h-4 w-4 text-text-muted" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
