import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, ExternalLink, Tag, Bell, ChevronDown } from "lucide-react";
import { API } from "../App";

const useSEO = () => {
  useEffect(() => {
    document.title = "Harmonie Féline & Humaine | Blog Bien-être humain, animal & connexion";
    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "Blog bien-être : Oméga-3 Zinzino prouvés, lien humain-animal, rituels naturels. Transformez votre santé et celle de votre animal.");
    setMeta("keywords", "bien-être humain, bien-être animal, oméga-3, zinzino, chat, lien humain-animal, blog bien-être, felinejoy, accords toltèques");
    setMeta("og:title", "Harmonie Féline & Humaine | Blog Bien-être", true);
    setMeta("og:description", "Prendre soin de soi, comprendre son animal, chérir ce lien unique.", true);
    setMeta("og:type", "website", true);
    setMeta("og:url", "https://harmonie.felinejoy.com", true);
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
        <div className="flex gap-2 mt-auto flex-wrap">
          <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors">
            <ExternalLink className="w-3 h-3" />Zinzino
          </a>
          <a href="https://felinejoycamy.myshopify.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors">
            <ShoppingBag className="w-3 h-3" />Felinejoy
          </a>
        </div>
      </div>
    </motion.article>
  );
};

const BenCard = ({ icon, title, sub }) => (
  <div className="bg-white border border-emerald-100 rounded-xl p-3 text-center hover:shadow-sm transition-shadow">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xs font-semibold text-emerald-800">{title}</div>
    <div className="text-xs text-emerald-600 mt-0.5">{sub}</div>
  </div>
);

