import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Cat, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import ArticleCard from "../components/ArticleCard";
import ProductSpotlight from "../components/ProductSpotlight";
import { API } from "../App";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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
      color: "bg-primary",
    },
    {
      title: "Bien-être Animal",
      description: "Santé, comportement et bonheur de vos félins",
      icon: Cat,
      path: "/bien-etre-animal",
      color: "bg-accent",
    },
    {
      title: "La Connexion",
      description: "Le lien unique entre humains et animaux",
      icon: Users,
      path: "/connexion",
      color: "bg-secondary",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Harmonie Féline & Humaine | Blog Bien-être</title>
        <meta
          name="description"
          content="Votre guide holistique pour le bien-être humain et animal. Découvrez des articles scientifiques sur la méditation, la nutrition féline, et le lien humain-animal."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative gradient-mesh noise-overlay overflow-hidden" data-testid="hero-section">
        <div className="container-custom py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-text-muted">Bien-être holistique</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-main leading-tight mb-6">
                Harmonie entre{" "}
                <span className="text-primary">corps</span>,{" "}
                <span className="text-secondary-dark">esprit</span> et{" "}
                <span className="text-accent-foreground">compagnons</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 max-w-lg">
                Explorez notre univers dédié au bien-être humain et félin. 
                Des articles scientifiques pour une vie plus équilibrée et harmonieuse.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/bien-etre-humain">
                  <Button className="btn-primary text-base h-14 px-8" data-testid="cta-human-wellness">
                    Découvrir
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/bien-etre-animal">
                  <Button className="btn-secondary text-base h-14 px-8" data-testid="cta-animal-wellness">
                    Nos amis félins
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-secondary-light rounded-full blur-3xl opacity-60" />
                
                <img
                  src="https://images.unsplash.com/photo-1672312123315-8a4808e1027e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHx3b21hbiUyMGhvbGRpbmclMjBjYXQlMjBhZmZlY3Rpb25hdGUlMjBwYXN0ZWx8ZW58MHx8fHwxNzcyMTQ3MjMyfDA&ixlib=rb-4.1.0&q=85"
                  alt="Femme tenant son chat avec affection"
                  className="relative rounded-3xl shadow-float object-cover w-full max-w-md mx-auto aspect-[4/5]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections Overview */}
      <section className="section-spacing bg-white" data-testid="sections-overview">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={section.path} className="block group">
                  <div className="bg-background rounded-3xl p-8 card-hover border border-transparent hover:border-primary-light">
                    <div className={`w-16 h-16 ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <section.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-text-main mb-3">
                      {section.title}
                    </h3>
                    <p className="text-text-muted mb-4">
                      {section.description}
                    </p>
                    <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Explorer
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="section-spacing" data-testid="featured-articles">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-2">
                Articles récents
              </h2>
              <p className="text-text-muted">
                Découvrez nos dernières publications
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
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

      {/* Shop Spotlights */}
      <section className="section-spacing bg-white" data-testid="shop-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Nos boutiques partenaires
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Des produits sélectionnés pour votre bien-être et celui de vos compagnons
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProductSpotlight type="cats" />
            <ProductSpotlight type="supplements" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
