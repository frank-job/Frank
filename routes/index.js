const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('Hello world. <a href="/api-docs">Swagger UI</a> | <a href="/events/api-docs">Events API docs</a> | <a href="/organizers/api-docs">Organizers API docs</a>');
});

router.use('/events', require('./events'));
router.use('/organizers', require('./organizers'));

module.exports = router;
