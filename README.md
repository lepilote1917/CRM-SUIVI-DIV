# 🔒 DIV CRM - Pipeline de Conversion (Démo → Client)

## ✨ Version 2.0 - Design Apple Glass

**CRM ultra-moderne avec interface glassmorphism et pipeline Kanban drag & drop.**

---

## 🚀 Démarrage (30 secondes)

### 1. Lancer le CRM
```bash
cd ~/Desktop/DIV-CRM
npm start
```

### 2. Ouvrir dans le navigateur
```
http://localhost:3000
```

**C'est tout.** Aucune configuration requise.

---

## 🎯 Focus Unique : Démo → Client Payant

**Ce CRM ne gère QUE la conversion post-démo.**

Pas de leads froids. Uniquement les prospects qui ont déjà eu une démo et que tu veux convertir en clients payants.

---

## 📋 Fonctionnalités

### ✅ Ajout Manuel de Prospects
Après chaque démo, tu ajoutes le prospect dans le CRM avec :

- **Nom cabinet**
- **Contact** (nom complet)
- **Téléphone**
- **Email**
- **LinkedIn**
- **Nombre de clients du cabinet** (pour segmentation)
- **Prix discuté** (€)
- **Stockage nécessaire** (Go)
- **Date de la démo**
- **Résumé de la démo** (besoins, objections, points clés)
- **Notes complémentaires**

### 📊 Pipeline Visuel Kanban (Drag & Drop)

**8 Étapes de Conversion :**

1. **Démo Faite** — Juste après la démo
2. **Relance 1** — Première relance (J+3 email)
3. **Relance 2** — Deuxième relance (J+7 LinkedIn)
4. **Relance 3** — Troisième relance (J+14 email + proposition)
5. **Relance 4** — Quatrième relance (J+21 appel tel)
6. **Relance 5** — Dernière relance (J+30 email)
7. **✅ Signé** — Client converti
8. **❌ Perdu** — Opportunité perdue

**Déplacer les prospects** : glisse-dépose les cartes entre colonnes.

### 📈 Dashboard Stats (Temps Réel)

- **Total Prospects** — Nombre total dans le pipeline
- **En Conversion** — Prospects actifs (hors Signé/Perdu)
- **Signés** — Clients convertis
- **Revenue Signé** — Chiffre d'affaires des clients signés (€)
- **Pipeline Actif** — Valeur totale du pipeline en cours (€)

### 📝 Templates de Relances Intégrés

5 templates pré-remplis (email, LinkedIn, appel) avec variables dynamiques :
- `[NOM_CABINET]`
- `[PRENOM]`
- `[DATE_DEMO]`
- `[PRIX_DISCUTE]`
- etc.

**Accès :** bouton "📝 Templates" en haut à droite.

---

## 🎨 Design Apple Glass

### Glassmorphism
- Arrière-plans semi-transparents
- Flou de fond (backdrop blur)
- Effets de verre dépoli
- Ombres douces
- Coins arrondis

### Interface Moderne
- Palette de couleurs gradient (violet → violet foncé)
- Typographie SF Pro Display
- Animations fluides
- Micro-interactions

### Responsive
- Grille adaptative
- Fonctionne sur écrans de toutes tailles

---

## 🔄 Workflow Recommandé

### **Après une démo client :**

1. **Ajouter le prospect** (bouton "+ Nouveau Prospect")
   - Remplir tous les champs obligatoires (cabinet, contact, prix, date démo)
   - Ajouter un résumé de démo détaillé
   - Le prospect apparaît dans la colonne "Démo Faite"

2. **Suivre les relances**
   - J+3 : déplacer vers "Relance 1" après envoi email
   - J+7 : déplacer vers "Relance 2" après message LinkedIn
   - J+14 : déplacer vers "Relance 3" après envoi proposition
   - J+21 : déplacer vers "Relance 4" après appel téléphonique
   - J+30 : déplacer vers "Relance 5" après dernière tentative

3. **Finaliser**
   - **Si signature** → glisser vers "✅ Signé"
   - **Si refus** → glisser vers "❌ Perdu"

4. **Consulter les stats**
   - Dashboard se met à jour automatiquement
   - Pipeline actif = somme des prix discutés (hors Signé/Perdu)
   - Revenue signé = somme des prix des clients signés

