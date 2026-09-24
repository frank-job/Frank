const express = require('express');
const router = express.Router();

const organizerControllers = require('../controllers/organizers');

router.get('/', organizerControllers.getAll);
router.get('/:id', organizerControllers.getSingle);
router.post('/', organizerControllers.createOrganizers);
router.put('/:id', organizerControllers.updateOrganizers);
router.delete('/:id', organizerControllers.deleteOrganizers);

module.exports = router;
