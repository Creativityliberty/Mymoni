# ✅ SubSensei - Checklist Complète

## 📋 Développement Local

### Installation
- [ ] Node.js 20+ installé
- [ ] PostgreSQL 15+ installé et démarré
- [ ] Repository cloné
- [ ] `npm install` exécuté
- [ ] `.env` créé depuis `.env.example`
- [ ] `DATABASE_URL` configuré
- [ ] `npx prisma db push` exécuté
- [ ] `npx prisma generate` exécuté
- [ ] `npm run db:seed` exécuté
- [ ] `npm run dev` fonctionne
- [ ] http://localhost:3000 accessible

### Vérifications Fonctionnelles
- [ ] Dashboard affiche les KPIs
- [ ] Page Abonnements charge la table
- [ ] Formulaire création fonctionne
- [ ] Page Alertes affiche les alertes
- [ ] Page Factures accessible
- [ ] Page Réglages accessible
- [ ] Page Agent accessible
- [ ] Chat Dock s'ouvre (bouton bot)
- [ ] Dark/Light mode fonctionne
- [ ] Sidebar navigation fonctionne

### Tests API
- [ ] GET `/api/subscriptions` retourne les données
- [ ] POST `/api/subscriptions` crée un abonnement
- [ ] GET `/api/subscriptions/:id` retourne un abonnement
- [ ] PUT `/api/subscriptions/:id` modifie un abonnement
- [ ] DELETE `/api/subscriptions/:id` supprime un abonnement
- [ ] POST `/api/agent` répond aux messages

---

## 🐳 Docker Local

### Build & Test
- [ ] `docker-compose build` réussit
- [ ] `docker-compose up -d` démarre les services
- [ ] `docker-compose logs -f web` montre les logs
- [ ] http://localhost:3000 accessible
- [ ] Base de données accessible
- [ ] Redis accessible (optionnel)
- [ ] `docker-compose down` arrête proprement

---

## 🚀 Déploiement Dokploy

### Prérequis
- [ ] Serveur avec Dokploy installé
- [ ] Accès SSH au serveur
- [ ] Domaine configuré (DNS pointé)
- [ ] PostgreSQL accessible
- [ ] Repository Git poussé

### Configuration Dokploy
- [ ] Application créée dans Dokploy
- [ ] Repository Git connecté
- [ ] Branch configurée (main)
- [ ] Build command configuré
- [ ] Start command configuré
- [ ] Port 3000 configuré

### Variables d'Environnement
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL` configuré
- [ ] `DATABASE_URL` configuré
- [ ] `AUTH_SECRET` généré (openssl rand -hex 32)
- [ ] `TZ=Europe/Paris` configuré
- [ ] `REDIS_URL` configuré (optionnel)
- [ ] `OPENAI_API_KEY` configuré (optionnel)

### Base de Données Production
- [ ] PostgreSQL créé
- [ ] Credentials notés
- [ ] Firewall configuré
- [ ] Connection string testée
- [ ] Migrations appliquées
- [ ] Seed exécuté (optionnel)

### SSL/TLS
- [ ] Domaine configuré dans Dokploy
- [ ] SSL activé
- [ ] Certificat Let's Encrypt généré
- [ ] HTTPS accessible
- [ ] HTTP redirige vers HTTPS

### Premier Déploiement
- [ ] Build réussi
- [ ] Déploiement terminé
- [ ] Application accessible
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Dashboard charge
- [ ] Base de données connectée
- [ ] Authentification fonctionne (si implémentée)

---

## 🔐 Sécurité Production

### Configuration
- [ ] `AUTH_SECRET` unique et sécurisé
- [ ] Mots de passe DB forts
- [ ] Variables sensibles dans Dokploy (pas dans code)
- [ ] `.env` dans `.gitignore`
- [ ] CORS configuré
- [ ] Rate limiting activé (TODO)
- [ ] CSRF protection activée (TODO avec NextAuth)

### Monitoring
- [ ] Logs accessibles
- [ ] Métriques Dokploy activées
- [ ] Sentry configuré (optionnel)
- [ ] Alertes configurées (optionnel)

### Backups
- [ ] Backup PostgreSQL automatique
- [ ] Cron configuré
- [ ] Backup testé (restore)
- [ ] Rétention définie (7 jours minimum)

---

## 🧪 Tests (TODO)

### Unit Tests
- [ ] Tests services écrits
- [ ] Tests utilitaires écrits
- [ ] Tests actions agent écrits
- [ ] `npm run test` passe

### Integration Tests
- [ ] Tests API routes écrits
- [ ] Tests Prisma queries écrits
- [ ] Tests LLM providers écrits

### E2E Tests
- [ ] Tests Playwright écrits
- [ ] Scénarios critiques couverts
- [ ] `npm run test:e2e` passe

---

## 📊 Performance

### Optimisations
- [ ] Images optimisées
- [ ] Bundle size vérifié (<1MB)
- [ ] Lighthouse score >90
- [ ] Time to First Byte <200ms
- [ ] First Contentful Paint <1s
- [ ] Largest Contentful Paint <2.5s

### Caching
- [ ] Redis configuré (optionnel)
- [ ] Static assets cachés
- [ ] API responses cachées (si pertinent)

---

## 📚 Documentation

### Fichiers Présents
- [ ] README.md complet
- [ ] QUICKSTART.md à jour
- [ ] DEPLOYMENT.md détaillé
- [ ] PROJECT_STATUS.md mis à jour
- [ ] SUMMARY.md créé
- [ ] CHECKLIST.md (ce fichier)
- [ ] WELCOME.txt créé

### Code Documentation
- [ ] Fonctions complexes commentées
- [ ] Types TypeScript documentés
- [ ] API routes documentées
- [ ] Actions agent documentées

---

## 🎯 Fonctionnalités Futures

### Phase 2 (Production Ready)
- [ ] Authentification NextAuth
- [ ] Upload factures S3
- [ ] Export CSV
- [ ] Tests automatisés
- [ ] Monitoring Sentry

### Phase 3 (Scale)
- [ ] Multi-workspaces
- [ ] Jobs automatiques (BullMQ)
- [ ] Graphiques avancés
- [ ] API publique
- [ ] Mobile app

---

## ✅ Validation Finale

### Avant de Déclarer "Production Ready"
- [ ] Tous les tests passent
- [ ] Authentification implémentée
- [ ] SSL activé
- [ ] Backups configurés
- [ ] Monitoring actif
- [ ] Documentation complète
- [ ] Équipe formée
- [ ] Support défini

---

## 📞 Contacts & Support

### En cas de problème
- [ ] Documentation consultée
- [ ] Logs vérifiés
- [ ] GitHub Issues créé (si bug)
- [ ] Support Dokploy contacté (si infra)

---

**Date de dernière mise à jour :** 5 octobre 2025  
**Version :** 0.1.0 (MVP)
