const crypto = require('crypto');
const { tokenSecret } = require('../controllers/auth');

const requireAuth = (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Login required. Use Bearer <token>' });
        }

        const [payload, signature] = token.split('.');
        const expectedSignature = crypto.createHmac('sha256', tokenSecret())
            .update(payload)
            .digest('base64url');
        if (!signature || signature !== expectedSignature) {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }

        const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (user.expiresAt < Date.now()) {
            return res.status(401).json({ error: 'Authentication token has expired' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};

module.exports = { requireAuth };