# SubSensei 🎯

**Gestion intelligente d'abonnements avec Agent IA**

Application Next.js 14 (App Router) pour gérer vos abonnements SaaS avec un agent conversationnel, alertes automatiques, et tableaux de bord.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
# ou
pnpm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et configurer :

```bash
cp .env.example .env
```

**Variables essentielles :**
- `DATABASE_URL` : PostgreSQL connection string
- `REDIS_URL` : Redis pour les jobs (optionnel pour MVP)
- `OPENAI_API_KEY` : Pour l'agent IA (optionnel, fallback regex)

### 3. Base de données

```bash
# Créer les tables
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Seed avec données de démo
npm run db:seed
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
subsensei/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Routes protégées
│   │   ├── layout.tsx        # Shell (sidebar + topbar)
│   │   ├── page.tsx          # Dashboard KPIs
│   │   └── subscriptions/    # Gestion abonnements
│   ├── api/                  # API Routes
│   │   └── agent/            # Endpoint agent IA
│   └── globals.css           # Styles globaux
│
├── features/                 # Modules UI
│   └── subscriptions/
│       ├── table/            # Table shadcn + TanStack
│       └── forms/            # Formulaires + validation zod
│
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── sidebar.tsx           # Navigation principale
│   ├── theme-toggle.tsx      # Dark/Light mode
│   └── chat/
│       └── chat-dock.tsx     # Chat agent flottant
│
├── agent/                    # Cerveau applicatif
│   ├── actions/
│   │   ├── types.ts          # Types d'actions
│   │   └── registry.ts       # Registre actions + handlers
│   └── intent/
│       └── detect.ts         # Détection d'intentions
│
├── server/                   # Services backend
│   ├── services/             # Logique métier
│   └── utils/                # Helpers (dates, logs)
│
├── prisma/
│   ├── schema.prisma         # Schéma DB
│   └── seed.ts               # Données de démo
│
└── lib/
    ├── db.ts                 # Prisma client
    └── utils.ts              # Helpers UI
```

---

## 🎨 Stack technique

### Frontend
- **Next.js 14** (App Router, Server Components)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Table** (tableaux avancés)
- **date-fns** (manipulation dates)
- **Lucide React** (icônes)

### Backend
- **Next.js API Routes**
- **Prisma** + **PostgreSQL**
- **Zod** (validation)
- **Redis** (jobs, optionnel)

### Agent IA
- **Intent detection** (regex MVP, évolutif vers LLM)
- **Actions registry** (typées, RBAC)
- **Multi-providers** (OpenAI, Gemini, OpenRouter, DeepSeek)

---

## 🧠 Agent - Actions disponibles

| Action | Description | Rôles requis |
|--------|-------------|--------------|
| `listRenewals` | Liste les renouvellements dans une période | viewer+ |
| `markToCancel` | Marque un abonnement "à annuler" | editor+ |
| `snoozeAlert` | Reporte une alerte de X jours | editor+ |
| `createSubscription` | Crée un nouvel abonnement | editor+ |

**Exemples de requêtes :**
- "Quels sont mes renouvellements cette semaine ?"
- "Marque Netflix à annuler"
- "Repousse l'alerte de 7 jours"

---

## 📊 Fonctionnalités

### ✅ MVP (Implémenté)
- [x] Dashboard avec KPIs (total mensuel, alertes, renouvellements)
- [x] Table abonnements (tri, filtres, pagination)
- [x] Agent conversationnel (chat dock)
- [x] Actions : listRenewals, markToCancel, snoozeAlert
- [x] Dark/Light mode
- [x] Sidebar navigation
- [x] Seed données de démo

### 🚧 En cours
- [ ] Formulaire création/édition abonnement
- [ ] Upload factures (S3)
- [ ] Export CSV
- [ ] Alertes automatiques (cron jobs)
- [ ] Page alertes
- [ ] Page factures
- [ ] Authentification (NextAuth)

### 🔮 Roadmap
- [ ] Multi-workspaces
- [ ] RBAC complet (admin/editor/viewer)
- [ ] Détection d'intentions par LLM
- [ ] Graphiques coûts (Chart.js)
- [ ] Notifications email
- [ ] API webhooks
- [ ] Import CSV
- [ ] Tests E2E (Playwright)

---

