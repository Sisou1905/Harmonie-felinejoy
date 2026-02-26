import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Bookmark, Trash2, LogOut, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import ArticleCard from "../components/ArticleCard";
import { toast } from "sonner";
import { API, useAuth } from "../App";

const DashboardPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`${API}/user/bookmarks`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Déconnecté avec succès");
  };

  return (
    <>
      <Helmet>
        <title>Mon Espace | Harmonie Féline & Humaine</title>
        <meta name="description" content="Gérez vos articles favoris et votre profil" />
      </Helmet>

      <div className="min-h-screen gradient-mesh noise-overlay" data-testid="dashboard-page">
        <div className="container-custom py-12 md:py-20 relative z-10">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-soft mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow text-center sm:text-left">
                <h1 className="font-heading text-2xl font-semibold text-text-main mb-1">
                  {user?.name}
                </h1>
                <p className="text-text-muted mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary-dark">
                      {bookmarks.length} favoris
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full text-red-500 border-red-200 hover:bg-red-50"
                data-testid="dashboard-logout-btn"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </motion.div>

          {/* Bookmarks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Bookmark className="h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl font-semibold text-text-main">
                Mes articles favoris
              </h2>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl h-80 animate-pulse" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
                <Bookmark className="h-16 w-16 mx-auto mb-4 text-text-light opacity-30" />
                <h3 className="font-heading text-xl text-text-main mb-2">
                  Aucun favori pour le moment
                </h3>
                <p className="text-text-muted mb-6">
                  Explorez nos articles et sauvegardez vos préférés
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="btn-primary"
                >
                  Découvrir les articles
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarks.map((article, index) => (
                  <ArticleCard key={article.article_id || index} article={article} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
