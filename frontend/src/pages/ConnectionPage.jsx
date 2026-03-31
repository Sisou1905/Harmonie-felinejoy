import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Sparkles, HandHeart } from "lucide-react";
import ArticleCard from "../components/ArticleCard";
import ProductSpotlight from "../components/ProductSpotlight";
import { API } from "../App";

const ConnectionPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "La Connexion Humain-Animal | Harmonie Féline & Humaine";
    return () => {
      document.title = "Harmonie Féline & Humaine | Blog Bien-être";
    };
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API}/articles?category=connection`);
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
    { icon: Heart, label: "Lien émotionnel", color: "bg-accent" },
    { icon: Users, label: "Zoothérapie", color: "bg-primary" },
    { icon: Sparkles, label: "Bienfaits", color: "bg-secondary" },
    { icon: HandHeart, label: "Soins mutuels", color: "bg-primary-light" },
  ];

  return (
    <>
      <section className="gradient-mesh noise-overlay py-20 md:py-28">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                La <span className="text-secondary-dark">Connexion</span>
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                Le lien entre humains et animaux est précieux et scientifiquement prouvé.
                Découvrez comment cette relation unique améliore notre bien-être mutuel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-40" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full blur-2xl opacity-40" />
                <img
                  src="https://images.unsplash.com/photo-1695727526803-a70a8eb59aa5?crop=entropy&cs=srgb&fm=jpg&w=940"
                  alt="Femme embrassant tendrement son chat"
                  className="rounded-3xl shadow-float object-cover w-full max-w-md mx-auto aspect-[4/5]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Les bienfaits prouvés
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Réduction du stress", description: "Caresser un animal réduit le cortisol et augmente l'ocytocine, l'hormone du bonheur.", icon: Heart, color: "bg-accent" },
              { title: "Santé cardiovasculaire", description: "Les propriétaires d'animaux ont une pression artérielle plus basse en moyenne.", icon: Sparkles, color: "bg-primary" },
              { title: "Bien-être mental", description: "La présence d'un animal réduit les sentiments de solitude et combat la dépression.", icon: Users, color: "bg-secondary" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-soft card-hover"
              >
                <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-text-main mb-3">{benefit.title}</h3>
                <p className="text-text-muted leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
              Articles sur la Connexion
            </h2>
            <p className="text-text-muted text-lg">
              Approfondissez votre compréhension du lien humain-animal
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-background rounded-3xl h-96 animate-pulse" />
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

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProductSpotlight type="cats" />
            <ProductSpotlight type="supplements" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ConnectionPage;
