# ✅ Checklist Déploiement Mymoni sur VPS Contabo

## 🎯 Configuration Gemini

**API Key :** `AIzaSyBLaSLaib4SpnFvxkM31GxAUNsb0SUVeoc`  
**Modèle :** `gemini-2.5-flash` (Meilleur rapport performance/prix)  
**Capacités :**
- ✅ 1M tokens d'entrée
- ✅ 65K tokens de sortie
- ✅ Appel de fonction (parfait pour l'agent)
- ✅ Sorties structurées
- ✅ Raisonnement

---

## 📋 ÉTAPE 1 : Pousser sur GitHub

### Sur ton Mac :

```bash
cd /Users/NUMTEMA/Library/Mobile\ Documents/com~apple~CloudDocs/Numtema/JONH/subsensei

# Copier .env.example vers .env et configurer
cp .env.example .env
# Éditer .env avec tes valeurs locales

# Initialiser Git
git init
git add .
git commit -m "Initial commit - Mymoni v0.2 avec Gemini 2.5 Flash"
git branch -M main

# Ajouter le remote GitHub
git remote add origin https://github.com/Creativityliberty/Mymoni.git

# Pousser
git push -u origin main
```

**Si erreur d'authentification :**
1. Aller sur GitHub → Settings → Developer settings → Personal access tokens
2. Créer un token avec scope `repo`
3. Utiliser le token comme mot de passe

---

## 📋 ÉTAPE 2 : Connexion et préparation VPS

```bash
# Se connecter
ssh root@173.249.0.204

# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Installer Docker Compose
apt install -y docker-compose git

# Créer la structure
mkdir -p /opt/apps/mymoni
cd /opt/apps/mymoni
```

---

## 📋 ÉTAPE 3 : Configuration Docker

### Créer docker-compose.yml

```bash
cat > docker-compose.yml << 'DOCKERCOMPOSE'
version: '3.8'

services:
  app:
    image: node:20-alpine
    container_name: mymoni-app
    working_dir: /app
    command: sh -c "npm install && npx prisma generate && npx prisma db push && npm run db:seed && npm run build && npm start"
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://mymoni:mymoni_secure_2025@db:5432/mymoni
      - NEXT_PUBLIC_APP_URL=http://173.249.0.204
      - TZ=Europe/Paris
      - LLM_PROVIDER=gemini
      - LLM_MODEL=gemini-2.5-flash
      - GEMINI_API_KEY=AIzaSyBLaSLaib4SpnFvxkM31GxAUNsb0SUVeoc
    volumes:
      - ./app:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - mymoni-network

  db:
    image: postgres:15-alpine
    container_name: mymoni-db
    environment:
      - POSTGRES_DB=mymoni
      - POSTGRES_USER=mymoni
      - POSTGRES_PASSWORD=mymoni_secure_2025
      - TZ=Europe/Paris
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mymoni"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - mymoni-network

  nginx:
    image: nginx:alpine
    container_name: mymoni-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - mymoni-network

networks:
  mymoni-network:
    driver: bridge

volumes:
  postgres-data:
DOCKERCOMPOSE
```

### Créer nginx.conf

```bash
cat > nginx.conf << 'NGINXCONF'
server {
    listen 80;
    server_name 173.249.0.204;

    client_max_body_size 10M;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
NGINXCONF
```

---

## 📋 ÉTAPE 4 : Cloner le code

```bash
# Cloner depuis GitHub
git clone https://github.com/Creativityliberty/Mymoni.git app

# Vérifier
ls -la app/
```

---

## 📋 ÉTAPE 5 : Créer .env production

```bash
cat > app/.env << 'ENVPROD'
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://173.249.0.204
DATABASE_URL=postgresql://mymoni:mymoni_secure_2025@db:5432/mymoni
TZ=Europe/Paris

# LLM Gemini
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
GEMINI_API_KEY=AIzaSyBLaSLaib4SpnFvxkM31GxAUNsb0SUVeoc

# Auth (générer un nouveau secret)
AUTH_SECRET=$(openssl rand -hex 32)
ENVPROD

# Générer AUTH_SECRET
echo "AUTH_SECRET=$(openssl rand -hex 32)" >> app/.env
```

---

## 📋 ÉTAPE 6 : Lancer l'application

```bash
# Démarrer tous les conteneurs
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f app

# Attendre que tout soit prêt (peut prendre 2-3 minutes)
# Tu verras : "ready - started server on 0.0.0.0:3000"
```

---

## 📋 ÉTAPE 7 : Vérification

```bash
# Vérifier que tout tourne
docker-compose ps

# Devrait afficher :
# mymoni-app    Running
# mymoni-db     Running (healthy)
# mymoni-nginx  Running

# Tester l'accès
curl http://localhost:3000
curl http://173.249.0.204
```

---

## 📋 ÉTAPE 8 : Firewall

```bash
# Installer UFW
apt install -y ufw

# Autoriser SSH, HTTP
ufw allow 22/tcp
ufw allow 80/tcp

# Activer
ufw --force enable

# Vérifier
ufw status
```

---

## 🎯 Accès à l'application

**URL :** http://173.249.0.204

**Test de l'agent :**
1. Ouvrir http://173.249.0.204
2. Cliquer sur "Agent" dans la sidebar
3. Tester : "Quels sont mes renouvellements cette semaine ?"
4. L'agent devrait répondre avec Gemini 2.5 Flash !

---

## 🔄 Commandes utiles

```bash
# Voir les logs
docker-compose logs -f app

# Redémarrer l'app
docker-compose restart app

# Arrêter tout
docker-compose down

# Mettre à jour le code
cd /opt/apps/mymoni/app
git pull origin main
cd ..
docker-compose restart app

# Voir l'utilisation des ressources
docker stats

# Backup de la DB
docker exec mymoni-db pg_dump -U mymoni mymoni > backup_$(date +%Y%m%d).sql
```

---

## 🐛 Troubleshooting

### L'app ne démarre pas

```bash
# Voir les logs détaillés
docker-compose logs app

# Vérifier la DB
docker-compose logs db

# Redémarrer tout
docker-compose down
docker-compose up -d
```

### Erreur Gemini API

```bash
# Vérifier que la clé est bien configurée
docker exec mymoni-app env | grep GEMINI

# Tester l'API Gemini
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBLaSLaib4SpnFvxkM31GxAUNsb0SUVeoc" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Port 80 déjà utilisé

```bash
# Voir ce qui utilise le port 80
netstat -tulpn | grep :80

# Arrêter Apache si installé
systemctl stop apache2
systemctl disable apache2
```

---

## ✅ Checklist Finale

- [ ] Code poussé sur GitHub
- [ ] Connecté au VPS (ssh root@173.249.0.204)
- [ ] Docker installé
- [ ] Docker Compose installé
- [ ] Structure /opt/apps/mymoni créée
- [ ] docker-compose.yml créé
- [ ] nginx.conf créé
- [ ] Code cloné depuis GitHub
- [ ] .env production créé avec Gemini API
- [ ] docker-compose up -d lancé
- [ ] Conteneurs running (docker-compose ps)
- [ ] Firewall configuré
- [ ] App accessible sur http://173.249.0.204
- [ ] Agent fonctionne avec Gemini 2.5 Flash

---

## 🚀 Prochaines étapes (optionnel)

1. **Acheter un domaine** (~10€/an)
2. **Configurer SSL** avec Let's Encrypt
3. **Setup backups automatiques** de la DB
4. **Monitoring** avec Uptime Kuma

---

**Tout est prêt ! Suis les étapes dans l'ordre et ton Mymoni sera en ligne ! 🎉**
