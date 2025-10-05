# 🚀 SubSensei - Quick Start Guide

Lancez SubSensei en 5 minutes !

---

## ⚡ Installation Express

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/subsensei.git
cd subsensei

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Setup la base de données
npx prisma db push
npx prisma generate
npm run db:seed

# 5. Lancer l'application
npm run dev
```

**🎉 Ouvrir http://localhost:3000**

---

## 🗄️ Configuration PostgreSQL

### Option 1 : PostgreSQL local

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Créer la base
createdb subsensei

# Dans .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subsensei"
```

### Option 2 : Docker

```bash
docker run -d \
  --name subsensei-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=subsensei \
  -p 5432:5432 \
  postgres:15-alpine

# Dans .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subsensei"
```

### Option 3 : Service cloud

**Supabase (gratuit) :**
1. Créer un projet sur https://supabase.com
2. Copier la "Connection string" (mode direct)
3. Coller dans `.env` → `DATABASE_URL`

---

## 🎨 Fonctionnalités disponibles

### ✅ Pages implémentées

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/` | KPIs, stats, actions rapides |
| **Abonnements** | `/subscriptions` | Table complète avec filtres |
| **Nouveau** | `/subscriptions/new` | Formulaire création |
| **Alertes** | `/alerts` | Gestion des notifications |
| **Factures** | `/invoices` | Centralisation factures |
| **Réglages** | `/settings` | Configuration workspace |
| **Agent** | `/agent` | Chat IA conversationnel |

### 🤖 Agent IA

**Actions disponibles :**
- `listRenewals` : Liste les renouvellements
- `markToCancel` : Marque à annuler
- `snoozeAlert` : Reporte une alerte
- `createSubscription` : Crée un abonnement

**Exemples de requêtes :**
```
"Quels sont mes renouvellements cette semaine ?"
"Marque Netflix à annuler"
"Repousse l'alerte de 7 jours"
"Créer un abonnement Notion à 8€/mois"
```

### 📊 API Routes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/subscriptions` | GET | Liste paginée + filtres |
| `/api/subscriptions` | POST | Créer |
| `/api/subscriptions/:id` | GET | Détails |
| `/api/subscriptions/:id` | PUT | Modifier |
| `/api/subscriptions/:id` | DELETE | Supprimer |
| `/api/agent` | POST | Chat agent IA |

---

## 🧪 Données de démo

Le seed crée automatiquement :
- 1 utilisateur : `demo@subsensei.com`
- 1 workspace : "Demo Workspace"
- 10 abonnements (Netflix, Shopify, GitHub, etc.)
- 7 alertes (renouvellements + essais)

**Pour réinitialiser :**
```bash
npx prisma db push --force-reset
npm run db:seed
```

---

## 🔧 Configuration avancée

### LLM Provider (optionnel)

**Pour activer l'IA avancée :**

```bash
# .env
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...
```

**Providers supportés :**
- `openai` (GPT-4, GPT-3.5)
- `gemini` (Gemini 1.5)
- `openrouter` (Claude, Llama, etc.)
- `deepseek` (DeepSeek Chat)

### Redis (optionnel)

**Pour les jobs et alertes automatiques :**

```bash
# Docker
docker run -d --name subsensei-redis -p 6379:6379 redis:7-alpine

# .env
REDIS_URL=redis://localhost:6379
```

### Storage S3 (optionnel)

**Pour l'upload de factures :**

```bash
# .env
S3_ENDPOINT=https://s3.eu-west-1.amazonaws.com
S3_BUCKET=subsensei-invoices
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=eu-west-1
```

---

## 🐳 Docker Compose

**Lancer tout l'environnement :**

```bash
docker-compose up -d

# Vérifier les logs
docker-compose logs -f web

# Arrêter
docker-compose down
```

**Services inclus :**
- `web` : Application Next.js (port 3000)
- `db` : PostgreSQL 15 (port 5432)
- `redis` : Redis 7 (port 6379)

---

## 📱 Utilisation

### 1. Dashboard

Visualisez en un coup d'œil :
- Total mensuel des abonnements
- Renouvellements à venir (< 14j)
- Alertes actives

### 2. Gérer les abonnements

**Créer :**
1. Cliquer sur "Nouvel abonnement"
2. Remplir le formulaire
3. Enregistrer

**Modifier :**
1. Cliquer sur "⋮" dans la table
2. Sélectionner "Éditer"
3. Modifier et enregistrer

**Actions rapides :**
- Snoozer 7j
- Marquer à annuler
- Ajouter facture

### 3. Chat Agent

**Ouvrir le chat :**
- Bouton flottant (bot) en bas à droite
- Ou page `/agent`

**Poser des questions :**
```
"Combien je dépense par mois ?"
"Liste mes abonnements Netflix"
"Quels essais se terminent bientôt ?"
```

---

## 🎯 Prochaines étapes

### Développement

1. **Authentification** : Implémenter NextAuth
2. **Multi-workspaces** : Support plusieurs espaces
3. **Jobs automatiques** : Alertes par email
4. **Export CSV** : Télécharger les données
5. **Upload factures** : Intégration S3
6. **Graphiques** : Visualisations coûts

### Production

1. **Déployer sur Dokploy** (voir `DEPLOYMENT.md`)
2. **Configurer le domaine**
3. **Activer SSL**
4. **Setup backups DB**
5. **Monitoring** (Sentry, LogRocket)

---

## 🐛 Problèmes courants

### Port 3000 occupé
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Erreur Prisma
```bash
npx prisma generate
npx prisma db push
```

### Base de données inaccessible
```bash
# Vérifier PostgreSQL
pg_isready -h localhost -p 5432

# Redémarrer
brew services restart postgresql@15
```

### Build échoue
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Documentation complète

- **README.md** : Vue d'ensemble + architecture
- **DEPLOYMENT.md** : Guide déploiement Dokploy
- **QUICKSTART.md** : Ce guide (démarrage rapide)

---

## 💡 Astuces

### Dark Mode
Cliquer sur l'icône 🌙/☀️ dans le header

### Filtres table
Utiliser la barre de recherche pour filtrer par service, owner, tags

### Raccourcis clavier
- `Ctrl+K` : Recherche globale (TODO)
- `Ctrl+/` : Ouvrir le chat agent (TODO)

### API Testing
```bash
# Liste abonnements
curl http://localhost:3000/api/subscriptions

# Créer abonnement
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"service_name":"Test","cost_amount":10,"billing_period":"monthly"}'

# Chat agent
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Quels sont mes renouvellements ?"}]}'
```

---

## 🎉 C'est parti !

Votre SubSensei est prêt. Profitez de la gestion intelligente de vos abonnements !

**Besoin d'aide ?**
- 📖 Lire la doc complète : `README.md`
- 🐛 Reporter un bug : GitHub Issues
- 💬 Discuter : GitHub Discussions

---

**Fait avec ❤️ par l'équipe SubSensei**
