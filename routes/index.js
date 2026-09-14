const router = require('express').Router();

// router.use('/', require('./swagger'))
router.get('/', (req, res)  => {res.send('hello world')});

router.use('/Frankapi', require('./events'));
router.use('/events', require('./events'));

module.exports = router;