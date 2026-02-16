const crypto = require('crypto');

// Mot de passe hashé SHA-256
const PASSWORD_HASH = crypto.createHash('sha256').update('0850151917').digest('hex');

// Secret de session (à mettre dans .env en production)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256')
  .update('div-crm-secret-' + PASSWORD_HASH)
  .digest('hex');

function checkPassword(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash === PASSWORD_HASH;
}

function requireAuth(req, res, next) {
  const authCookie = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('divcrm_auth='))
    ?.split('=')[1];

  if (authCookie === SESSION_SECRET) {
    return next();
  }

  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.redirect('/login.html');
}

module.exports = {
  checkPassword,
  requireAuth,
  SESSION_SECRET,
  PASSWORD_HASH
};
