import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Cat, Heart, Stethoscope, Home } from "lucide-react";
import ArticleCard from "../components/ArticleCard";
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

      <section className="gradient-mesh noise-overlay py-20 md:py-28">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex gap-3 mb-6">
              {topics.map((topic, i) => (
                <div key={i} className={`${topic.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
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
        </div>
      </section>

      <section className="section-spacing">
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

      <section className="section-spacing bg-white">
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
