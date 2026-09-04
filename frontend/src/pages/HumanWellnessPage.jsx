import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Heart, Brain, Moon, Salad } from "lucide-react";
import ArticleCard from "../components/ArticleCard";
import { editorialArticles } from "../data/editorialArticles";

const HumanWellnessPage = () => {
  const articles = editorialArticles.filter((article) => article.category === "human");

  const topics = [
    { icon: Brain, label: "Méditation", color: "bg-primary" },
    { icon: Moon, label: "Sommeil", color: "bg-secondary" },
    { icon: Salad, label: "Nutrition", color: "bg-accent" },
    { icon: Heart, label: "Bien-être", color: "bg-primary-light" },
  ];

  return (
    <>
      <Helmet>
        <title>Bien-être Humain | Harmonie Féline & Humaine</title>
        <meta
          name="description"
          content="Découvrez nos articles sur la méditation, le sommeil, la nutrition et la gestion du stress. Des conseils scientifiques pour votre bien-être quotidien."
        />
        <meta name="keywords" content="bien-être humain, méditation, sommeil, nutrition, stress, santé mentale" />
      </Helmet>

      <section className="gradient-mesh noise-overlay py-20 md:py-28">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex gap-3 mb-6">
              {topics.map((topic, i) => (
                <div key={i} className={`${topic.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <topic.icon className="h-5 w-5 text-white" />
                </div>
              ))}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-text-main mb-6">
              Bien-être <span className="text-primary">Humain</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed">
              Explorez des repères pratiques pour votre quotidien.
              Les articles indiquent leurs sources et ne remplacent pas un avis médical.
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
              Articles Bien-être Humain
            </h2>
            <p className="text-text-muted text-lg">
              Des conseils pratiques basés sur la science
            </p>
          </motion.div>

          {articles.length === 0 ? (
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

    </>
  );
};

export default HumanWellnessPage;
