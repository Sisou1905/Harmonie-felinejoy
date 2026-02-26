import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API, useAuth } from "../App";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, checkAuth } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use useRef to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      // Extract session_id from URL fragment
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get("session_id");

      if (!sessionId) {
        toast.error("Session invalide");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Exchange session_id for user data
        const response = await fetch(`${API}/auth/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          toast.success(`Bienvenue, ${userData.name} !`);
          
          // Clear the hash and navigate to dashboard
          window.history.replaceState(null, "", window.location.pathname);
          navigate("/dashboard", { replace: true, state: { user: userData } });
        } else {
          const error = await response.json();
          toast.error(error.detail || "Échec de l'authentification");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Erreur de connexion");
        navigate("/login", { replace: true });
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-white text-2xl font-heading font-semibold">H</span>
        </div>
        <p className="text-text-muted text-lg animate-pulse">Connexion en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
