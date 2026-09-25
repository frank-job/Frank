const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('Hello world. <a href="/api-docs">Swagger UI</a> | <a href="/events/api-docs">Events API docs</a> | <a href="/organizers/api-docs">Organizers API docs</a>');
});

router.use('/events', require('./events'));
router.use('/organizers', require('./organizers'));

router.get('/login', passport.authenticate('github'), (req, res) => {});
 
router.get('/logout', function(req, res, next) {
req.logout(function(err) {
if (err) { return next(err); }
res.redirect('/');
});
});
module.exports = router;
