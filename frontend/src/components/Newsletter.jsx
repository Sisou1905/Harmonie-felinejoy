import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Sparkles, Mail, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { API } from "../App";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail("");
        toast.success("Bienvenue dans notre communauté ! 🎉");
      } else {
        const data = await response.json();
        toast.error(data.detail || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
      data-testid="newsletter-section"
    >
      {/* Playful card design */}
      <div className="relative bg-gradient-to-br from-primary-light/60 via-white to-secondary-light/60 rounded-[2.5rem] p-8 md:p-12 shadow-float border-2 border-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        
        {/* Floating emojis */}
        <motion.div 
          className="absolute top-4 right-8 text-3xl opacity-50"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          📬
        </motion.div>
        <motion.div 
          className="absolute bottom-4 left-8 text-2xl opacity-50"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          ✨
        </motion.div>

        <div className="relative z-10 text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-soft border border-primary-light/30 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              💌
            </motion.span>
            <span className="text-sm font-semibold text-primary-dark">Newsletter Bien-être</span>
          </motion.div>

          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text-main mb-3">
            Rejoignez notre communauté !
          </h2>
          <p className="text-text-muted text-base mb-8 max-w-md mx-auto">
            Recevez chaque semaine des conseils bien-être pour prendre soin de vous au quotidien ✨
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { emoji: "📚", text: "Articles exclusifs" },
              { emoji: "🎁", text: "Conseils gratuits" },
              { emoji: "🌿", text: "Rituels naturels" },
            ].map((item, i) => (
              <motion.span 
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full text-xs font-medium text-text-muted shadow-soft"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <span>{item.emoji}</span>
                {item.text}
              </motion.span>
            ))}
          </div>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">🎉</span>
              </motion.div>
              <div className="flex items-center gap-3 text-primary-dark font-semibold text-lg">
                <CheckCircle className="h-6 w-6" />
                <span>Merci ! Vous êtes inscrit.</span>
              </div>
              <p className="text-text-muted text-sm">Vérifiez votre boîte mail pour confirmer</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 pr-6 rounded-full bg-white border-2 border-primary-light/30 focus:border-primary text-text-main placeholder:text-text-light shadow-soft"
                  required
                  data-testid="newsletter-email-input"
                />
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-playful h-14 px-8 shadow-float whitespace-nowrap"
                  data-testid="newsletter-submit-btn"
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Inscription...
                    </motion.span>
                  ) : (
                    <>
                      S'inscrire
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          )}

          {/* Trust indicators */}
          {!subscribed && (
            <p className="mt-6 text-xs text-text-light">
              🔒 Pas de spam, désinscription en un clic
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Newsletter;
