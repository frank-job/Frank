const crypto = require('crypto');
const mongodb = require('../data/database');

const userCollection = () => mongodb.getDatabase().collection('Users');
const tokenSecret = () => process.env.AUTH_SECRET || 'development-secret-change-me';

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const passwordMatches = (password, storedPassword) => {
    const [salt, storedHash] = storedPassword.split(':');
    const calculatedHash = crypto.scryptSync(password, salt, 64);
    const expectedHash = Buffer.from(storedHash, 'hex');

    return expectedHash.length === calculatedHash.length
        && crypto.timingSafeEqual(calculatedHash, expectedHash);
};

const createToken = (user) => {
    const payload = Buffer.from(JSON.stringify({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000)
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', tokenSecret()).update(payload).digest('base64url');

    return `${payload}.${signature}`;
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body || {};
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = userCollection();
        if (await users.findOne({ email: normalizedEmail })) {
            return res.status(409).json({ error: 'A user with that email already exists' });
        }

        const user = {
            username: username.trim(),
            email: normalizedEmail,
            passwordHash: hashPassword(password),
            role: 'user',
            provider: 'local',
            createdAt: new Date(),
            lastLogin: new Date()
        };
        const result = await users.insertOne(user);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertedId,
            token: createToken({ ...user, _id: result.insertedId })
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to register user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const user = await userCollection().findOne({ email: email.trim().toLowerCase() });
        if (!user || !passwordMatches(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        await userCollection().updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        res.status(200).json({
            message: 'Login successful',
            token: createToken(user)
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to log in' });
    }
};

module.exports = { register, login, tokenSecret };