const ProdCard = ({ img, name, sub, star, link }) => (
  <a href={link || "https://felinejoycamy.myshopify.com"} target="_blank" rel="noopener noreferrer"
    className={`block rounded-xl overflow-hidden bg-white transition-all hover:shadow-lg hover:-translate-y-1 ${star ? "border-2 border-emerald-600" : "border border-gray-100"}`}>
    {star && <div className="bg-emerald-700 text-white text-center text-xs font-bold py-1 tracking-wide">⭐ BEST-SELLER</div>}
    <img src={img} alt={name} loading="lazy" className="w-full h-28 object-cover"
      onError={(e) => { e.target.style.background = "#f0f0ec"; }} />
    <div className="p-2.5">
      <div className="text-xs font-semibold text-emerald-800 leading-snug">{name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
      <div className="text-xs font-semibold text-emerald-700 mt-1.5 underline">Decouvrir</div>
    </div>
  </a>
);

const MasqueIllo = () => (
  <div className="w-full h-36 bg-gradient-to-br from-amber-50 to-stone-100 relative flex items-center justify-center overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
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
    {[{ l:"52%",t:"30%",s:5 },{ l:"60%",t:"22%",s:3 },{ l:"65%",t:"40%",s:4 },{ l:"45%",t:"55%",s:3 }].map((d,i)=>(
      <div key={i} className="absolute rounded-full bg-indigo-600" style={{ left:d.l,top:d.t,width:d.s,height:d.s,opacity:0.75,boxShadow:"0 0 6px rgba(79,70,229,0.5)" }} />
    ))}
    <div className="absolute bottom-2 left-3 bg-white/80 rounded-full px-2.5 py-0.5 text-xs font-medium text-amber-900">
      Poudre de Nila · Fromage blanc 3%
    </div>
  </div>
);

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="px-5 md:px-8 py-8 bg-gradient-to-br from-emerald-800 to-teal-900">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Rejoignez la communauté Harmonie</h2>
        <p className="text-sm text-emerald-200 mb-5 leading-relaxed">
          Recevez chaque semaine nos articles bien-être, conseils pour votre chat, rituels naturels et offres exclusives Zinzino.
        </p>
        {sent ? (
          <div className="bg-white/20 rounded-xl px-6 py-4 text-white font-medium">
            Merci ! Vous recevrez bientôt notre prochaine newsletter.
          </div>
        ) : (
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60" />
            <button onClick={() => { if(email) setSent(true); }}
              className="bg-white text-emerald-800 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap">
              S'abonner
            </button>
          </div>
        )}
        <p className="text-xs text-emerald-300 mt-3">Pas de spam · Désinscription facile</p>
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

const AMAZON_PRODUCTS = [
  { name:"Diffuseur Huiles Essentielles", desc:"Ultrasonique 300ml, silencieux, 7 couleurs LED", img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80", url:"https://www.amazon.fr/dp/B07TD59XY6?tag=sissoulily-21", badge:"🌸 Relaxation" },
  { name:"Lampe de Luminothérapie Beurer", desc:"10 000 Lux, combat la fatigue hivernale", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", url:"https://www.amazon.fr/dp/B00MOIWOAK?tag=sissoulily-21", badge:"☀️ Énergie" },
  { name:"Correcteur de Posture Dos", desc:"Homme & Femme, soulage les douleurs dorsales", img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80", url:"https://www.amazon.fr/dp/B0D146DFH8?tag=sissoulily-21", badge:"💪 Bien-être" },
  { name:"Coussin Ergonomique Lombaire", desc:"Bureau & voiture, anti-glissant", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", url:"https://www.amazon.fr/dp/B0DNZ76LMP?tag=sissoulily-21", badge:"🪑 Confort" },
  { name:"Tapis de Yoga Premium", desc:"Antidérapant, épaisseur 6mm, écologique", img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80", url:"https://www.amazon.fr/s?k=tapis+yoga+premium+antiderapant&tag=sissoulily-21", badge:"🧘 Yoga" },
  { name:"Bougie Méditation Naturelle", desc:"Cire de soja, parfum apaisant, longue durée", img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&q=80", url:"https://www.amazon.fr/s?k=bougie+meditation+cire+soja+naturelle&tag=sissoulily-21", badge:"🕯️ Zen" },
  { name:"Journal de Gratitude", desc:"Planner bien-être, 365 jours, couverture souple", img:"https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=300&q=80", url:"https://www.amazon.fr/s?k=journal+gratitude+planner+bien-etre&tag=sissoulily-21", badge:"📔 Mindset" },
  { name:"Tisane Relaxante Bio", desc:"Mélange camomille, valériane, passiflore", img:"https://images.unsplash.com/photo-1556383689-b86b57bac7a0?w=300&q=80", url:"https://www.amazon.fr/s?k=tisane+relaxante+bio+camomille+valeriane&tag=sissoulily-21", badge:"🌿 Bio" },
];

const fallback = [
  { title:"3 mois d'Omega-3 pour mieux dormir et reduire le stress", category:"Science", excerpt:"Une etude relayee par Science & Vie revele qu'une cure de 3 mois d'Omega-3 transforme votre equilibre mental.", image_url:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", slug:"omega-3-stress-sommeil-cure-3-mois", reading_time:6 },
  { title:"Comment votre chat ressent votre anxiete", category:"Bien-être animal", excerpt:"Les chats percoivent les changements physiologiques de leurs proprietaires avec une acuite surprenante.", image_url:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80", slug:"comment-les-animaux-reduisent-notre-stress", reading_time:4 },
  { title:"Le lien humain-animal reduit le cortisol de 23%", category:"Lien", excerpt:"Des etudes scientifiques confirment ce que nous ressentons.", image_url:"https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&q=80", slug:"bienfaits-therapeutiques-presence-animale", reading_time:5 },
  { title:"L'importance du sommeil pour la sante", category:"Bien-être humain", excerpt:"Le sommeil est un pilier fondamental de notre sante. Apprenez a optimiser vos nuits.", image_url:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80", slug:"importance-sommeil-sante", reading_time:6 },
  { title:"Nutrition Optimale pour les Chats Seniors", category:"Bien-être animal", excerpt:"Les besoins nutritionnels de votre chat evoluent avec l'age. Decouvrez comment adapter son alimentation.", image_url:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80", slug:"nutrition-chat-senior", reading_time:5 },
  { title:"Comment les animaux reduisent notre stress", category:"Lien", excerpt:"Decouvrez pourquoi la presence d'un animal de compagnie est l'un des remedes naturels les plus puissants.", image_url:"https://images.unsplash.com/photo-1511044568932-338ceba5ad33?w=600&q=80", slug:"comment-les-animaux-reduisent-notre-stress", reading_time:5 },
];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  useSEO();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const r = await fetch(`${API}/articles?limit=20`);
        if (r.ok) {
          const data = await r.json();
          if (data.length > 0) setArticles(data);
        }
      } catch (e) { console.error(e); }
    };
    fetchArticles();
  }, []);

  const sortArticles = (arts) => {
    const sorted = [...arts].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const top6 = sorted.slice(0, 6).map(a => a.slug);
    sorted.forEach(a => a.featured = top6.includes(a.slug));
    return sorted;
  };

  const displayArticles = sortArticles(articles.length > 0 ? articles : fallback);

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
              Articles prouvés, rituels naturels et produits soigneusement sélectionnés pour vous et votre félin.
            </p>
          </motion.div>
        </div>
        <div className="bg-white px-5 md:px-8 pt-5 pb-6 max-w-5xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl hidden md:block">
            Un espace dédié au bien-être humain, à la santé animale, et à cette connexion profonde qui nous unit à nos compagnons félins.
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[
              { icon:"🧘", label:"Bien-être humain", sub:"Corps, esprit & compléments prouvés", bg:"bg-emerald-50 border-emerald-200", h:"text-emerald-800", s:"text-emerald-600" },
              { icon:"🐱", label:"Bien-être animal", sub:"Santé, bonheur & comportement", bg:"bg-orange-50 border-orange-200", h:"text-orange-800", s:"text-orange-600" },
              { icon:"🤝", label:"Lien humain-animal", sub:"Ce qu'il nous apporte vraiment", bg:"bg-violet-50 border-violet-200", h:"text-violet-800", s:"text-violet-600" },
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

        {/* Masque Nila */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="mt-6 bg-white rounded-2xl overflow-hidden border border-amber-100 md:flex shadow-sm">
          <div className="md:w-64 flex-shrink-0"><MasqueIllo /></div>
          <div className="p-4 md:p-6">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
              ✨ Rituel beauté hebdomadaire
            </span>
            <h3 className="font-semibold text-amber-900 mb-3">Masque Nila & Fromage Blanc — peau nette, teint unifié</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{ico:"🔵",qty:"2 c. à café",n:"poudre de Nila"},{ico:"🥛",qty:"2 c. à soupe",n:"fromage blanc 3%"},{ico:"⏱️",qty:"20 minutes",n:"de pose zen"}].map(g=>(
                <div key={g.n} className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-center">
                  <div className="text-xl mb-1">{g.ico}</div>
                  <div className="text-xs font-semibold text-amber-900">{g.qty}</div>
                  <div className="text-xs text-amber-700 mt-0.5">{g.n}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4">
              {["Mélangez 2 c. à café de Nila avec 2 c. à soupe de fromage blanc 3%.","Appliquez sur le visage après la douche — les pores sont dilatés.","Laissez poser 20 minutes, rincez. 1 fois par semaine."].map((step,i)=>(
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Unifie le teint","Réduit les points noirs","Anti-boutons","Atténue les cicatrices"].map(b=>(
                <span key={b} className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-full">✓ {b}</span>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 leading-relaxed">
              🌿 <strong>Conseil zen :</strong> profitez de ces 20 minutes pour méditer avec votre chat.
            </div>
          </div>
        </motion.div>

        <Link to="/blog" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors">
          Voir tous les articles <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* NEWSLETTER */}
      <NewsletterCTA />

      {/* ZINZINO */}
      <section className="px-5 md:px-8 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-0.5">Compléments prouvés scientifiquement</p>
          <h2 className="text-lg md:text-2xl font-semibold text-emerald-800 mb-1">Oméga-3 Zinzino — testés, mesurés, prouvés</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">
            Des laboratoires scandinaves indépendants analysent votre sang avant et après. Via notre lien partenaire, <strong className="text-emerald-700">prix avantageux jusqu'à 30% moins chers.</strong>
          </p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 bg-emerald-800 text-white rounded-xl px-4 py-2.5 mb-5">
              <Tag className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-semibold"><strong>Prix partenaire exclusif</strong> — jusqu'à 30% de réduction vs prix public · Livraison incluse</p>
            </div>
            <div className="md:flex gap-6">
              <div className="flex gap-3 items-center mb-4 md:mb-0 md:flex-col md:items-center md:w-44 md:flex-shrink-0">
                <img src="https://zinzinowebstorage.blob.core.windows.net/productimages/large/300000.png"
                  alt="Zinzino BalanceOil+ Omega-3" loading="lazy"
                  className="w-16 h-20 md:w-28 md:h-36 object-contain bg-white rounded-xl p-1 border border-emerald-100 flex-shrink-0 shadow-sm"
                  onError={e=>e.target.style.display="none"} />
                <div className="md:text-center">
                  <h3 className="font-semibold text-emerald-800">Zinzino BalanceOil+</h3>
                  <p className="text-xs text-emerald-600 mt-0.5 mb-2">Huile Omega-3 · Polyphénols · Vit. D3</p>
                  <div className="flex gap-1.5 flex-wrap md:justify-center">
                    <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded-full">1,7M tests</span>
                    <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded-full">Friend of the Sea</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-800 mb-2">Bénéfices prouvés cliniquement :</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <BenCard icon="🔥" title="Réduit l'inflammation" sub="silencieuse et chronique" />
                  <BenCard icon="🛡️" title="Prévient les maladies" sub="cardio et chroniques" />
                  <BenCard icon="⚡" title="Regagne en énergie" sub="mentale et physique" />
                  <BenCard icon="😴" title="Améliore le sommeil" sub="réduit le stress" />
                </div>
                <div className="bg-white border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-800 text-center mb-3">Ratio Omega-6/3 avant et après 120 jours</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-center bg-red-50 border border-red-100 rounded-lg py-2">
                      <div className="text-lg font-bold text-red-500">25:1</div>
                      <div className="text-xs text-gray-400">Moyenne française</div>
                    </div>
                    <div className="text-emerald-400 text-xl font-light">→</div>
                    <div className="flex-1 text-center bg-emerald-50 border border-emerald-100 rounded-lg py-2">
                      <div className="text-lg font-bold text-emerald-600">3:1</div>
                      <div className="text-xs text-gray-400">Après Zinzino</div>
                    </div>
                    <div className="text-emerald-400 text-xl font-light">→</div>
                    <div className="flex-1 text-center bg-emerald-50 border border-emerald-100 rounded-lg py-2">
                      <div className="text-lg font-bold text-emerald-700">120j</div>
                      <div className="text-xs text-gray-400">Prouvé</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-xl text-sm font-bold transition-colors mt-4 shadow-md">
              <ShoppingBag className="w-4 h-4" />Commander sur Zinzino — prix partenaire avantageux<ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="mt-3 flex items-center gap-2.5 bg-white border border-emerald-100 rounded-xl p-3">
              <span className="text-base">🐾</span>
              <div className="flex-1">
                <div className="text-xs font-semibold text-emerald-800">Compléments alimentaires animaux</div>
                <div className="text-xs text-emerald-600">aussi disponibles chez Zinzino — même qualité scandinave</div>
              </div>
              <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer"
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-emerald-100 transition-colors whitespace-nowrap">
                Voir
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
        <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-0.5">Boutique Felinejoy</p>
        <h2 className="text-lg md:text-2xl font-semibold text-emerald-800 mb-1">Pour les amoureux des chats</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">Accessoires, jouets et t-shirts originaux pour chérir votre félin et afficher votre passion.</p>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/13315842307128167536_2048.jpg?v=1774202108&width=400"
            name="Stay Weird Stay Wild" sub="T-shirt rétro unisexe" star
            link="https://felinejoycamy.myshopify.com/products/unisex-garment-dyed-t-shirt" />
          <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/3106667881955.jpg?v=1770412974&width=400"
            name="Cozy Cave Cat Bed" sub="Niche douillette pompom"
            link="https://felinejoycamy.myshopify.com/products/lit-cocooning-pour-chat-niche-douillette-avec-pompon-couchage-premium" />
          <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/data_dd19f71b-8e59-4d10-b92b-6f0e5686c97a.jpg?v=1770414077&width=400"
            name="Crazy Cat Lady" sub="100% coton premium"
            link="https://felinejoycamy.myshopify.com/products/t-shirt-crazy-cat-lady-100-coton-premium-cadeau-parfait-maman-chat" />
          <ProdCard img="https://felinejoycamy.myshopify.com/cdn/shop/files/data_b7f70288-c0a0-4b26-8fc5-a0d8315e5fcb.png?v=1770408141&width=400"
            name="Jouet plume rotatif" sub="USB rechargeable auto"
            link="https://felinejoycamy.myshopify.com/products/jouet-interactif-chat-culbuto-balle-oscillante-stimulante-auto-amusement" />
        </motion.div>
        <a href="https://felinejoycamy.myshopify.com" target="_blank" rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors shadow-md">
          Voir toute la boutique Felinejoy <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

      {/* LIEN HUMAIN-ANIMAL */}
      <section className="px-5 md:px-8 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-0.5">Lien humain-animal</p>
          <h2 className="text-lg md:text-2xl font-semibold text-emerald-800 mb-2">Ce que votre chat vous apporte vraiment</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">La science confirme ce que nous ressentons : notre lien avec nos animaux nous transforme profondément.</p>
          <div className="md:flex gap-6">
            <div className="relative rounded-2xl overflow-hidden h-52 md:h-72 md:w-96 flex-shrink-0 mb-4 md:mb-0 shadow-md">
              <img src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80"
                alt="Personne enlacant son chat — lien humain-animal" loading="lazy"
                className="w-full h-full object-cover"
                onError={e=>e.target.src="https://images.unsplash.com/photo-1611695434398-4f4b330623e4?w=800&q=80"} />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white text-sm italic leading-relaxed font-medium"
                style={{ textShadow:"0 1px 6px rgba(0,0,0,0.5)" }}>
                "Un animal réduit le cortisol, ralentit le coeur, ancre dans le présent."
              </p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{v:"-23%",l:"cortisol"},{v:"+oxytocine",l:"hormone du lien"},{v:"-15%",l:"risque cardiaque"}].map(s=>(
                  <div key={s.v} className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <div className="text-base font-bold text-violet-700">{s.v}</div>
                    <div className="text-xs text-violet-500 mt-0.5 leading-snug">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <p className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-3">Le saviez-vous ?</p>
                <div className="space-y-3">
                  {[
                    { icon:"🧠", txt:"Caresser un chat libère de l'ocytocine — la même hormone que lors d'un câlin humain." },
                    { icon:"❤️", txt:"Les propriétaires de chats ont 30% moins de risques d'AVC selon une étude de l'Université du Minnesota." },
                    { icon:"😴", txt:"Le ronronnement du chat (25-50 Hz) favorise la régénération osseuse et réduit le stress." },
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

      {/* AMAZON EN BAS */}
      <section className="px-5 md:px-8 py-8 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-0.5">Nos coups de coeur Amazon</p>
          <h2 className="text-lg md:text-2xl font-semibold text-emerald-800 mb-1">Produits bien-être pour vous & votre chat</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">Sélectionnés avec soin pour leur qualité et leur impact sur votre bien-être et celui de votre félin.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMAZON_PRODUCTS.map((p,i)=>(
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                className="group bg-white rounded-xl overflow-hidden border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all">
                <div className="relative h-28 overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 bg-white/90 text-xs font-semibold px-2 py-0.5 rounded-full text-amber-800">{p.badge}</span>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                  <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />Voir sur Amazon
                  </p>
                </div>
              </a>
            ))}
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
            <a href="https://www.zinzino.com/2020929659" target="_blank" rel="noopener noreferrer"
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
