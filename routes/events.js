const express = require('express');
const router = express.Router();

const eventControllers =  require('../controllers/events')

router.get('/', eventControllers.getAll);

router.get('/:id', eventControllers.getSingle);

router.post('/', eventControllers.createEvents)

router.put('/:id', eventControllers.updateEvents)

router.delete('/:id', eventControllers.deleteEvents)

module.exports = router;