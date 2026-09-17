const router = require('express').Router();

router.get('/', (req, res)  => {res.send('hello world')});

router.use('/auth', require('./auth'));
router.use('/events', require('./events'));

module.exports = router;
