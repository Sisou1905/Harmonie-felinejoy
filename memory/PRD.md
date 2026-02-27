# PRD - Harmonie Féline & Humaine

## Énoncé du Problème Original
Blog bien-être complet et apaisant avec palette de couleurs douces (verts et bleus pastel). Trois sections principales interconnectées via React Router : Bien-être Humain, Bien-être Animal, et La Connexion. Mind maps interactifs avec ReactFlow, articles scientifiques avec références, interactions engageantes (like, bookmark, partage), commentaires nécessitant inscription. Google OAuth via Emergent Auth. Newsletter. Intégration des boutiques Shopify et Zinzino.

## Architecture

### Backend (FastAPI + MongoDB)
- **Auth**: Google OAuth via Emergent Auth avec sessions httpOnly cookies
- **Articles**: CRUD avec catégories (human, animal, connection)
- **Comments**: Système de commentaires authentifiés
- **Interactions**: Like, Bookmark par utilisateur
- **Newsletter**: Subscription par email

### Frontend (React + Tailwind)
- **Pages**: Home, HumanWellness, AnimalWellness, Connection, Article, Dashboard, Login
- **Components**: Header, Footer, MindMap (ReactFlow), ArticleCard, CommentSection, Newsletter, ProductSpotlight, LanguageSelector
- **Design**: Palette pastel (verts/bleus), fonts Fraunces + Manrope

## User Personas
1. **Lecteur bien-être**: Cherche des articles sur la méditation, sommeil, nutrition
2. **Propriétaire de chat**: S'intéresse au bien-être félin
3. **Acheteur potentiel**: Intéressé par les produits des boutiques partenaires

## Core Requirements (Static)
- [x] 3 sections principales avec navigation
- [x] Mind maps interactifs ReactFlow
- [x] Articles avec sources scientifiques
- [x] Like/Bookmark/Share
- [x] Commentaires (auth required)
- [x] Google OAuth
- [x] Newsletter subscription
- [x] Liens boutiques (Shopify + Zinzino)
- [x] Design pastel apaisant
- [x] SEO meta tags dynamiques
- [x] Responsive design
- [x] Traduction multi-langues (FR, EN, PL, TR, AR)

## What's Been Implemented
- **26 Fév 2026**: MVP complet avec toutes les fonctionnalités
  - Backend API avec auth, articles, comments, likes, bookmarks, newsletter
  - Frontend React avec 8 pages, 8 components majeurs
  - Mind maps interactifs sur 3 pages
  - Google OAuth intégré
  - Sélecteur de langue avec 5 langues

- **27 Fév 2026**: Phase 2 - Fonctionnalités avancées
  - Panel Admin pour créer/modifier/supprimer des articles
  - Système de recherche avec filtres par tags et catégories
  - 3 Landing Pages SEO optimisées (méditation débutant, santé chat senior, zoothérapie)
  - Système de gestion de campagnes newsletter
  - API de statistiques admin

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Core navigation et pages
- [x] Articles avec contenu
- [x] Authentification Google
- [x] Mind maps interactifs

### P1 (High)
- [ ] Système de modération des commentaires
- [ ] Panel admin pour gérer les articles
- [ ] Analytics et tracking

### P2 (Medium)
- [ ] Landing pages SEO spécifiques (méditation débutant, santé chat senior)
- [ ] Système de recherche d'articles
- [ ] Tags et filtres avancés
- [ ] Notifications email pour nouveaux articles

### P3 (Nice to have)
- [ ] Mode sombre
- [ ] PWA pour mobile
- [ ] Intégration réseaux sociaux

## Next Tasks
1. Créer un panel admin pour ajouter des articles régulièrement
2. Implémenter la recherche d'articles
3. Ajouter des landing pages SEO ciblées
4. Intégrer un système d'analytics
