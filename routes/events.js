const express = require('express');
const router = express.Router();

const eventControllers = require('../controllers/events');
const { isAuthenticated } = require('../middleware/Authenticate');

router.get('/', eventControllers.getAll);
router.get('/:id', eventControllers.getSingle);

router.post('/', isAuthenticated, eventControllers.createEvents);
router.put('/:id', isAuthenticated, eventControllers.updateEvents);
router.delete('/:id', isAuthenticated, eventControllers.deleteEvents);

module.exports = router;