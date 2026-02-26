import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Cat, Heart, Stethoscope, Home } from "lucide-react";
import ArticleCard from "../components/ArticleCard";
import MindMap, { animalWellnessNodes, animalWellnessEdges } from "../components/MindMap";
import ProductSpotlight from "../components/ProductSpotlight";
import { API } from "../App";

const AnimalWellnessPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API}/articles?category=animal`);
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

  const topics = [
    { icon: Cat, label: "Comportement", color: "bg-accent" },
    { icon: Stethoscope, label: "Santé", color: "bg-primary" },
    { icon: Heart, label: "Nutrition", color: "bg-secondary" },
    { icon: Home, label: "Environnement", color: "bg-primary-light" },
  ];

  return (
    <>
      <Helmet>
        <title>Bien-être Animal | Harmonie Féline & Humaine</title>
        <meta
          name="description"
          content="Tout sur le bien-être de votre chat : comportement félin, nutrition adaptée, soins vétérinaires et conseils pour un chat heureux et en bonne santé."
        />
        <meta name="keywords" content="bien-être chat, santé féline, comportement chat, nutrition chat, chat senior" />
      </Helmet>

      {/* Hero */}
      <section className="gradient-mesh noise-overlay py-20 md:py-28" data-testid="animal-wellness-hero">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex gap-3 mb-6">
                {topics.map((topic, i) => (
                  <div
                    key={i}
                    className={`${topic.color} w-10 h-10 rounded-xl flex items-center justify-center`}
                  >
                    <topic.icon className="h-5 w-5 text-white" />
                  </div>
                ))}
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-text-main mb-6">
                Bien-être <span className="text-accent-foreground">Animal</span>
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                Découvrez comment prendre soin de votre compagnon félin. 
                Des conseils vétérinaires et comportementaux pour un chat heureux et épanoui.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent rounded-full blur-3xl opacity-40" />
                <img
                  src="https://images.pexels.com/photos/675463/pexels-photo-675463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Chat heureux"
                  className="rounded-3xl shadow-float object-cover w-full max-w-md mx-auto aspect-square"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mind Map Section */}
      <section className="section-spacing bg-white" data-testid="animal-mindmap-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              L'univers du bien-être félin
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Explorez les différents aspects de la santé et du bonheur de votre chat
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MindMap
              nodes={animalWellnessNodes}
              edges={animalWellnessEdges}
              title="Bien-être Félin"
            />
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      <section className="section-spacing" data-testid="animal-articles-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Articles Bien-être Animal
            </h2>
            <p className="text-text-muted text-lg">
              Des conseils d'experts pour vos compagnons félins
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <p>Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <ArticleCard key={article.article_id || index} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Spotlight */}
      <section className="section-spacing bg-white" data-testid="animal-product-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <ProductSpotlight type="cats" />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AnimalWellnessPage;
