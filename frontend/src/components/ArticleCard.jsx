import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Bookmark, Share2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ArticleCard = ({ article, index = 0 }) => {
  const categoryColors = {
    human: "bg-primary-light text-primary-dark",
    animal: "bg-accent text-accent-foreground",
    connection: "bg-secondary text-secondary-foreground",
  };

  const categoryNames = {
    human: "Bien-être Humain",
    animal: "Bien-être Animal",
    connection: "La Connexion",
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
      data-testid={`article-card-${article.slug}`}
    >
      <Link to={`/article/${article.slug}`} className="block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-soft card-hover">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${categoryColors[article.category]}`}>
                {categoryNames[article.category]}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-heading text-xl font-semibold text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-4">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-text-light text-xs">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {article.author?.split(" ")[0] || "Équipe"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.created_at ? format(new Date(article.created_at), "d MMM", { locale: fr }) : "Récent"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-text-light text-xs">
                  <Heart className="h-4 w-4" />
                  {article.likes_count || 0}
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-primary-light/50 transition-colors"
                  data-testid={`share-btn-${article.slug}`}
                >
                  <Share2 className="h-4 w-4 text-text-light" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
