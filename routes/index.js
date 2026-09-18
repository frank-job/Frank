const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send(`Hello world. Please log in with GitHub: <a href="/login">/login</a> | <a href="/api-docs">Swagger UI</a>`);
});

router.use('/events', require('./events'));

module.exports = router;
