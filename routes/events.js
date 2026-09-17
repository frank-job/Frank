const express = require('express');
const router = express.Router();

const eventControllers = require('../controllers/events');
const { requireAuth } = require('../middleware/auth');

router.get('/', eventControllers.getAll);

router.get('/:id', eventControllers.getSingle);

router.post('/', requireAuth, eventControllers.createEvents);

router.put('/:id', requireAuth, eventControllers.updateEvents);

router.delete('/:id', requireAuth, eventControllers.deleteEvents);

module.exports = router;