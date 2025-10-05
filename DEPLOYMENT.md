# 🚀 Déploiement SubSensei sur Dokploy

Guide complet pour déployer SubSensei sur Dokploy.

---

## 📋 Prérequis

- Serveur avec Dokploy installé
- Accès SSH au serveur
- Domaine configuré (optionnel mais recommandé)
- PostgreSQL accessible (peut être sur Dokploy)

---

## 🔧 Configuration Dokploy

### 1. Créer une nouvelle application

1. Connectez-vous à votre instance Dokploy
2. Cliquez sur **"New Application"**
3. Sélectionnez le type : **Docker**
4. Nom : `subsensei`

### 2. Connecter le repository Git

**Option A : Repository public**
```
Repository URL: https://github.com/votre-username/subsensei.git
Branch: main
```

**Option B : Repository privé**
1. Générez une clé SSH dans Dokploy
2. Ajoutez la clé publique à votre repository (GitHub/GitLab)
3. Configurez l'URL SSH

### 3. Configuration Build

**Build Command:**
```bash
npm ci && npx prisma generate && npm run build
```

**Start Command:**
```bash
npx prisma migrate deploy && npm start
```

**Port:** `3000`

**Dockerfile:** Utiliser le Dockerfile du projet (détecté automatiquement)

### 4. Variables d'environnement

Ajoutez ces variables dans Dokploy :

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://subsensei.votredomaine.com
TZ=Europe/Paris

# Database
DATABASE_URL=postgresql://user:password@host:5432/subsensei

# Redis (optionnel pour MVP)
REDIS_URL=redis://host:6379

# Auth
AUTH_SECRET=<générer avec: openssl rand -hex 32>
AUTH_PROVIDER_GOOGLE_ID=
AUTH_PROVIDER_GOOGLE_SECRET=

# LLM Provider (optionnel)
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...

# Storage S3 (optionnel)
S3_ENDPOINT=
S3_BUCKET=subsensei-invoices
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=eu-west-1
```

### 5. Base de données PostgreSQL

**Option A : PostgreSQL sur Dokploy**
1. Créer un service PostgreSQL dans Dokploy
2. Noter les credentials
3. Utiliser l'URL interne : `postgresql://user:pass@postgres-service:5432/subsensei`

**Option B : PostgreSQL externe**
1. Utiliser un service managé (AWS RDS, DigitalOcean, etc.)
2. Configurer le firewall pour autoriser Dokploy
3. Utiliser l'URL publique

### 6. Redis (Optionnel)

**Pour les jobs et alertes automatiques :**
1. Créer un service Redis dans Dokploy
2. Configurer `REDIS_URL=redis://redis-service:6379`

---

## 🔐 Génération des secrets

### AUTH_SECRET
```bash
openssl rand -hex 32
```

### Clé API OpenAI (optionnel)
1. Aller sur https://platform.openai.com/api-keys
2. Créer une nouvelle clé
3. Copier dans `OPENAI_API_KEY`

---

## 🗄️ Migrations de base de données

Les migrations sont automatiques au démarrage grâce à :
```bash
npx prisma migrate deploy
```

**Pour forcer une migration manuelle :**
```bash
# SSH dans le container
docker exec -it subsensei sh

# Lancer les migrations
npx prisma migrate deploy

# Seed (optionnel, uniquement première fois)
npm run db:seed
```

---

## 🌐 Configuration du domaine

### 1. DNS
Pointer votre domaine vers l'IP du serveur Dokploy :
```
Type: A
Name: subsensei (ou @)
Value: <IP_SERVEUR>
TTL: 3600
```

### 2. SSL/TLS
Dokploy gère automatiquement Let's Encrypt :
1. Dans les paramètres de l'app, activer **"Enable SSL"**
2. Entrer le domaine : `subsensei.votredomaine.com`
3. Dokploy génère le certificat automatiquement

---

## 📊 Monitoring et Logs

### Voir les logs en temps réel
```bash
# Dans Dokploy UI
Applications > subsensei > Logs

# Ou via SSH
docker logs -f subsensei --tail 100
```

### Métriques
Dokploy affiche automatiquement :
- CPU usage
- Memory usage
- Network I/O
- Disk usage

---

## 🔄 Déploiement continu (CI/CD)

### Webhook automatique

1. Dans Dokploy, copier l'URL du webhook
2. Dans GitHub/GitLab :
   - Settings > Webhooks
   - Coller l'URL
   - Événements : `push` sur `main`

**Résultat :** Chaque push sur `main` déclenche un redéploiement automatique.

---

## 🐛 Troubleshooting

### Erreur : "Can't reach database"
```bash
# Vérifier la connexion DB
docker exec -it subsensei sh
npx prisma db push --preview-feature

# Vérifier les variables
echo $DATABASE_URL
```

### Erreur : "Port already in use"
```bash
# Changer le port dans Dokploy
Port: 3001 (au lieu de 3000)

# Ou arrêter le service conflictuel
docker ps
docker stop <container_id>
```

### Build échoue
```bash
# Nettoyer le cache Docker
docker system prune -a

# Redéployer
```

### Migrations échouent
```bash
# Réinitialiser la DB (⚠️ PERTE DE DONNÉES)
docker exec -it postgres psql -U postgres
DROP DATABASE subsensei;
CREATE DATABASE subsensei;
\q

# Redéployer l'app
```

---

## 🔒 Sécurité Production

### Checklist

- [ ] `NODE_ENV=production`
- [ ] `AUTH_SECRET` généré aléatoirement
- [ ] Base de données avec mot de passe fort
- [ ] SSL/TLS activé
- [ ] Firewall configuré (ports 80, 443 uniquement)
- [ ] Backups automatiques de la DB
- [ ] Variables sensibles dans Dokploy (pas dans le code)
- [ ] Rate limiting activé (TODO: à implémenter)

### Backups PostgreSQL

**Script automatique (cron) :**
```bash
#!/bin/bash
# /root/backup-subsensei.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/subsensei"
mkdir -p $BACKUP_DIR

docker exec postgres pg_dump -U postgres subsensei > $BACKUP_DIR/subsensei_$DATE.sql

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

**Crontab :**
```bash
# Backup quotidien à 2h du matin
0 2 * * * /root/backup-subsensei.sh
```

---

## 📈 Scaling

### Vertical Scaling (augmenter les ressources)
Dans Dokploy :
- CPU : 2 cores → 4 cores
- RAM : 2GB → 4GB

### Horizontal Scaling (plusieurs instances)
```yaml
# docker-compose.yml
services:
  web:
    deploy:
      replicas: 3
    # ... reste de la config
```

Ajouter un load balancer (Nginx/Traefik) devant.

---

## 🎯 Checklist de déploiement

- [ ] Repository Git configuré
- [ ] Variables d'environnement ajoutées
- [ ] PostgreSQL créé et accessible
- [ ] `AUTH_SECRET` généré
- [ ] Domaine pointé vers le serveur
- [ ] SSL activé
- [ ] Premier déploiement réussi
- [ ] Migrations appliquées
- [ ] Seed exécuté (optionnel)
- [ ] Application accessible via HTTPS
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Webhook CI/CD configuré

---

## 📞 Support

En cas de problème :
1. Vérifier les logs : `docker logs subsensei`
2. Vérifier les variables : `docker exec subsensei env`
3. Tester la DB : `docker exec postgres pg_isready`
4. Consulter la doc Dokploy : https://dokploy.com/docs

---

**Déploiement réussi ? 🎉**

Votre SubSensei est maintenant en production !

Accédez à : https://subsensei.votredomaine.com
