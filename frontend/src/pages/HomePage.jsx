import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, ExternalLink, Tag } from "lucide-react";
import { API } from "../App";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const TAG_STYLES = {
  "Bien-être humain": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Bien-être animal": "bg-orange-50 text-orange-800 border-orange-200",
  "Science":          "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Lien":             "bg-violet-50 text-violet-800 border-violet-200",
  "Recette":          "bg-amber-50 text-amber-800 border-amber-200",
  "connection":       "bg-violet-50 text-violet-800 border-violet-200",
  "nutrition":        "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bien-être":        "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const TagBadge = ({ label }) => {
  const style = TAG_STYLES[label] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${style}`}>
      <Sparkles className="w-2.5 h-2.5" />{label}
    </span>
  );
};

const ArticleCard = ({ article }) => (
  <motion.article variants={fadeUp} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
    {article.image_url && (
      <div className="relative overflow-hidden h-44">
        <img src={article.image_url} alt={article.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    )}
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <TagBadge label={article.category || "bien-être"} />
        <span className="text-xs text-gray-400">{article.reading_time || "5"} min</span>
      </div>
      <h3 className="font-medium text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link to={`/article/${article.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors">
          Lire l'article <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {article.amazon_url && (
          <a href={article.amazon_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors">
            <ShoppingBag className="w-3 h-3" />Recommandation Amazon
          </a>
        )}
      </div>
    </div>
  </motion.article>
);

const BenCard = ({ icon, title, sub }) => (
  <div className="bg-white border border-emerald-100 rounded-xl p-3 text-center">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xs font-medium text-emerald-800">{title}</div>
    <div className="text-xs text-emerald-600 mt-0.5">{sub}</div>
  </div>
);

