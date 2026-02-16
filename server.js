const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const { templates, remplirTemplate } = require('./templates');
const { checkPassword, SESSION_SECRET } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ===== AUTH ENDPOINTS (AVANT MIDDLEWARE) =====

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (checkPassword(password)) {
    const maxAge = 30 * 24 * 60 * 60; // 30 jours
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', `divcrm_auth=${SESSION_SECRET}; HttpOnly${secure}; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/auth/check', (req, res) => {
  const authCookie = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('divcrm_auth='))
    ?.split('=')[1];
  res.json({ authenticated: authCookie === SESSION_SECRET });
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'divcrm_auth=; HttpOnly; Path=/; Max-Age=0');
  res.json({ ok: true });
});

// Servir page de login AVANT middleware auth
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ===== MIDDLEWARE D'AUTHENTIFICATION =====

app.use((req, res, next) => {
  // Exclure assets statiques et auth API
  const isPublicAsset = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/i.test(req.path);
  const isAuthAPI = req.path.startsWith('/api/auth/');
  
  if (isPublicAsset || isAuthAPI) {
    return next();
  }
  
  // Vérifier cookie
  const authCookie = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('divcrm_auth='))
    ?.split('=')[1];

  if (authCookie === SESSION_SECRET) {
    return next();
  }

  // Non authentifié
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.redirect('/login.html');
});

// Servir fichiers statiques APRÈS auth
app.use(express.static('public'));

// Initialize DB schema
db.initSchema().catch(err => console.error('Init error:', err));

// ===== PROSPECTS =====

app.get('/api/prospects', async (req, res) => {
  try {
    const prospects = await db.getProspects();
    res.json(prospects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/prospects/by-etape/:etape', async (req, res) => {
  try {
    const prospects = await db.getProspectsByEtape(req.params.etape);
    res.json(prospects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/prospects/:id', async (req, res) => {
  try {
    const prospect = await db.getProspect(req.params.id);
    if (!prospect) return res.status(404).json({ error: 'Prospect non trouvé' });
    
    const interactions = await db.getInteractions(req.params.id);
    
    res.json({ prospect, interactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prospects', async (req, res) => {
  try {
    const result = await db.createProspect(req.body);
    res.json({ id: result.id, message: 'Prospect créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/prospects/:id', async (req, res) => {
  try {
    await db.updateProspect(req.params.id, req.body);
    res.json({ message: 'Prospect mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/prospects/:id/etape', async (req, res) => {
  try {
    const { etape } = req.body;
    await db.updateProspectEtape(req.params.id, etape);
    res.json({ message: 'Étape mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/prospects/:id', async (req, res) => {
  try {
    await db.deleteProspect(req.params.id);
    res.json({ message: 'Prospect supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== INTERACTIONS =====

app.post('/api/interactions', async (req, res) => {
  try {
    await db.createInteraction(req.body);
    res.json({ message: 'Interaction créée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TEMPLATES =====

app.get('/api/templates', (req, res) => {
  res.json(templates);
});

app.post('/api/templates/remplir', (req, res) => {
  try {
    const { templateKey, variables } = req.body;
    const filled = remplirTemplate(templateKey, variables);
    
    if (!filled) return res.status(404).json({ error: 'Template non trouvé' });
    
    res.json(filled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== STATS =====

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pipeline', async (req, res) => {
  try {
    const pipeline = await db.getPipelineValue();
    res.json(pipeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🔒 DIV CRM démarré sur http://localhost:${PORT}`);
  console.log(`📊 Base de données : PostgreSQL\n`);
});

module.exports = app;
