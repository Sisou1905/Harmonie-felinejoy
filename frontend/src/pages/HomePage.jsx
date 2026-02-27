import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Cat, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import ArticleCard from "../components/ArticleCard";
import AffiliateBanner from "../components/AffiliateBanner";
import AmazonProducts from "../components/AmazonProducts";
import Newsletter from "../components/Newsletter";
import { AdBanner } from "../components/AdSense";
import { API } from "../App";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Harmonie Féline & Humaine | Blog Bien-être";
    return () => {
      document.title = "Harmonie Féline & Humaine | Blog Bien-être";
    };
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API}/articles?limit=6`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const sections = [
    {
      title: "Bien-être Humain",
      description: "Méditation, nutrition, sommeil et gestion du stress",
      icon: Heart,
      path: "/bien-etre-humain",
      color: "from-primary to-primary-dark",
      emoji: "🧘",
      bgPattern: "bg-gradient-to-br from-primary-light/40 to-primary-light/10",
    },
    {
      title: "Bien-être Animal",
      description: "Santé, comportement et bonheur de vos félins",
      icon: Cat,
      path: "/bien-etre-animal",
      color: "from-accent to-accent-hover",
      emoji: "🐱",
      bgPattern: "bg-gradient-to-br from-accent/20 to-accent/5",
    },
    {
      title: "La Connexion",
      description: "Le lien unique entre humains et animaux",
      icon: Users,
      path: "/connexion",
      color: "from-secondary to-secondary-dark",
      emoji: "💕",
      bgPattern: "bg-gradient-to-br from-secondary-light/40 to-secondary-light/10",
    },
  ];

  // Floating decorative elements
  const floatingEmojis = ["🌿", "✨", "🐾", "🌸", "💫", "🍃"];

  return (
    <>
      {/* Hero Section with enhanced visuals */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/60 via-background to-secondary-light/40" />
        
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingEmojis.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`,
              }}
              animate={{ 
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 15 + Math.random() * 10, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Blob shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-light/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="container-custom py-24 md:py-36 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Playful badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border-2 border-primary-light shadow-soft mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                <span className="text-sm font-semibold text-primary-dark">Bien-être holistique</span>
              </motion.div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-main leading-[1.1] mb-8">
                Harmonie entre{" "}
                <span className="text-gradient">corps</span>,{" "}
                <br className="hidden sm:block" />
                <span className="text-gradient">esprit</span> et{" "}
                <span className="text-gradient">compagnons</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-lg">
                Explorez notre univers dédié au bien-être humain et félin. 
                Des articles scientifiques pour une vie plus équilibrée et harmonieuse. 🌿
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/bien-etre-humain">
                    <Button className="btn-primary btn-playful text-base h-14 px-8 shadow-float" data-testid="cta-human-wellness">
                      <span className="mr-2">🧘</span>
                      Découvrir
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/bien-etre-animal">
                    <Button className="btn-secondary btn-playful text-base h-14 px-8" data-testid="cta-animal-wellness">
                      <span className="mr-2">🐱</span>
                      Nos amis félins
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Decorative frame with gradient border */}
                <div className="hero-image-frame">
                  <motion.img
                    src="https://images.unsplash.com/photo-1695727526803-a70a8eb59aa5?crop=entropy&cs=srgb&fm=jpg&w=940"
                    alt="Femme embrassant tendrement son chat"
                    className="rounded-[1.75rem] object-cover w-full max-w-md mx-auto aspect-[4/5]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                
                {/* Floating badges around image */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-float"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-2xl">🐾</span>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2 shadow-float flex items-center gap-2"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <span className="text-xl">💕</span>
                  <span className="text-sm font-semibold text-primary-dark">Amour & Sérénité</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wavy separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z" fill="white" fillOpacity="0.8"/>
          </svg>
        </div>
      </section>

      {/* Sections Overview with playful cards */}
      <section className="section-spacing bg-white relative" data-testid="sections-overview">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block text-4xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌟
            </motion.span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Explorez nos univers
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Trois piliers interconnectés pour une approche holistique du bien-être
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Link to={section.path} className="block group">
                  <motion.div 
                    className={`card-organic ${section.bgPattern} p-8 h-full`}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Playful icon with emoji */}
                    <div className="relative mb-6">
                      <motion.div 
                        className={`w-20 h-20 bg-gradient-to-br ${section.color} rounded-[1.5rem] flex items-center justify-center shadow-float`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <span className="text-3xl">{section.emoji}</span>
                      </motion.div>
                      <motion.div 
                        className="absolute -top-2 -right-2 text-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✨
                      </motion.div>
                    </div>
                    
                    <h3 className="font-heading text-xl font-semibold text-text-main mb-3 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-text-muted mb-6">
                      {section.description}
                    </p>
                    <span className="inline-flex items-center text-primary font-semibold text-sm gap-1 group-hover:gap-3 transition-all">
                      Explorer
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles with enhanced styling */}
      <section className="section-spacing bg-gradient-to-b from-white to-primary-light/20" data-testid="featured-articles">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main">
                  Articles récents
                </h2>
              </div>
              <p className="text-text-muted">
                Découvrez nos dernières publications scientifiques et inspirantes
              </p>
            </div>
            <Link to="/search">
              <Button className="btn-secondary btn-playful">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse shadow-soft" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(0, 6).map((article, index) => (
                <ArticleCard key={article.article_id || index} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Newsletter />
          </div>
        </div>
      </section>

      {/* Shop Spotlights with enhanced styling */}
      <section className="section-spacing bg-gradient-to-b from-primary-light/10 to-secondary-light/20" data-testid="shop-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-3xl mb-4 block">🛍️</span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Nos boutiques partenaires
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Des produits sélectionnés avec amour pour votre bien-être et celui de vos compagnons
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ProductSpotlight type="cats" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <ProductSpotlight type="supplements" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
