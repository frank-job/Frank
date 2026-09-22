const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('Hello world. <a href="/api-docs">Swagger UI</a> | <a href="/events/">Events</a>');
});

router.use('/events', require('./events'));

module.exports = router;
