const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
    const user = req.user;
    const loginLink = `<a href="/auth/github">Login with GitHub</a>`;
    const logoutLink = `<a href="/auth/logout">Logout</a>`;

    if (user) {
        res.send(`Logged in as ${user.username} | ${logoutLink} | <a href="/api-docs">API Docs</a>`);
    } else {
        res.send(`Welcome! ${loginLink} | <a href="/api-docs">API Docs</a>`);
    }
});

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', (req, res) => {
    req.logout(() => {});
    req.session.destroy();
    res.redirect('/');
});

router.use('/events', require('./events'));
router.use('/organizers', require('./organizers'));

module.exports = router;