## 🗄️ Schéma de données

### Modèles principaux

**User** : Utilisateurs de l'app
**Workspace** : Espaces de travail (multi-tenant)
**Member** : Liaison User ↔ Workspace (avec rôle)
**Subscription** : Abonnements SaaS
**Invoice** : Factures attachées
**Alert** : Alertes (renouvellement, essai, spike)
**Event** : Audit log (actions utilisateur)

### Enums

- **Role** : ADMIN, EDITOR, VIEWER
- **SubStatus** : ACTIVE, WATCH, TO_CANCEL
- **BillingPeriod** : MONTHLY, ANNUAL, CUSTOM
- **AlertType** : RENEWAL, TRIAL, SPIKE, CARD_EXPIRY
- **Severity** : INFO, WARNING, CRITICAL

---

## 🔧 Scripts NPM

```bash
# Développement
npm run dev              # Lance Next.js dev server
npm run build            # Build production
npm run start            # Lance production build

# Base de données
npm run db:push          # Sync schema → DB (dev)
npm run db:migrate       # Créer migration (prod)
npm run db:seed          # Seed données de démo

# Qualité
npm run lint             # ESLint
npm run format           # Prettier
npm run test             # Vitest (unit tests)
npm run test:e2e         # Playwright (E2E)

# Jobs
npm run worker           # Lance les jobs schedulés
```

---

## 🐳 Docker (Production)

### docker-compose.yml

```yaml
version: "3.9"
services:
  web:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db, redis]
    command: sh -c "npx prisma migrate deploy && npm start"
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: subsensei
    volumes: ["pgdata:/var/lib/postgresql/data"]
  
  redis:
    image: redis:7
    volumes: ["redisdata:/data"]

volumes:
  pgdata:
  redisdata:
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🚀 Déploiement Dokploy

### 1. Prérequis
- Serveur avec Dokploy installé
- PostgreSQL accessible
- (Optionnel) Redis pour jobs

### 2. Configuration

Dans Dokploy :
1. **Créer une nouvelle app** (type: Docker)
2. **Connecter le repo Git**
3. **Variables d'environnement** :
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/subsensei
   REDIS_URL=redis://host:6379
   OPENAI_API_KEY=sk-...
   AUTH_SECRET=<générer avec openssl rand -hex 32>
   ```
4. **Build settings** :
   - Build command: `npm run build`
   - Start command: `npm start`
5. **Port** : 3000

### 3. Migrations

Ajouter un **pre-deploy hook** :
```bash
npx prisma migrate deploy
```

### 4. Domaine

Configurer le domaine personnalisé dans Dokploy (ex: `subsensei.votredomaine.com`)

---

## 🔐 Sécurité

- ✅ Validation Zod sur toutes les entrées
- ✅ RBAC par workspace (admin/editor/viewer)
- ✅ Audit log (Event model)
- ✅ Pas de stockage CB (uniquement hint)
- ✅ Timezone verrouillée (Europe/Paris)
- ⚠️ TODO: Rate limiting API
- ⚠️ TODO: CSRF protection
- ⚠️ TODO: Authentification (NextAuth)

---

## 📝 Conventions de code

### Commits
Format conventionnel :
```
feat(subscriptions): add CSV export
fix(agent): handle empty intent
docs(readme): update deployment section
```

### Composants
- **Server Components** par défaut
- **"use client"** uniquement si nécessaire (interactivité)
- **Types explicites** (pas de `any`)

### Styling
- **Tailwind classes** (pas de CSS custom sauf globals)
- **shadcn/ui** pour composants réutilisables
- **cn()** helper pour merge classes

---

## 🐛 Troubleshooting

### Erreur Prisma "Can't reach database"
```bash
# Vérifier que PostgreSQL tourne
pg_isready -h localhost -p 5432

# Recréer la DB
npx prisma db push --force-reset
npm run db:seed
```

### Port 3000 déjà utilisé
```bash
# Trouver le process
lsof -ti:3000

# Tuer le process
kill -9 $(lsof -ti:3000)
```

### Build Next.js échoue
```bash
# Nettoyer le cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Table](https://tanstack.com/table)
- [Dokploy](https://dokploy.com/docs)

---

## 📄 Licence

MIT

---

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

---

**Fait avec ❤️ par l'équipe SubSensei**