---

## 🗂️ Structure des Données

### Base de données : `div-crm.db` (SQLite)

**Table `prospects` :**
- `id` — Identifiant unique
- `nom_cabinet` — Nom du cabinet
- `contact_nom` — Nom du contact
- `contact_tel` — Téléphone
- `contact_email` — Email
- `contact_linkedin` — URL LinkedIn
- `nb_clients_cabinet` — Nombre de clients du cabinet
- `prix_discute` — Prix discuté (€)
- `stockage_go` — Stockage nécessaire (Go)
- `date_demo` — Date de la démo
- `resume_demo` — Résumé de la démo
- `etape` — Étape actuelle (demo_faite, relance_1, ..., signe, perdu)
- `notes` — Notes complémentaires
- `created_at` — Date de création
- `updated_at` — Dernière modification

**Table `interactions` :**
- Historique des échanges (email, appel, etc.)
- Lien avec `prospects` via `prospect_id`

---

## 💡 Conseils d'Utilisation

### ✅ Best Practices

1. **Ajouter les prospects immédiatement après la démo** (ne pas attendre)
2. **Remplir le résumé de démo en détail** (besoins, objections, points positifs)
3. **Déplacer les cartes régulièrement** selon l'avancement
4. **Utiliser les templates** pour gagner du temps (bouton Templates)
5. **Consulter la fiche détaillée** avant chaque relance (bouton "Détails")

### 🚨 À Ne Pas Oublier

- **Le CRM ne gère pas les leads froids** (seulement post-démo)
- **Déplacer manuellement** les prospects entre étapes (pas d'automatisation)
- **Prix discuté = estimation réaliste** pour stats fiables
- **Sauvegarder `div-crm.db` régulièrement** (backup manuel)

---

## 📊 Export des Données

### Voir tous les prospects
```bash
sqlite3 ~/Desktop/DIV-CRM/div-crm.db "SELECT * FROM prospects"
```

### Export CSV
```bash
sqlite3 ~/Desktop/DIV-CRM/div-crm.db ".mode csv" ".headers on" "SELECT * FROM prospects" > prospects.csv
```

### Stats par étape
```bash
sqlite3 ~/Desktop/DIV-CRM/div-crm.db "SELECT etape, COUNT(*), SUM(prix_discute) FROM prospects GROUP BY etape"
```

---

## 🛠️ Dépannage

### Le CRM ne démarre pas
```bash
cd ~/Desktop/DIV-CRM
npm install  # Réinstaller dépendances
npm start
```

### Réinitialiser la base de données
```bash
rm ~/Desktop/DIV-CRM/div-crm.db
npm start  # Recrée la DB vide
```

### Port 3000 déjà utilisé
Modifier `server.js` ligne 6 :
```javascript
const PORT = 3001;  // ou autre port
```

---

## 🔐 Sécurité & Backup

### Données 100% Locales
- Aucune connexion cloud
- Base SQLite fichier local
- Tourne sur `localhost:3000` uniquement

### Backup Recommandé
```bash
# Backup manuel
cp ~/Desktop/DIV-CRM/div-crm.db ~/Desktop/div-crm-backup-$(date +%Y%m%d).db

# Ou via Time Machine / iCloud / Dropbox
```

---

## 🎯 Objectifs de Conversion

**Mois 1 :**
- 20-30 démos faites
- 15-20 en relances actives
- 5-8 clients signés
- 200k€+ revenue signé

**Trimestre :**
- 80-100 démos
- 50+ relances actives
- 20-30 clients signés
- 800k€+ revenue signé

---

## 📞 Support

Créé par Jarvis pour DIV Protocol (CEO: Gaspard Bonnot)  
Date : 15 février 2026

**En cas de bug ou amélioration :**
Demander à Jarvis (OpenClaw) de modifier le CRM.

---

## 🚀 Prochaines Étapes

1. **Lancer le CRM** : `npm start`
2. **Ouvrir** : http://localhost:3000
3. **Ajouter ton premier prospect** (bouton "+ Nouveau Prospect")
4. **Tester le drag & drop** (glisser une carte entre colonnes)
5. **Consulter les templates** (bouton "📝 Templates")

**Let's convert ! 🔒**
