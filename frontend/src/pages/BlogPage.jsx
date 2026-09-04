import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { editorialArticles } from "../data/editorialArticles";

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const TAG_STYLES = {
  "Bien-être humain": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Bien-être animal": "bg-orange-50 text-orange-800 border-orange-200",
  "Science":          "bg-blue-50 text-blue-800 border-blue-200",
  "Lien":             "bg-violet-50 text-violet-800 border-violet-200",
  "Recette":          "bg-amber-50 text-amber-800 border-amber-200",
  "connection":       "bg-violet-50 text-violet-800 border-violet-200",
  "nutrition":        "bg-emerald-50 text-emerald-800 border-emerald-200",
  "human":            "bg-emerald-50 text-emerald-800 border-emerald-200",
  "animal":           "bg-orange-50 text-orange-800 border-orange-200",
};

const TagBadge = ({ label }) => {
  const style = TAG_STYLES[label] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${style}`}>
      <Sparkles className="w-2.5 h-2.5" />{label}
    </span>
  );
};

const CATEGORIES = [
  { value: "all", label: "Tous" },
  { value: "human", label: "Bien-être humain" },
  { value: "animal", label: "Bien-être animal" },
  { value: "connection", label: "La connexion" },
];

const ArticleCard = ({ article }) => (
  <motion.article variants={fadeUp}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col">
    {article.image_url && (
      <div className="relative overflow-hidden h-44 flex-shrink-0">
        <img src={article.image_url} alt={article.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    )}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-center gap-2 mb-2">
        <TagBadge label={article.category || "bien-être"} />
        <span className="text-xs text-gray-400">{article.reading_time || "5"} min</span>
      </div>
      <h2 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors flex-1">
        {article.title}
      </h2>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.excerpt}</p>
      <Link to={`/article/${article.slug}`}
        className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
        Lire l'article <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </motion.article>
);

const BlogPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = "Blog — Harmonie Féline & Humaine";
  }, []);

  const allArticles = editorialArticles;

  const filtered = allArticles.filter(a => {
    const matchCat = category === "all" || a.category === category;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50">

      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 px-5 md:px-8 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-300 mb-2">Blog Harmonie</p>
            <h1 className="text-2xl md:text-4xl font-semibold text-white mb-3">
              Tous nos articles bien-être
            </h1>
            <p className="text-sm md:text-base text-emerald-200 max-w-xl leading-relaxed mb-6">
              Recherches scientifiques, conseils pratiques, rituels naturels — pour vous et votre félin.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 focus:bg-white/20" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 px-5 md:px-8 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                category === cat.value
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Aucun article trouvé pour "{search}"</p>
            <button onClick={() => { setSearch(""); setCategory("all"); }}
              className="mt-3 text-xs text-emerald-600 underline">
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a, i) => <ArticleCard key={a._id || i} article={a} />)}
            </motion.div>
          </>
        )}
      </div>

      <div className="bg-emerald-950 text-white px-5 py-6 text-center">
        <p className="text-xs text-emerald-400">🌿 Harmonie Féline & Humaine · Nouveaux articles chaque semaine</p>
        <Link to="/" className="text-xs text-emerald-300 hover:text-white mt-2 inline-block transition-colors">
          Retour à l'accueil
        </Link>
      </div>

    </div>
  );
};

export default BlogPage;
