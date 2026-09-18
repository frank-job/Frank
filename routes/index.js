const router = require('express').Router();

const ensureLoggedIn = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).send(`Hello world. Please log in with GitHub at <a href="/login">/login</a> to access the app.`);
};

router.get('/', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.send(`Hello world, ${req.user.username || 'GitHub user'}! You are logged in. <a href="/logout">Logout</a> | <a href="/api-docs">Swagger</a>`);
    }

    return res.send(`Hello world. Please log in with GitHub: <a href="/login">/login</a>`);
});

router.use('/events', ensureLoggedIn, require('./events'));

module.exports = router;
