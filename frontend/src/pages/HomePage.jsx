import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, ExternalLink, Bell, ChevronDown } from "lucide-react";
import { editorialArticles } from "../data/editorialArticles";

const useSEO = () => {
  useEffect(() => {
    document.title = "Harmonie Féline & Humaine | Blog Bien-être humain, animal & connexion";
    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Guides pratiques et sourcés sur le sommeil, le bien-être humain, le bien-être félin et la relation humain-animal.");
    setMeta("keywords", "bien-être humain, bien-être animal, sommeil, chat d’intérieur, relation humain-chat, blog bien-être");
    setMeta("og:title", "Harmonie Féline & Humaine | Blog Bien-être", true);
    setMeta("og:description", "Prendre soin de soi, comprendre son animal, chérir ce lien unique.", true);
    setMeta("og:type", "website", true);
    setMeta("og:url", "https://www.harmoniejoy.net/", true);
    setMeta("og:image", "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=85", true);
    setMeta("twitter:card", "summary_large_image");
  }, []);
};

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const TAG_STYLES = {
  "Bien-être humain": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Bien-être animal": "bg-orange-50 text-orange-800 border-orange-200",
  "Science":          "bg-blue-50 text-blue-800 border-blue-200",
  "Lien":             "bg-violet-50 text-violet-800 border-violet-200",
  "Recette":          "bg-amber-50 text-amber-800 border-amber-200",
  "connection":       "bg-violet-50 text-violet-800 border-violet-200",
  "nutrition":        "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bien-être":        "bg-emerald-50 text-emerald-800 border-emerald-200",
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

const ArticleCard = ({ article }) => {
  const isUne = article.featured;
  return (
    <motion.article variants={fadeUp} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col">
      {article.image_url && (
        <div className="relative overflow-hidden h-44 flex-shrink-0">
          <img src={article.image_url} alt={article.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {isUne && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              A la une
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <TagBadge label={article.category || "bien-être"} />
          <span className="text-xs text-gray-400">{article.reading_time || "5"} min</span>
        </div>
        <h3 className="font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors flex-1">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
        <Link to={`/article/${article.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors mb-3">
          Lire l'article <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
};

const NewsletterCTA = () => {
  return (
    <section className="px-5 md:px-8 py-8 bg-gradient-to-br from-emerald-800 to-teal-900">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Rejoignez la communauté Harmonie</h2>
        <p className="text-sm text-emerald-200 mb-5 leading-relaxed">
          Retrouvez les nouveaux guides sur le sommeil, la vie avec un chat et les habitudes de bien-être au quotidien.
        </p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors">Découvrir les derniers guides <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
};

const TOLTÈQUES = [
  { num:"01", jour:"Lundi", titre:"Que votre parole soit impeccable", court:"Parlez avec intégrité, ne dites que ce que vous pensez vraiment.", long:"La parole est une force créatrice. Chaque mot que vous prononcez façonne votre réalité. Parler avec impeccabilité signifie ne pas vous utiliser contre vous-même. Avec votre chat aussi : votre ton, votre énergie, votre sincérité — il les ressent tous.", couleur:"violet" },
  { num:"02", jour:"Mardi", titre:"N'en faites pas une affaire personnelle", court:"Ce que les autres font est le reflet de leur propre réalité, pas de la vôtre.", long:"Quand quelqu'un vous critique ou agit mal, c'est le reflet de son monde intérieur — non du vôtre. Les chats incarnent cet accord naturellement : ils ne prennent rien personnellement. Ils vivent dans l'instant, sans ruminer.", couleur:"emerald" },
  { num:"03", jour:"Mercredi", titre:"Ne faites pas de suppositions", court:"Demandez et exprimez ce que vous voulez vraiment. Évitez les malentendus.", long:"La plupart de nos souffrances naissent de suppositions. Nous inventons des histoires sur ce que les autres pensent. Avec votre chat, observez — ne supposez pas. Apprenez ses vrais signaux corporels.", couleur:"amber" },
  { num:"04", jour:"Jeudi", titre:"Faites toujours de votre mieux", court:"Votre mieux change d'un instant à l'autre. Donnez-le toujours, sans vous juger.", long:"Votre mieux n'est pas le même quand vous êtes reposé ou épuisé. L'essentiel est d'agir — sans perfection, sans culpabilité. Chaque journée où vous prenez soin de vous ET de votre animal, c'est votre mieux.", couleur:"rose" },
  { num:"05", jour:"Vendredi", titre:"Soyez sceptique mais apprenez à écouter", court:"Doutez, questionnez — mais restez ouvert à ce que vous ne savez pas encore.", long:"Le 5ème accord nous invite à questionner nos croyances limitantes sur notre santé et nos relations avec nos animaux. Écoutez votre corps. Écoutez votre chat. Ils savent souvent des choses que votre mental ignore.", couleur:"blue" },
];

const colorMap = {
  violet: { bg:"bg-violet-50", border:"border-violet-200", num:"text-violet-100", titre:"text-violet-800", desc:"text-violet-600", badge:"bg-violet-100 text-violet-700" },
  emerald: { bg:"bg-emerald-50", border:"border-emerald-200", num:"text-emerald-100", titre:"text-emerald-800", desc:"text-emerald-600", badge:"bg-emerald-100 text-emerald-700" },
  amber: { bg:"bg-amber-50", border:"border-amber-200", num:"text-amber-100", titre:"text-amber-800", desc:"text-amber-600", badge:"bg-amber-100 text-amber-700" },
  rose: { bg:"bg-rose-50", border:"border-rose-200", num:"text-rose-100", titre:"text-rose-800", desc:"text-rose-600", badge:"bg-rose-100 text-rose-700" },
  blue: { bg:"bg-blue-50", border:"border-blue-200", num:"text-blue-100", titre:"text-blue-800", desc:"text-blue-600", badge:"bg-blue-100 text-blue-700" },
};

const ToltequesSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="px-5 md:px-8 py-6 max-w-5xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-lg flex-shrink-0">🌀</div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-violet-400">Sagesse de la semaine</p>
            <h2 className="font-semibold text-violet-900 text-lg md:text-xl">Les 5 Accords Toltèques — 1 par jour</h2>
          </div>
          <span className="ml-auto text-xs text-violet-400 italic hidden md:block">Don Miguel Ruiz</span>
        </div>
        <div className="space-y-2">
          {TOLTÈQUES.map((t, i) => {
            const c = colorMap[t.couleur];
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`${c.bg} border ${c.border} rounded-2xl overflow-hidden transition-all duration-200`}>
                <button onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center gap-3 p-4 text-left">
                  <span className={`text-3xl font-light ${c.num} flex-shrink-0`}>{t.num}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{t.jour}</span>
                    </div>
                    <p className={`text-sm font-semibold ${c.titre} leading-snug`}>{t.titre}</p>
                    {!isOpen && <p className={`text-xs ${c.desc} mt-0.5 leading-snug line-clamp-1`}>{t.court}</p>}
                  </div>
                  <ChevronDown className={`w-4 h-4 ${c.desc} flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="px-4 pb-4">
                        <p className={`text-xs ${c.desc} leading-relaxed mb-3`}>{t.long}</p>
                        <div className={`bg-white border ${c.border} rounded-xl p-3 text-xs ${c.titre} italic leading-relaxed`}>
                          "{t.court}"
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-violet-300 mt-3 text-right italic">Inspiré de Don Miguel Ruiz · Les 4 Accords Toltèques</p>
      </motion.div>
    </section>
  );
};

const HomePage = () => {
  useSEO();

  const sortArticles = (arts) => {
    const sorted = [...arts].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const top6 = sorted.slice(0, 6).map(a => a.slug);
    sorted.forEach(a => a.featured = top6.includes(a.slug));
    return sorted;
  };

  const displayArticles = sortArticles(editorialArticles);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* HERO */}
      <section>
        <div className="relative h-80 md:h-[500px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1400&q=85"
            alt="Foret paisible avec riviere pour la meditation et le bien-être"
            className="w-full h-full object-cover"
            onError={e => e.target.src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=85"} />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/30 to-transparent" />
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-5xl">
            <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
              Blog Bien-être · Harmonie Féline & Humaine
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-3" style={{ textShadow:"0 2px 16px rgba(0,0,0,0.4)" }}>
              Prendre soin de soi<br />
              comprendre son animal<br />
              <span className="text-emerald-300">chérir ce lien unique</span>
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-lg leading-relaxed hidden md:block">
              Des articles pratiques, sourcés et prudents pour mieux comprendre son quotidien et celui de son chat.
            </p>
          </motion.div>
        </div>
        <div className="bg-white px-5 md:px-8 pt-5 pb-6 max-w-5xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl hidden md:block">
            Un espace dédié au bien-être humain, à la santé animale, et à cette connexion profonde qui nous unit à nos compagnons félins.
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { icon:"🧘", label:"Bien-être humain", sub:"Routines, sommeil & repères", bg:"bg-emerald-50 border-emerald-200", h:"text-emerald-800", s:"text-emerald-600" },
              { icon:"🐱", label:"Bien-être animal", sub:"Besoins, environnement & signaux", bg:"bg-orange-50 border-orange-200", h:"text-orange-800", s:"text-orange-600" },
              { icon:"🤝", label:"Lien humain-animal", sub:"Une cohabitation attentive", bg:"bg-violet-50 border-violet-200", h:"text-violet-800", s:"text-violet-600" },
            ].map(p => (
              <div key={p.label} className={`${p.bg} border rounded-xl p-2.5 md:p-4 text-center`}>
                <div className="text-2xl md:text-3xl mb-1">{p.icon}</div>
                <div className={`text-xs md:text-sm font-semibold ${p.h} leading-tight`}>{p.label}</div>
                <div className={`text-xs ${p.s} mt-1 leading-snug hidden md:block`}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOLTÈQUES */}
      <ToltequesSection />

      {/* ARTICLES */}
      <section className="px-5 md:px-8 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-0.5">Articles & Éveil</p>
            <h2 className="text-lg md:text-2xl font-semibold text-emerald-800">Recherches, conseils & rituels</h2>
          </div>
          <Link to="/blog" className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors">
            Tout voir <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayArticles.map((a,i)=><ArticleCard key={a._id||i} article={a} />)}
        </motion.div>

        {/* Engagement éditorial */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="mt-6 bg-white rounded-2xl overflow-hidden border border-emerald-100 md:flex shadow-sm">
          <div className="md:w-64 flex-shrink-0 bg-emerald-50 flex items-center justify-center p-8 text-5xl" aria-hidden="true">🌿</div>
          <div className="p-4 md:p-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
              Notre ligne éditoriale
            </span>
            <h3 className="font-semibold text-emerald-900 mb-3">Des contenus utiles avant toute recommandation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Nos guides distinguent les habitudes quotidiennes des sujets qui demandent un professionnel. Les sources sont affichées lorsqu’elles permettent d’éclairer un conseil, et les liens partenaires sont séparés des contenus éditoriaux.</p>
            <Link to="/a-propos" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">En savoir plus sur notre méthode <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </motion.div>

        <Link to="/blog" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors">
          Voir tous les articles <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* NEWSLETTER */}
      <NewsletterCTA />

      {/* LIEN HUMAIN-ANIMAL */}
      <section className="px-5 md:px-8 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-0.5">Lien humain-animal</p>
          <h2 className="text-lg md:text-2xl font-semibold text-emerald-800 mb-2">Prendre soin du lien, sans promesse</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">Vivre avec un chat peut offrir des repères et des moments de présence. Chaque relation reste singulière : l’essentiel est d’observer les besoins de l’animal et de respecter ses choix.</p>
          <div className="md:flex gap-6">
            <div className="relative rounded-2xl overflow-hidden h-52 md:h-72 md:w-96 flex-shrink-0 mb-4 md:mb-0 shadow-md">
              <img src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80"
                alt="Personne enlacant son chat — lien humain-animal" loading="lazy"
                className="w-full h-full object-cover"
                onError={e=>e.target.src="https://images.unsplash.com/photo-1611695434398-4f4b330623e4?w=800&q=80"} />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 to-transparent" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{v:"Observer",l:"ses signaux"},{v:"Respecter",l:"son espace"},{v:"Consulter",l:"en cas de doute"}].map(s=>(
                  <div key={s.v} className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <div className="text-base font-bold text-violet-700">{s.v}</div>
                    <div className="text-xs text-violet-500 mt-0.5 leading-snug">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-3">Notre approche</p>
                <div className="space-y-3">
                  {[
                    { icon:"👀", txt:"Un comportement qui change mérite d’être observé sans interprétation hâtive." },
                    { icon:"🐾", txt:"Les besoins d’un chat incluent des espaces calmes, des ressources accessibles et du choix." },
                    { icon:"🩺", txt:"Un article de bien-être ne remplace pas un avis médical ou vétérinaire." },
                  ].map((f,i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <span className="text-lg flex-shrink-0">{f.icon}</span>
                      <p className="text-xs text-violet-700 leading-relaxed">{f.txt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-emerald-950 text-white px-5 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xl font-semibold mb-1">🌿 Harmonie Féline & Humaine</div>
            <div className="text-sm text-emerald-300">Blog bien-être · Corps, animal & connexion</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto text-center text-xs text-emerald-400">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link to="/bien-etre-humain" className="hover:text-white transition-colors">Bien-être</Link>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:justify-center md:max-w-sm md:mx-auto">
            <a href="https://www.zinzino.com/2020929659/fr/fr-fr" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white py-3 px-6 rounded-xl text-sm font-semibold transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />Boutique Zinzino
            </a>
            <a href="https://felinejoycamy.myshopify.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3 px-6 rounded-xl text-sm font-semibold transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />Boutique Felinejoy
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <a href="https://www.tiktok.com/@sissoulily" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-white text-xs transition-colors">TikTok</a>
            <span className="text-emerald-800">·</span>
            <a href="https://www.instagram.com/sissou02" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-white text-xs transition-colors">Instagram</a>
          </div>
          <p className="text-center text-xs text-emerald-600 mt-4">2025 Harmonie Féline & Humaine · Tous droits réservés</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
