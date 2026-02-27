import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, LogIn } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { API, useAuth } from "../App";

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = useAuth();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/articles/${articleId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          article_id: articleId,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        // Don't add to list yet - it needs moderation
        setNewComment("");
        toast.success("Commentaire soumis ! Il sera visible après modération.");
      } else if (response.status === 401) {
        toast.error("Connectez-vous pour commenter");
      } else {
        toast.error("Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`${API}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.comment_id !== commentId));
        toast.success("Commentaire supprimé");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-border" data-testid="comment-section">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h3 className="font-heading text-2xl font-semibold text-text-main">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback className="bg-primary text-white">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez votre avis..."
                className="min-h-[100px] rounded-2xl border-border focus:border-primary resize-none"
                data-testid="comment-textarea"
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="btn-primary"
                  data-testid="submit-comment-btn"
                >
                  {submitting ? (
                    <span className="animate-pulse">Envoi...</span>
                  ) : (
                    <>
                      Publier
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 rounded-2xl bg-primary-light/30 border border-primary-light text-center">
          <p className="text-text-muted mb-4">Connectez-vous pour laisser un commentaire</p>
          <Button onClick={login} className="btn-primary" data-testid="login-to-comment-btn">
            <LogIn className="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-text-muted animate-pulse">
          Chargement des commentaires...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Soyez le premier à commenter !</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.comment_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-4 p-5 rounded-2xl bg-white shadow-soft"
                data-testid={`comment-${comment.comment_id}`}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={comment.user_picture} alt={comment.user_name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {comment.user_name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-text-main">{comment.user_name}</span>
                      <span className="text-text-light text-sm ml-3">
                        {comment.created_at
                          ? format(new Date(comment.created_at), "d MMM yyyy, HH:mm", { locale: fr })
                          : "Récent"}
                      </span>
                    </div>
                    {user && user.user_id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.comment_id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-text-light hover:text-red-500 transition-colors"
                        data-testid={`delete-comment-${comment.comment_id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-text-muted leading-relaxed">{comment.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default CommentSection;
