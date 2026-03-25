import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { API } from "../App";

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

const CATEGORIES = ["Tous", "Science", "Bien-être humain", "Bien-être animal", "Lien", "Recette"];

const FALLBACK_ARTICLES = [
  { title:"3 mois d'Oméga-3 pour mieux dormir et réduire le stress", category:"Science", excerpt:"Une étude relayée par Science & Vie révèle qu'une cure de 3 mois d'Oméga-3 transforme votre équilibre mental et améliore le sommeil.", image_url:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", slug:"omega-3-stress-sommeil-cure-3-mois", reading_time:6 },
  { title:"Comment les animaux réduisent notre stress", category:"Lien", excerpt:"Découvrez pourquoi la présence d'un animal de compagnie est l'un des remèdes naturels les plus puissants contre le stress.", image_url:"https://images.unsplash.com/photo-1511044568932-338ceba5ad33?w=600&q=80", slug:"comment-les-animaux-reduisent-notre-stress", reading_time:5 },
  { title:"Comment votre état émotionnel affecte votre chat", category:"Bien-être animal", excerpt:"Les chats sont des éponges émotionnelles. Découvrez comment votre humeur influence directement leur comportement.", image_url:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80", slug:"etat-emotionnel-affecte-chat", reading_time:4 },
  { title:"Les bienfaits thérapeutiques de la présence animale", category:"Lien", excerpt:"La science confirme ce que les propriétaires d'animaux savent intuitivement : nos compagnons sont bons pour notre santé.", image_url:"https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&q=80", slug:"bienfaits-therapeutiques-presence-animale", reading_time:5 },
  { title:"Nutrition optimale pour les chats seniors", category:"Bien-être animal", excerpt:"Les besoins nutritionnels de votre chat évoluent avec l'âge. Découvrez comment adapter son alimentation.", image_url:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80", slug:"nutrition-chat-senior", reading_time:5 },
  { title:"L'importance du sommeil pour la santé", category:"Bien-être humain", excerpt:"Le sommeil est un pilier fondamental de notre santé mentale et physique. Apprenez à optimiser vos nuits.", image_url:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80", slug:"importance-sommeil-sante", reading_time:6 },
  { title:"Comprendre le langage corporel de votre chat", category:"Bien-être animal", excerpt:"Apprenez à décoder les signaux que votre chat vous envoie pour mieux communiquer avec lui.", image_url:"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80", slug:"langage-corporel-chat", reading_time:4 },
  { title:"La méditation pour réduire le stress au quotidien", category:"Bien-être humain", excerpt:"Des études scientifiques confirment les effets de la méditation sur le cerveau et le système nerveux.", image_url:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=80", slug:"meditation-reduire-stress", reading_time:5 },
  { title:"Le ronronnement du chat : bien plus qu'un son", category:"Science", excerpt:"Le ronronnement à 25-50 Hz favorise la régénération osseuse et réduit l'anxiété. Les mécanismes expliqués.", image_url:"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&q=80", slug:"ronronnement-chat-bienfaits", reading_time:4 },
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
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");

  useEffect(() => {
    document.title = "Blog — Harmonie Féline & Humaine";
    const fetch_ = async () => {
      try {
        const r = await fetch(`${API}/articles?limit=50`);
        if (r.ok) {
          const data = await r.json();
          if (data.length > 0) setArticles(data);
        }
      } catch (e) { console.error(e); }
    };
    fetch_();
  }, []);

  const allArticles = articles.length > 0 ? articles : FALLBACK_ARTICLES;

  const filtered = allArticles.filter(a => {
    const matchCat = category === "Tous" || a.category === category;
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
            <button key={cat} onClick={() => setCategory(cat)}
              className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                category === cat
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Aucun article trouvé pour "{search}"</p>
            <button onClick={() => { setSearch(""); setCategory("Tous"); }}
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