const ProdCard = ({ img, name, sub, price, star, link }) => (
  <a href={link || "https://felinejoycamy.myshopify.com"} target="_blank" rel="noopener noreferrer"
    className={`block rounded-xl overflow-hidden bg-white transition-all hover:shadow-md hover:-translate-y-0.5 ${star ? "border-2 border-emerald-600" : "border border-gray-100"}`}>
    {star && (
      <div className="bg-emerald-700 text-white text-center text-xs font-semibold py-1 tracking-wide">⭐ BEST-SELLER</div>
    )}
    <img src={img} alt={name} loading="lazy" className="w-full h-28 object-cover"
      onError={(e) => { e.target.style.background = "#f0f0ec"; }} />
    <div className="p-2.5">
      <div className="text-xs font-medium text-emerald-800 leading-snug">{name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
      <div className="text-sm font-medium text-amber-700 mt-1.5">{Découvrir}</div>
    </div>
  </a>
);

const MasqueIllo = () => (
  <div className="w-full h-36 bg-gradient-to-br from-amber-50 to-stone-100 relative flex items-center justify-center overflow-hidden rounded-t-2xl">
    <span className="absolute top-2 left-3 text-lg opacity-20">🌿</span>
    <span className="absolute bottom-3 right-4 text-lg opacity-20">🌿</span>
    <div className="absolute left-12 top-4" style={{ transform: "rotate(-25deg)" }}>
      <div className="w-4 h-5 bg-gradient-to-b from-blue-600 to-indigo-800 rounded-t-full rounded-b-lg" style={{ boxShadow: "0 0 10px rgba(67,97,238,0.7)" }} />
      <div className="w-1.5 h-14 bg-gradient-to-b from-amber-200 to-amber-600 rounded-full mx-auto" />
    </div>
    <div className="flex flex-col items-center ml-8">
      <div className="w-20 h-2.5 bg-gradient-to-b from-stone-300 to-stone-400 rounded-t-lg" />
      <div className="w-20 h-10 bg-gradient-to-b from-stone-50 to-stone-200 rounded-b-full border border-stone-300 relative overflow-hidden flex items-center justify-center">
        <div className="w-12 h-5 bg-gradient-to-b from-white to-stone-100 rounded-b-full absolute top-2" />
        <div className="w-7 h-3 rounded-full absolute top-2 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90" style={{ boxShadow: "0 0 8px rgba(79,70,229,0.6)" }} />
      </div>
    </div>
    {[{ l: "52%", t: "30%", s: 5 }, { l: "60%", t: "22%", s: 3 }, { l: "65%", t: "40%", s: 4 }, { l: "45%", t: "55%", s: 3 }].map((d, i) => (
      <div key={i} className="absolute rounded-full bg-indigo-600" style={{ left: d.l, top: d.t, width: d.s, height: d.s, opacity: 0.75, boxShadow: "0 0 6px rgba(79,70,229,0.5)" }} />
    ))}
    <div className="absolute bottom-2 left-3 bg-white/80 rounded-full px-2.5 py-0.5 text-xs font-medium text-amber-900">
      Poudre de Nila · Fromage blanc 3%
    </div>
  </div>
);

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const r = await fetch(`${API}/articles?limit=6`);
        if (r.ok) setArticles(await r.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchArticles();
  }, []);

  const fallback = [
    { title: "3 mois d'Oméga-3 pour mieux dormir et réduire le stress", category: "Science", excerpt: "Une étude relayée par Science & Vie révèle qu'une cure de 3 mois d'Oméga-3 transforme votre équilibre mental.", image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", slug: "#", reading_time: 6, amazon_url: "https://www.amazon.fr/s?k=omega+3+complement&tag=sissoulily-21" },
    { title: "Comment votre chat ressent votre anxiété — étude comportementale 2024", category: "Bien-être animal", excerpt: "Les chats perçoivent les changements physiologiques de leurs propriétaires avec une acuité surprenante.", image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80", slug: "#", reading_time: 4, amazon_url: null },
    { title: "Le lien humain-animal réduit le cortisol de 23%", category: "Lien", excerpt: "Des études scientifiques confirment ce que nous ressentons — notre relation avec nos animaux nous transforme.", image_url: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&q=80", slug: "#", reading_time: 5, amazon_url: null },
  ];

  const displayArticles = articles.length > 0 ? articles : fallback;
  const amazonArticles = displayArticles.filter(a => a.amazon_url);

  return (
    <>
      
      <div className="min-h-screen bg-stone-50">

        {/* HERO */}
        <section>
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1400&q=85" alt="Personne enlacant son chat avec tendresse" className="w-full h-full object-cover" onError={e => e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1400&q=80"} />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-black/20 to-transparent" />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl">
              <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">Blog Bien-être · Harmonie Féline & Humaine</span>
              <h1 className="text-2xl md:text-4xl font-medium text-white leading-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                Prendre soin de soi,<br />comprendre son animal,<br />chérir ce lien unique
              </h1>
            </motion.div>
          </div>
          <div className="bg-white px-5 md:px-8 pt-5 pb-6 max-w-5xl mx-auto">
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4 max-w-2xl">Un espace dédié au bien-être humain, à la santé animale, et à cette connexion profonde qui nous unit à nos compagnons félins — articles, études prouvées et produits soigneusement sélectionnés.</p>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {[
                { icon: "🧘", label: "Bien-être humain", sub: "Corps, esprit & compléments prouvés", bg: "bg-emerald-50 border-emerald-200", h: "text-emerald-800", s: "text-emerald-600" },
                { icon: "🐱", label: "Bien-être animal", sub: "Santé, bonheur & comportement", bg: "bg-orange-50 border-orange-200", h: "text-orange-800", s: "text-orange-600" },
                { icon: "🤝", label: "Lien humain-animal", sub: "Ce qu'il nous apporte vraiment", bg: "bg-violet-50 border-violet-200", h: "text-violet-800", s: "text-violet-600" },
              ].map(p => (
                <div key={p.label} className={`${p.bg} border rounded-xl p-2.5 md:p-4 text-center`}>
                  <div className="text-xl md:text-2xl mb-1">{p.icon}</div>
                  <div className={`text-xs md:text-sm font-semibold ${p.h} leading-tight`}>{p.label}</div>
                  <div className={`text-xs ${p.s} mt-1 leading-snug hidden md:block`}>{p.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ① ARTICLES */}
        <section className="px-5 md:px-8 py-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-0.5">① Articles & Éveil</p>
              <h2 className="text-lg md:text-xl font-medium text-emerald-800">Recherches, conseils & rituels</h2>
            </div>
            <Link to="/blog" className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-800">Tout voir <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100"/>)}</div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayArticles.map((a, i) => <ArticleCard key={a._id || i} article={a} />)}
            </motion.div>
          )}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-6 bg-white rounded-2xl overflow-hidden border border-amber-100 md:flex">
            <div className="md:w-64 flex-shrink-0"><MasqueIllo /></div>
            <div className="p-4 md:p-6">
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">✨ Rituel beauté hebdomadaire</span>
              <h3 className="font-medium text-amber-900 mb-3">Masque Nila & Fromage Blanc — peau nette, teint unifié</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{ico:"🔵",qty:"2 c. à café",n:"poudre de Nila"},{ico:"🥛",qty:"2 c. à soupe",n:"fromage blanc 3%"},{ico:"⏱️",qty:"20 minutes",n:"de pose zen"}].map(g=>(
                  <div key={g.n} className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-center">
                    <div className="text-xl mb-1">{g.ico}</div>
                    <div className="text-xs font-medium text-amber-900">{g.qty}</div>
                    <div className="text-xs text-amber-700 mt-0.5">{g.n}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                {["Mélangez 2 c. à café de Nila avec 2 c. à soupe de fromage blanc 3% jusqu'à obtenir une pâte homogène légèrement bleue.","Appliquez sur le visage de préférence après la douche — les pores sont dilatés et la peau absorbe mieux.","Laissez poser 20 minutes, rincez à l'eau tiède. À utiliser 1 fois par semaine comme rituel bien-être."].map((step,i)=>(
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["✓ Unifie le teint","✓ Réduit les points noirs","✓ Anti-boutons","✓ Atténue les cicatrices"].map(b=>(
                  <span key={b} className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-full">{b}</span>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 leading-relaxed">
                🌿 <strong>Conseil zen :</strong> profitez de ces 20 minutes pour méditer ou vous poser avec votre chat.
              </div>
            </div>
          </motion.div>
          <Link to="/blog" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors">Voir tous les articles <ArrowRight className="w-4 h-4" /></Link>
        </section>

        {/* ② ZINZINO */}
        <section className="px-5 md:px-8 py-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-0.5">② Compléments prouvés scientifiquement</p>
            <h2 className="text-lg md:text-xl font-medium text-emerald-800 mb-1">Oméga-3 Zinzino — testés, mesurés, prouvés</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">Des laboratoires scandinaves indépendants analysent votre sang avant et après. Pas de promesses — des preuves. Via notre lien partenaire, bénéficiez de <strong className="text-emerald-700">prix avantageux jusqu'à 30% moins chers</strong> qu'en achat classique.</p>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-2 bg-emerald-800 text-white rounded-xl px-4 py-2.5 mb-4">
                <Tag className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-medium"><strong>Prix partenaire exclusif</strong> — jusqu'à 30% de réduction vs prix public · Livraison incluse</p>
              </div>
              <div className="md:flex gap-6">
                <div className="flex gap-3 items-center mb-4 md:mb-0 md:flex-col md:items-center md:w-40 md:flex-shrink-0">
                  <img src="https://zinzinowebstorage.blob.core.windows.net/productimages/large/300000.png" alt="Zinzino BalanceOil+" loading="lazy" className="w-16 h-20 md:w-24 md:h-28 object-contain bg-white rounded-xl p-1 border border-emerald-100 flex-shrink-0" onError={e=>e.target.style.display="none"} />
                  <div className="md:text-center">
                    <h3 className="font-medium text-emerald-800 md:text-sm">Zinzino BalanceOil+</h3>
                    <p className="text-xs text-emerald-600 mt-0.5 mb-2">Huile Oméga-3 · Polyphénols · Vit. D3</p>
                    <div className="flex gap-1.5 flex-wrap md:justify-center">
                      <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded">✓ 1,7M tests</span>
                      <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded">✓ Friend of the Sea</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">Bénéfices prouvés cliniquement :</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <BenCard icon="🔥" title="Réduit l'inflammation" sub="silencieuse & chronique" />
                    <BenCard icon="🛡️" title="Prévient les maladies" sub="cardio & chroniques" />
                    <BenCard icon="⚡" title="Regagne en énergie" sub="mentale & physique" />
                    <BenCard icon="😴" title="Améliore le sommeil" sub="réduit le stress" />
                  </div>
                  <div className="bg-white border border-emerald-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-emerald-800 text-center mb-3">Ratio Oméga-6/3 — avant → après 120 jours</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-center bg-red-50 border border-red-100 rounded-lg py-2"><div className="text-lg font-medium text-red-500">25:1</div><div className="text-xs text-gray-400">Moyenne française</div></div>
                      <div className="text-emerald-400 text-xl">→</div>
                      <div className="flex-1 text-center bg-emerald-50 border border-emerald-100 rounded-lg py-2"><div className="text-lg font-medium text-emerald-600">3:1</div><div className="text-xs text-gray-400">Après Zinzino</div></div>
                      <div className="text-emerald-400 text-xl">→</div>
                      <div className="flex-1 text-center bg-emerald-50 border border-emerald-100 rounded-lg py-2"><div className="text-lg font-medium text-emerald-700">120j</div><div className="text-xs text-gray-400">Prouvé</div></div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl text-sm font-medium transition-colors mt-4">
                <ShoppingBag className="w-4 h-4" />Commander sur Zinzino — prix partenaire avantageux<ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 flex items-center gap-2.5 bg-white border border-emerald-100 rounded-xl p-3">
                <span className="text-base">🐾</span>
                <div className="flex-1"><div className="text-xs font-medium text-emerald-800">Compléments alimentaires animaux</div><div className="text-xs text-emerald-600">aussi disponibles chez Zinzino — même qualité scandinave</div></div>
                <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap">Voir →</a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ③ BOUTIQUE FELINEJOY */}
        <section className="px-5 md:px-8 py-6 max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-0.5">③ Boutique Felinejoy</p>
          <h2 className="text-lg md:text-xl font-medium text-emerald-800 mb-1">Pour les amoureux des chats</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">Accessoires, jouets et t-shirts originaux pour chérir votre félin et afficher votre passion avec style.</p>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/13315842307128167536_2048.jpg?v=1774202108&width=400" name="Stay Weird Stay Wild" sub="T-shirt rétro unisexe" Découvrir="Découvrir" star link="https://felinejoycamy.myshopify.com/products/unisex-garment-dyed-t-shirt" />
            <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/3106667881955.jpg?v=1770412974&width=400" name="Cozy Cave Cat Bed" sub="Niche douillette pompom" Découvrir="~19€" link="https://felinejoycamy.myshopify.com/products/lit-cocooning-pour-chat-niche-douillette-avec-pompon-couchage-premium" />
            <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/data_dd19f71b-8e59-4d10-b92b-6f0e5686c97a.jpg?v=1770414077&width=400" name="Crazy Cat Lady" sub="100% coton premium" Découvrir="Découvrir" link="https://felinejoycamy.myshopify.com/products/t-shirt-crazy-cat-lady-100-coton-premium-cadeau-parfait-maman-chat" />
            <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/data_b7f70288-c0a0-4b26-8fc5-a0d8315e5fcb.png?v=1770408141&width=400" name="Jouet plume rotatif" sub="USB rechargeable auto" Découvrir="~13€" link="https://felinejoycamy.myshopify.com/products/jouet-interactif-chat-culbuto-balle-oscillante-stimulante-auto-amusement" />
          </motion.div>
          <a href="https://felinejoycamy.myshopify.com" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-sm font-medium transition-colors">
            🐱 Voir toute la boutique Felinejoy <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* ④ LIEN HUMAIN-ANIMAL */}
        <section className="px-5 md:px-8 py-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-violet-400 mb-0.5">④ Lien humain-animal</p>
            <h2 className="text-lg md:text-xl font-medium text-emerald-800 mb-2">Ce que votre chat vous apporte vraiment</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl">La science confirme ce que nous ressentons : notre lien avec nos animaux nous transforme profondément — corps, esprit et cœur.</p>
            <div className="md:flex gap-6 mb-5">
              <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 md:w-96 flex-shrink-0 mb-4 md:mb-0">
                <img src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80" alt="Personne enlacant son chat" loading="lazy" className="w-full h-full object-cover" onError={e=>e.target.src="https://images.unsplash.com/photo-1611695434398-4f4b330623e4?w=800&q=80"} />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs italic leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>"Un animal réduit le cortisol, ralentit le cœur, ancre dans le présent."</p>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[{v:"−23%",l:"cortisol (stress)"},{v:"+oxytocine",l:"hormone du lien"},{v:"−15%",l:"risque cardiaque"}].map(s=>(
                    <div key={s.v} className="bg-violet-50 border border-violet-100 rounded-xl p-2.5 text-center">
                      <div className="text-sm font-medium text-violet-700">{s.v}</div>
                      <div className="text-xs text-violet-500 mt-0.5 leading-snug">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-violet-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div><p className="text-xs font-semibold tracking-widest uppercase text-violet-300 mb-1">Sagesse du jour</p><h3 className="font-medium text-violet-900">1er accord Toltèque</h3></div>
                    <span className="text-4xl font-light text-violet-100 leading-none">01</span>
                  </div>
                  <p className="text-sm italic text-violet-600 mb-2 leading-relaxed">"Que votre parole soit impeccable"</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">Parlez à votre chat avec douceur aujourd'hui. Observez comment il réagit à votre ton — pas vos mots.</p>
                  <p className="text-xs text-violet-300 mb-3">Inspiré de Florence Millot · La petite boîte toltèque</p>
                  <Link to="/blog" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-violet-200 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors">
                    Lire le principe de demain <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMANDATIONS AMAZON */}
        {amazonArticles.length > 0 && (
          <section className="px-5 md:px-8 py-6 max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-0.5">Recommandations produits Amazon</p>
            <h2 className="text-lg md:text-xl font-medium text-emerald-800 mb-1">Nos coups de cœur</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">Des produits sélectionnés en lien avec nos articles — bien-être humain et animal.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {amazonArticles.slice(0, 4).map((a, i) => (
                <a key={i} href={a.amazon_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl p-3 hover:border-amber-300 hover:shadow-sm transition-all group">
                  {a.image_url && <img src={a.image_url} alt={a.title} loading="lazy" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">{a.title}</p>
                    <p className="text-xs text-amber-600 mt-1 font-medium">Voir la recommandation →</p>
                  </div>
                  <ShoppingBag className="w-4 h-4 text-amber-500 flex-shrink-0 group-hover:text-amber-700 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="bg-emerald-900 text-white px-5 md:px-8 py-8 mt-2">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <div className="text-lg font-medium mb-1">🌿 Harmonie Féline & Humaine</div>
              <div className="text-sm text-emerald-300">Blog bien-être · Corps, animal & connexion</div>
            </div>
            <div className="flex flex-col md:flex-row gap-2.5 md:justify-center md:max-w-sm md:mx-auto">
              <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white py-3 px-6 rounded-xl text-sm font-medium transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />Boutique Zinzino
              </a>
              <a href="https://felinejoycamy.myshopify.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3 px-6 rounded-xl text-sm font-medium transition-colors">
                <ShoppingBag className="w-3.5 h-3.5" />Boutique Felinejoy
              </a>
            </div>
            <p className="text-center text-xs text-emerald-400 mt-5">© 2025 Harmonie Féline & Humaine · Tous droits réservés</p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default HomePage;
