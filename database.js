const { Pool } = require('pg');

// Connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize schema
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS prospects (
        id SERIAL PRIMARY KEY,
        nom_cabinet TEXT NOT NULL,
        contact_nom TEXT NOT NULL,
        contact_tel TEXT,
        contact_email TEXT,
        contact_linkedin TEXT,
        nb_clients_cabinet INTEGER,
        prix_discute INTEGER DEFAULT 0,
        stockage_go INTEGER,
        date_demo DATE NOT NULL,
        resume_demo TEXT,
        etape TEXT DEFAULT 'demo_faite',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS interactions (
        id SERIAL PRIMARY KEY,
        prospect_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        canal TEXT,
        contenu TEXT,
        resultat TEXT,
        FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_prospect_etape ON prospects(etape);
    `);
    console.log('✅ Schema initialized');
  } catch (err) {
    console.error('❌ Schema init error:', err.message);
  } finally {
    client.release();
  }
}

// Prospects
async function getProspects() {
  const result = await pool.query(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM interactions WHERE prospect_id = p.id) as nb_interactions
    FROM prospects p
    ORDER BY p.updated_at DESC
  `);
  return result.rows;
}

async function getProspectsByEtape(etape) {
  const result = await pool.query(
    'SELECT * FROM prospects WHERE etape = $1 ORDER BY updated_at DESC',
    [etape]
  );
  return result.rows;
}

async function getProspect(id) {
  const result = await pool.query('SELECT * FROM prospects WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createProspect(data) {
  const { nom_cabinet, contact_nom, contact_tel, contact_email, contact_linkedin,
          nb_clients_cabinet, prix_discute, stockage_go, date_demo, resume_demo, etape, notes } = data;
  
  const result = await pool.query(`
    INSERT INTO prospects (nom_cabinet, contact_nom, contact_tel, contact_email, contact_linkedin,
                          nb_clients_cabinet, prix_discute, stockage_go, date_demo, resume_demo, etape, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `, [nom_cabinet, contact_nom, contact_tel || null, contact_email || null, contact_linkedin || null,
      nb_clients_cabinet || null, prix_discute || 0, stockage_go || null, date_demo, resume_demo || null,
      etape || 'demo_faite', notes || null]);
  
  return result.rows[0];
}

async function updateProspect(id, data) {
  const { nom_cabinet, contact_nom, contact_tel, contact_email, contact_linkedin,
          nb_clients_cabinet, prix_discute, stockage_go, date_demo, resume_demo, etape, notes } = data;
  
  await pool.query(`
    UPDATE prospects 
    SET nom_cabinet = $1, contact_nom = $2, contact_tel = $3, contact_email = $4, contact_linkedin = $5,
        nb_clients_cabinet = $6, prix_discute = $7, stockage_go = $8, date_demo = $9, resume_demo = $10,
        etape = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
    WHERE id = $13
  `, [nom_cabinet, contact_nom, contact_tel || null, contact_email || null, contact_linkedin || null,
      nb_clients_cabinet || null, prix_discute || 0, stockage_go || null, date_demo, resume_demo || null,
      etape, notes || null, id]);
}

async function updateProspectEtape(id, etape) {
  await pool.query(
    'UPDATE prospects SET etape = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [etape, id]
  );
}

async function deleteProspect(id) {
  await pool.query('DELETE FROM prospects WHERE id = $1', [id]);
}

// Interactions
async function getInteractions(prospectId) {
  const result = await pool.query(
    'SELECT * FROM interactions WHERE prospect_id = $1 ORDER BY date DESC',
    [prospectId]
  );
  return result.rows;
}

async function createInteraction(data) {
  const { prospect_id, type, date, canal, contenu, resultat } = data;
  
  await pool.query(`
    INSERT INTO interactions (prospect_id, type, date, canal, contenu, resultat)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [prospect_id, type, date || new Date().toISOString(), canal || null, contenu || null, resultat || null]);
}

// Stats
async function getStats() {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN etape = 'demo_faite' THEN 1 ELSE 0 END) as demo_faite,
      SUM(CASE WHEN etape = 'relance_1' THEN 1 ELSE 0 END) as relance_1,
      SUM(CASE WHEN etape = 'relance_2' THEN 1 ELSE 0 END) as relance_2,
      SUM(CASE WHEN etape = 'relance_3' THEN 1 ELSE 0 END) as relance_3,
      SUM(CASE WHEN etape = 'relance_4' THEN 1 ELSE 0 END) as relance_4,
      SUM(CASE WHEN etape = 'relance_5' THEN 1 ELSE 0 END) as relance_5,
      SUM(CASE WHEN etape = 'signe' THEN 1 ELSE 0 END) as signe,
      SUM(CASE WHEN etape = 'perdu' THEN 1 ELSE 0 END) as perdu,
      SUM(CASE WHEN etape = 'signe' THEN prix_discute ELSE 0 END) as revenue_signe,
      SUM(CASE WHEN etape NOT IN ('perdu', 'signe') THEN prix_discute ELSE 0 END) as pipeline_actif
    FROM prospects
  `);
  return result.rows[0];
}

async function getPipelineValue() {
  const result = await pool.query(`
    SELECT 
      etape,
      COUNT(*) as count,
      SUM(prix_discute) as value
    FROM prospects
    WHERE etape NOT IN ('signe', 'perdu')
    GROUP BY etape
  `);
  return result.rows;
}

module.exports = {
  pool,
  initSchema,
  getProspects,
  getProspectsByEtape,
  getProspect,
  createProspect,
  updateProspect,
  updateProspectEtape,
  deleteProspect,
  getInteractions,
  createInteraction,
  getStats,
  getPipelineValue
};
