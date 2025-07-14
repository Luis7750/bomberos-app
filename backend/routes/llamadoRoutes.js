const express = require('express');
const router = express.Router();
const llamadoController = require('../controllers/llamadoController');

// Rutas para llamados
router.get('/', llamadoController.getLlamados);
router.get('/:id', llamadoController.getLlamadoById);
router.post('/', llamadoController.createLlamado);
router.put('/:id', llamadoController.updateLlamado);
router.put('/:id/cerrar', llamadoController.cerrarLlamado);
router.post('/:id/asistencia', llamadoController.registrarAsistencia);
router.post('/:id/ingreso', llamadoController.registrarIngreso);
router.post('/:id/salida', llamadoController.registrarSalida);

module.exports = router;
