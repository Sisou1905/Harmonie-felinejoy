import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

// Pages
import HomePage from "./pages/HomePage";
import HumanWellnessPage from "./pages/HumanWellnessPage";
import AnimalWellnessPage from "./pages/AnimalWellnessPage";
import ConnectionPage from "./pages/ConnectionPage";
import ArticlePage from "./pages/ArticlePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";
import AdminPage from "./pages/AdminPage";
import SearchPage from "./pages/SearchPage";
import LandingPage from "./pages/LandingPage";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && !location.state?.user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-heading">Chargement...</div>
      </div>
    );
  }

  if (!user && !location.state?.user) {
    return null;
  }

  return children;
};

// Page Wrapper with Animation
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Main App Router
const AppRouter = () => {
  const location = useLocation();

  // Check URL fragment for session_id - synchronously during render
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/bien-etre-humain" element={<PageWrapper><HumanWellnessPage /></PageWrapper>} />
            <Route path="/bien-etre-animal" element={<PageWrapper><AnimalWellnessPage /></PageWrapper>} />
            <Route path="/connexion" element={<PageWrapper><ConnectionPage /></PageWrapper>} />
            <Route path="/article/:slug" element={<PageWrapper><ArticlePage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
            <Route path="/guide/:slug" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <PageWrapper><AdminPage /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper><DashboardPage /></PageWrapper>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Newsletter />
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  // Seed data on first load
  useEffect(() => {
    const seedData = async () => {
      try {
        await fetch(`${API}/seed`, { method: "POST" });
      } catch (e) {
        console.log("Seed skipped or already done");
      }
    };
    seedData();
  }, []);

  return (
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
