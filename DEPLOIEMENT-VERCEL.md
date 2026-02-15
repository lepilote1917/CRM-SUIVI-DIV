# 🚀 Déploiement Vercel + PostgreSQL

## ✅ Prérequis

1. Compte Vercel (gratuit) → https://vercel.com/signup
2. Compte GitHub (gratuit) → https://github.com/signup

---

## 📦 Étape 1 : Créer un Repo GitHub

### Option A : Via GitHub Desktop (plus simple)

1. Télécharge GitHub Desktop : https://desktop.github.com
2. Ouvre GitHub Desktop
3. Clic "Add" → "Add Existing Repository"
4. Sélectionne `/Users/gaspardbonnot/Desktop/DIV-CRM`
5. Clic "Create Repository"
6. Clic "Publish Repository"
   - Nom : `div-crm`
   - Description : "CRM DIV Protocol - Pipeline Conversion"
   - ❌ **Décocher "Keep this code private"** (ou laisser coché si tu veux privé)
7. Clic "Publish Repository"

### Option B : Via Terminal (rapide)

```bash
cd ~/Desktop/DIV-CRM

# Init git
git init
git add .
git commit -m "Initial commit - DIV CRM v2.0"

# Créer repo sur GitHub (nécessite GitHub CLI)
# Si pas installé : brew install gh
gh auth login
gh repo create div-crm --public --source=. --remote=origin --push
```

---

## 🔧 Étape 2 : Déployer sur Vercel

1. Va sur https://vercel.com/dashboard
2. Clic **"Add New..."** → **"Project"**
3. Clic **"Import Git Repository"**
4. Sélectionne ton repo `div-crm`
5. Clic **"Import"**
6. **Configure Project :**
   - Framework Preset : **Other**
   - Build Command : (laisser vide)
   - Output Directory : (laisser vide)
   - Install Command : `npm install`
7. Clic **"Deploy"**

⏳ **Attends 1-2 minutes** (déploiement en cours)

---

## 🗄️ Étape 3 : Créer la Base PostgreSQL

### Sur Vercel Dashboard :

1. Va dans ton projet (div-crm)
2. Onglet **"Storage"**
3. Clic **"Create Database"**
4. Choisis **"Postgres"**
5. Nom de la DB : `div-crm-db`
6. Région : **Washington, D.C., USA (iad1)** (ou la plus proche)
7. Clic **"Create"**

⏳ **Attends 30 secondes** (création DB)

### Connecter la DB au Projet :

1. Reste sur l'onglet **"Storage"**
2. Clic sur ta DB `div-crm-db`
3. Onglet **"Settings"**
4. Section **"Connect Project"**
5. Sélectionne ton projet `div-crm`
6. Clic **"Connect"**

✅ **La variable `POSTGRES_URL` est automatiquement ajoutée au projet**

---

## 🔄 Étape 4 : Redéployer (pour initialiser le schéma)

1. Retour sur **"Deployments"**
2. Clic sur le dernier déploiement
3. Menu **"..."** (3 points) → **"Redeploy"**
4. Clic **"Redeploy"**

⏳ **Attends 1-2 minutes**

✅ **Le schéma PostgreSQL est créé automatiquement au démarrage**

---

## 🎉 Étape 5 : Accéder au CRM

Ton CRM est maintenant en ligne !

**URL :** `https://div-crm.vercel.app` (ou l'URL donnée par Vercel)

---

## 👥 Partager avec l'Équipe Sales

**Partage simplement l'URL :** `https://div-crm.vercel.app`

Pas de login requis (pour l'instant). Tous les membres de l'équipe accèdent à la même base de données.

---

## 🔐 (Optionnel) Ajouter une Protection par Mot de Passe

Si tu veux protéger l'accès :

### Option 1 : Vercel Password Protection

1. Projet Vercel → **"Settings"**
2. **"Deployment Protection"**
3. Activer **"Password Protection"**
4. Définir un mot de passe
5. Partager le mot de passe avec l'équipe

### Option 2 : Custom Auth (plus complexe)

Je peux ajouter un système de login simple (user/password) si besoin.

---

## 📊 Vérifier que les Données Persistent

1. Ajoute un prospect de test sur `https://div-crm.vercel.app`
2. Ferme le navigateur
3. Rouvre l'URL → le prospect est toujours là ✅

---

## 🔄 Mettre à Jour le CRM

Quand je fais des modifications :

### Via GitHub Desktop :

1. Ouvre GitHub Desktop
2. Sélectionne le repo `div-crm`
3. Les changements apparaissent
4. Clic **"Commit to main"**
5. Clic **"Push origin"**

➡️ **Vercel redéploie automatiquement** (1-2 min)

### Via Terminal :

```bash
cd ~/Desktop/DIV-CRM
git add .
git commit -m "Update: ajout fonctionnalité X"
git push
```

---

## 🆘 Dépannage

### Erreur "Database connection failed"

1. Vercel Dashboard → Projet → **"Settings"** → **"Environment Variables"**
2. Vérifie que `POSTGRES_URL` existe
3. Si manquant : retour **"Storage"** → Reconnecter la DB

### Erreur 500 au démarrage

1. Vercel Dashboard → Projet → **"Deployments"**
2. Clic sur le déploiement
3. Onglet **"Functions"** → Voir les logs
4. Me partager l'erreur

### L'URL ne fonctionne pas

Attends 2-3 minutes après déploiement (propagation DNS).

---

## 📋 Récapitulatif

✅ Code migré vers PostgreSQL  
✅ Fichiers Vercel créés (vercel.json)  
✅ Guide de déploiement complet  

**Prochaines étapes (à faire maintenant) :**

1. Créer repo GitHub (option A ou B)
2. Déployer sur Vercel
3. Créer base Postgres
4. Connecter DB au projet
5. Redéployer
6. Partager l'URL avec l'équipe

**Temps estimé :** 10-15 minutes

---

**Besoin d'aide ?** Demande-moi de faire les étapes avec toi en direct.

🔒 **Let's deploy!**
