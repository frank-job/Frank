const express = require('express');
const router = express.Router();

const organizerControllers = require('../controllers/organizers');
const { isAuthenticated } = require('../middleware/Authenticate');

router.get('/', organizerControllers.getAll);
router.get('/:id', organizerControllers.getSingle);

router.post('/', isAuthenticated, organizerControllers.createOrganizers);
router.put('/:id', isAuthenticated, organizerControllers.updateOrganizers);
router.delete('/:id', isAuthenticated, organizerControllers.deleteOrganizers);

module.exports = router;
