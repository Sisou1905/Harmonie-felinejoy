import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, BookOpen, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import ArticleCard from "../components/ArticleCard";
import ProductSpotlight from "../components/ProductSpotlight";
import Newsletter from "../components/Newsletter";
import { API } from "../App";

const LandingPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const response = await fetch(`${API}/landing-pages/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPageData(data);
        }
      } catch (error) {
        console.error("Failed to fetch landing page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-heading">Chargement...</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="font-heading text-2xl text-text-main mb-4">Page non trouvée</h1>
        <Link to="/">
          <Button className="btn-primary">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  const categoryPaths = {
    human: "/bien-etre-humain",
    animal: "/bien-etre-animal",
    connection: "/connexion"
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case "intro":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-soft"
          >
            <h2 className="font-heading text-2xl font-semibold text-text-main mb-4">
              {block.title}
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              {block.content}
            </p>
          </motion.div>
        );

      case "steps":
      case "checklist":
      case "tips":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-soft"
          >
            <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
              {block.title}
            </h2>
            <ul className="space-y-4">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );

      case "benefits":
      case "science":
      case "applications":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-light to-secondary-light rounded-3xl p-8"
          >
            <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
              {block.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {block.items.map((item, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-text-main font-medium">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageData.meta_title || "Guide | Harmonie"}</title>
        <meta name="description" content={pageData.meta_description || ""} />
        <meta name="keywords" content={pageData.keywords?.join(", ") || ""} />
        <meta property="og:title" content={pageData.meta_title || "Guide"} />
        <meta property="og:description" content={pageData.meta_description || ""} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://wellness-hub-693.preview.emergentagent.com/guide/${pageData.slug}`} />
      </Helmet>

      <div className="min-h-screen" data-testid="landing-page">
        {/* Hero Section */}
        <section className="gradient-mesh noise-overlay py-20 md:py-28">
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-text-muted">Guide complet</span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-text-main mb-6">
                {pageData.hero_title}
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8">
                {pageData.hero_subtitle}
              </p>

              <Link to={categoryPaths[pageData.related_category]}>
                <Button className="btn-primary text-lg h-14 px-8">
                  {pageData.cta_text}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Content Blocks */}
        <section className="section-spacing">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-8">
              {pageData.content_blocks?.map((block, index) => renderContentBlock(block, index))}
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {pageData.related_articles && pageData.related_articles.length > 0 && (
          <section className="section-spacing bg-white">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
                  Articles recommandés
                </h2>
                <p className="text-text-muted text-lg">
                  Approfondissez vos connaissances avec nos articles
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {pageData.related_articles.map((article, index) => (
                  <ArticleCard key={article.article_id} article={article} index={index} />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link to={categoryPaths[pageData.related_category]}>
                  <Button className="btn-secondary">
                    Voir tous les articles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Product Spotlight */}
        <section className="section-spacing">
          <div className="container-custom">
            <div className="max-w-xl mx-auto">
              <ProductSpotlight type={pageData.related_category === "animal" ? "cats" : "supplements"} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
