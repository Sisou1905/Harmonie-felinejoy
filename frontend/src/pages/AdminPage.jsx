import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, FileText, Users, MessageSquare, Mail, 
  Plus, Edit, Trash2, Send, Eye, BarChart3, TrendingUp
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { API, useAuth } from "../App";

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "human",
    image_url: "",
    tags: "",
    sources: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, articlesRes, subscribersRes, campaignsRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { credentials: "include" }),
        fetch(`${API}/articles?limit=100`),
        fetch(`${API}/admin/newsletter/subscribers`, { credentials: "include" }),
        fetch(`${API}/admin/newsletter/campaigns`, { credentials: "include" })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (subscribersRes.ok) setSubscribers(await subscribersRes.json());
      if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/admin" } });
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title) => {
    setArticleForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    
    const articleData = {
      ...articleForm,
      tags: articleForm.tags.split(",").map(t => t.trim()).filter(t => t),
      sources: articleForm.sources ? JSON.parse(articleForm.sources) : []
    };

    try {
      const url = editingArticle 
        ? `${API}/admin/articles/${editingArticle.article_id}`
        : `${API}/admin/articles`;
      
      const response = await fetch(url, {
        method: editingArticle ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        toast.success(editingArticle ? "Article mis à jour !" : "Article créé !");
        setShowNewArticle(false);
        setEditingArticle(null);
        setArticleForm({
          title: "", slug: "", excerpt: "", content: "",
          category: "human", image_url: "", tags: "", sources: ""
        });
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const response = await fetch(`${API}/admin/articles/${articleId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Article supprimé");
        fetchData();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      image_url: article.image_url,
      tags: article.tags?.join(", ") || "",
      sources: article.sources ? JSON.stringify(article.sources) : ""
    });
    setShowNewArticle(true);
  };

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch(`${API}/admin/newsletter/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject: "Nouveautés de la semaine sur Harmonie",
          content: ""
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Campagne créée ! ${data.subscriber_count} abonnés`);
        fetchData();
      } else {
        toast.error("Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const categoryLabels = {
    human: "Bien-être Humain",
    animal: "Bien-être Animal",
    connection: "La Connexion"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-heading">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Administration | Harmonie Féline & Humaine</title>
      </Helmet>

      <div className="min-h-screen bg-background" data-testid="admin-page">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-3xl font-semibold text-text-main flex items-center gap-3">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                  Panel Administration
                </h1>
                <p className="text-text-muted mt-1">Gérez votre blog et vos abonnés</p>
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-text-muted text-sm">Articles</span>
                  </div>
                  <p className="text-3xl font-semibold text-text-main">{stats.articles.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-secondary-dark" />
                    <span className="text-text-muted text-sm">Utilisateurs</span>
                  </div>
                  <p className="text-3xl font-semibold text-text-main">{stats.users}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-5 w-5 text-accent-foreground" />
                    <span className="text-text-muted text-sm">Commentaires</span>
                  </div>
                  <p className="text-3xl font-semibold text-text-main">{stats.comments}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-text-muted text-sm">Abonnés Newsletter</span>
                  </div>
                  <p className="text-3xl font-semibold text-text-main">{stats.newsletter_subscribers}</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="articles" className="space-y-6">
              <TabsList className="bg-white shadow-soft">
                <TabsTrigger value="articles" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Articles
                </TabsTrigger>
                <TabsTrigger value="newsletter" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Newsletter
                </TabsTrigger>
              </TabsList>

              {/* Articles Tab */}
              <TabsContent value="articles">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-semibold text-text-main">
                      Gestion des Articles
                    </h2>
                    <Dialog open={showNewArticle} onOpenChange={setShowNewArticle}>
                      <DialogTrigger asChild>
                        <Button 
                          className="btn-primary"
                          onClick={() => {
                            setEditingArticle(null);
                            setArticleForm({
                              title: "", slug: "", excerpt: "", content: "",
                              category: "human", image_url: "", tags: "", sources: ""
                            });
                          }}
                          data-testid="new-article-btn"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvel Article
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingArticle ? "Modifier l'article" : "Créer un nouvel article"}
                          </DialogTitle>
                          <DialogDescription>
                            Remplissez les informations de l'article
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitArticle} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-text-main">Titre</label>
                            <Input
                              value={articleForm.title}
                              onChange={(e) => handleTitleChange(e.target.value)}
                              placeholder="Titre de l'article"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Slug (URL)</label>
                            <Input
                              value={articleForm.slug}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, slug: e.target.value }))}
                              placeholder="titre-de-larticle"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Catégorie</label>
                            <Select
                              value={articleForm.category}
                              onValueChange={(value) => setArticleForm(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="human">Bien-être Humain</SelectItem>
                                <SelectItem value="animal">Bien-être Animal</SelectItem>
                                <SelectItem value="connection">La Connexion</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Image URL</label>
                            <Input
                              value={articleForm.image_url}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, image_url: e.target.value }))}
                              placeholder="https://..."
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Extrait</label>
                            <Textarea
                              value={articleForm.excerpt}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                              placeholder="Résumé court de l'article..."
                              rows={2}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Contenu (Markdown)</label>
                            <Textarea
                              value={articleForm.content}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="## Introduction&#10;&#10;Votre contenu ici..."
                              rows={10}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Tags (séparés par des virgules)</label>
                            <Input
                              value={articleForm.tags}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, tags: e.target.value }))}
                              placeholder="méditation, bien-être, santé"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-main">Sources (JSON)</label>
                            <Textarea
                              value={articleForm.sources}
                              onChange={(e) => setArticleForm(prev => ({ ...prev, sources: e.target.value }))}
                              placeholder='[{"title": "Source 1", "url": "https://..."}]'
                              rows={2}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowNewArticle(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" className="btn-primary">
                              {editingArticle ? "Mettre à jour" : "Créer"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Articles List */}
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div
                        key={article.article_id}
                        className="flex items-center gap-4 p-4 bg-background rounded-xl"
                      >
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-20 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-text-main line-clamp-1">{article.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {categoryLabels[article.category]}
                            </Badge>
                            <span className="text-xs text-text-light">
                              {article.likes_count} likes
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteArticle(article.article_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Newsletter Tab */}
              <TabsContent value="newsletter">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Subscribers */}
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="font-heading text-xl font-semibold text-text-main mb-4">
                      Abonnés ({subscribers.length})
                    </h2>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {subscribers.map((sub, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <span className="text-sm text-text-main">{sub.email}</span>
                          <span className="text-xs text-text-light">
                            {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                      {subscribers.length === 0 && (
                        <p className="text-text-muted text-center py-4">Aucun abonné</p>
                      )}
                    </div>
                  </div>

                  {/* Campaigns */}
                  <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-heading text-xl font-semibold text-text-main">
                        Campagnes Newsletter
                      </h2>
                      <Button onClick={handleCreateCampaign} className="btn-primary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {campaigns.map((campaign) => (
                        <div key={campaign.campaign_id} className="p-4 bg-background rounded-xl">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-text-main text-sm">{campaign.subject}</h3>
                            {campaign.sent_at ? (
                              <Badge className="bg-green-100 text-green-700">Envoyée</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700">Brouillon</Badge>
                            )}
                          </div>
                          <p className="text-xs text-text-light mt-1">
                            {new Date(campaign.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                      {campaigns.length === 0 && (
                        <p className="text-text-muted text-center py-4">Aucune campagne</p>
                      )}
                    </div>
                    <p className="text-xs text-text-light mt-4">
                      Note: Pour envoyer réellement les emails, intégrez un service comme SendGrid ou Resend.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
