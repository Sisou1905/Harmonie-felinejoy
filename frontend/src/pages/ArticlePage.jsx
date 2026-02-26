import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Bookmark, Share2, Calendar, User, ExternalLink, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import CommentSection from "../components/CommentSection";
import ProductSpotlight from "../components/ProductSpotlight";
import { API, useAuth } from "../App";

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user, login } = useAuth();

  const categoryNames = {
    human: "Bien-être Humain",
    animal: "Bien-être Animal",
    connection: "La Connexion",
  };

  const categoryPaths = {
    human: "/bien-etre-humain",
    animal: "/bien-etre-animal",
    connection: "/connexion",
  };

  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`${API}/articles/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchInteractionStatus = useCallback(async () => {
    if (!article?.article_id) return;
    
    try {
      const [likeRes, bookmarkRes] = await Promise.all([
        fetch(`${API}/articles/${article.article_id}/like-status`, { credentials: "include" }),
        fetch(`${API}/articles/${article.article_id}/bookmark-status`, { credentials: "include" }),
      ]);

      if (likeRes.ok) {
        const likeData = await likeRes.json();
        setLiked(likeData.liked);
      }
      if (bookmarkRes.ok) {
        const bookmarkData = await bookmarkRes.json();
        setBookmarked(bookmarkData.bookmarked);
      }
    } catch (error) {
      console.error("Failed to fetch interaction status:", error);
    }
  }, [article?.article_id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    if (article) {
      fetchInteractionStatus();
    }
  }, [article, fetchInteractionStatus]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Connectez-vous pour aimer cet article");
      return;
    }

    try {
      const response = await fetch(`${API}/articles/${article.article_id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
        toast.success(data.liked ? "Article aimé !" : "Like retiré");
      }
    } catch (error) {
      toast.error("Erreur lors de l'action");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Connectez-vous pour sauvegarder cet article");
      return;
    }

    try {
      const response = await fetch(`${API}/articles/${article.article_id}/bookmark`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.bookmarked);
        toast.success(data.bookmarked ? "Article sauvegardé !" : "Retiré des favoris");
      }
    } catch (error) {
      toast.error("Erreur lors de l'action");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-heading">Chargement...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-heading text-2xl text-text-main mb-4">Article non trouvé</h1>
        <Link to="/">
          <Button className="btn-primary">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Harmonie Féline & Humaine</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.tags?.join(", ")} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image_url} />
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="min-h-screen" data-testid="article-page">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button */}
          <Link
            to={categoryPaths[article.category] || "/"}
            className="absolute top-6 left-6 z-10"
          >
            <Button variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white" data-testid="back-btn">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-white/90 text-text-main hover:bg-white">
                  {categoryNames[article.category]}
                </Badge>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white max-w-4xl">
                  {article.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            {/* Meta & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-border"
            >
              <div className="flex items-center gap-6 text-text-muted text-sm">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {article.created_at
                    ? format(new Date(article.created_at), "d MMMM yyyy", { locale: fr })
                    : "Récent"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`rounded-full ${liked ? "text-red-500" : "text-text-muted"}`}
                  data-testid="like-btn"
                >
                  <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current" : ""}`} />
                  {likesCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`rounded-full ${bookmarked ? "text-primary" : "text-text-muted"}`}
                  data-testid="bookmark-btn"
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-full text-text-muted"
                  data-testid="share-btn"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-text-muted leading-relaxed mb-10 font-medium"
            >
              {article.excerpt}
            </motion.p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-10"
              >
                {article.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary-light text-primary-dark"
                  >
                    #{tag}
                  </Badge>
                ))}
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="article-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/## /g, "<h2>")
                  .replace(/### /g, "<h3>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/- (.*)/g, "<li>$1</li>")
                  .replace(/<li>/g, "<ul><li>")
                  .replace(/<\/li>\n/g, "</li></ul>")
              }}
            />

            {/* Sources */}
            {article.sources && article.sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 p-6 bg-primary-light/30 rounded-2xl"
              >
                <h3 className="font-heading text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Sources scientifiques
                </h3>
                <ul className="space-y-2">
                  {article.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Product Spotlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <ProductSpotlight type={article.category === "animal" ? "cats" : "supplements"} />
            </motion.div>

            {/* Comments */}
            <CommentSection articleId={article.article_id} />
          </div>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
