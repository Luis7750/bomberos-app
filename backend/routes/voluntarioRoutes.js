const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');

// Rutas para voluntarios
router.get('/', voluntarioController.getVoluntarios);
router.get('/:id', voluntarioController.getVoluntarioById);
router.post('/', voluntarioController.createVoluntario);
router.put('/:id', voluntarioController.updateVoluntario);
router.delete('/:id', voluntarioController.deleteVoluntario);

module.exports = router;
