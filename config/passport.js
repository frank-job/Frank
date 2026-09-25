const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

// Safe helper function to fetch collection
const getUserCollection = () => {
    const db = mongodb.getDatabase();
    if (!db) {
        throw new Error('Database not initialized yet.');
    }
    return db.collection('Frankapi');
};

const setupPassport = () => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.warn('GitHub OAuth environment variables missing. Passport setup skipped.');
        return;
    }

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://frank-5580.onrender.com/auth/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const users = getUserCollection();
            const existingUser = await users.findOne({ githubId: String(profile.id) });

            const safeUsername = profile.username || profile.displayName || 'github-user';
            const safeEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const safeAvatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

            if (existingUser) {
                const updatedUser = {
                    username: safeUsername,
                    email: safeEmail,
                    avatarUrl: safeAvatar,
                    lastLogin: new Date()
                };

                await users.updateOne(
                    { _id: existingUser._id },
                    { $set: updatedUser }
                );

                return done(null, { ...existingUser, ...updatedUser });
            }

            const newUser = {
                githubId: String(profile.id),
                username: safeUsername,
                email: safeEmail,
                avatarUrl: safeAvatar,
                provider: 'github',
                createdAt: new Date(),
                lastLogin: new Date()
            };

            const result = await users.insertOne(newUser);
            return done(null, { ...newUser, _id: result.insertedId });
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

module.exports = { setupPassport };