import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, Tag, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import ArticleCard from "../components/ArticleCard";
import { API } from "../App";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedTags, setSelectedTags] = useState(
    searchParams.get("tags")?.split(",").filter(t => t) || []
  );
  const [articles, setArticles] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "", label: "Toutes les catégories" },
    { value: "human", label: "Bien-être Humain" },
    { value: "animal", label: "Bien-être Animal" },
    { value: "connection", label: "La Connexion" }
  ];

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch(`${API}/tags`);
      if (response.ok) {
        const data = await response.json();
        setAllTags(data);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, []);

  const searchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedTags.length) params.append("tags", selectedTags.join(","));

      const response = await fetch(`${API}/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedTags]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchArticles();
      
      // Update URL params
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTags.length) params.set("tags", selectedTags.join(","));
      setSearchParams(params);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory, selectedTags, searchArticles, setSearchParams]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
  };

  const hasFilters = query || selectedCategory || selectedTags.length > 0;

  return (
    <>
      <Helmet>
        <title>Recherche | Harmonie Féline & Humaine</title>
        <meta name="description" content="Recherchez des articles sur le bien-être humain, animal et la connexion entre les deux." />
      </Helmet>

      <div className="min-h-screen bg-background" data-testid="search-page">
        {/* Search Header */}
        <section className="gradient-mesh py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-text-main mb-6">
                Rechercher des articles
              </h1>
              
              {/* Search Input */}
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par mot-clé..."
                  className="h-14 pl-12 pr-4 rounded-full bg-white border-border text-text-main placeholder:text-text-light shadow-soft"
                  data-testid="search-input"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-main"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="section-spacing">
          <div className="container-custom">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-text-main flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filtres
                    </h2>
                    {hasFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs text-text-muted"
                      >
                        Effacer
                      </Button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-text-main mb-3">Catégorie</h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === cat.value
                              ? "bg-primary-light text-primary-dark font-medium"
                              : "text-text-muted hover:bg-background"
                          }`}
                          data-testid={`category-filter-${cat.value || "all"}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-medium text-text-main mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags populaires
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 15).map((tagData) => (
                        <Badge
                          key={tagData.tag}
                          variant={selectedTags.includes(tagData.tag) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors ${
                            selectedTags.includes(tagData.tag)
                              ? "bg-primary text-white"
                              : "bg-primary-light/50 text-text-muted hover:bg-primary-light"
                          }`}
                          onClick={() => toggleTag(tagData.tag)}
                          data-testid={`tag-${tagData.tag}`}
                        >
                          {tagData.tag}
                          <span className="ml-1 opacity-60">({tagData.count})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-text-muted">
                    {loading ? (
                      "Recherche en cours..."
                    ) : (
                      `${articles.length} article${articles.length !== 1 ? "s" : ""} trouvé${articles.length !== 1 ? "s" : ""}`
                    )}
                  </p>
                  {selectedTags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-muted">Tags:</span>
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-primary text-white cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-3xl h-80 animate-pulse" />
                    ))}
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl">
                    <SearchIcon className="h-16 w-16 mx-auto mb-4 text-text-light opacity-30" />
                    <h3 className="font-heading text-xl text-text-main mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-text-muted mb-6">
                      Essayez avec d'autres mots-clés ou filtres
                    </p>
                    <Button onClick={clearFilters} className="btn-secondary">
                      Effacer les filtres
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {articles.map((article, index) => (
                      <ArticleCard key={article.article_id} article={article} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SearchPage;
