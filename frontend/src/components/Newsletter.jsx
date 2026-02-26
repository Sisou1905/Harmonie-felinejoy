import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Sparkles } from "lucide-react";
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
        toast.success("Bienvenue dans notre communauté !");
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
    <section className="bg-gradient-to-br from-primary-light via-white to-secondary-light py-20" data-testid="newsletter-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text-muted">Newsletter Bien-être</span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-4">
            Restez informé de nos derniers articles
          </h2>
          <p className="text-text-muted text-lg mb-8">
            Recevez chaque semaine des conseils bien-être pour vous et vos compagnons félins.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-primary font-medium"
            >
              <CheckCircle className="h-6 w-6" />
              <span>Merci ! Vous êtes inscrit à notre newsletter.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 rounded-full bg-white border-border focus:border-primary text-text-main placeholder:text-text-light sm:w-80"
                required
                data-testid="newsletter-email-input"
              />
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary h-14 px-8"
                data-testid="newsletter-submit-btn"
              >
                {loading ? (
                  <span className="animate-pulse">Inscription...</span>
                ) : (
                  <>
                    S'inscrire
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
