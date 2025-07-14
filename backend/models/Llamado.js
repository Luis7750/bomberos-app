const mongoose = require('mongoose');

const ActividadInteriorSchema = new mongoose.Schema({
  voluntarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voluntario',
    required: true
  },
  horaIngreso: {
    type: Date,
    required: true
  },
  horaSalida: {
    type: Date,
    default: null
  },
  duracionSegundos: {
    type: Number,
    default: 0
  }
});

const AsistenciaSchema = new mongoose.Schema({
  voluntarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voluntario',
    required: true
  },
  horaLlegada: {
    type: Date,
    required: true
  },
  actividadesInterior: [ActividadInteriorSchema]
});

const LlamadoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  horaLlamada: {
    type: Date,
    required: true
  },
  oficialACargo: {
    type: String,
    required: true
  },
  fechaHoraCierre: {
    type: Date,
    default: null
  },
  asistencias: [AsistenciaSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Llamado', LlamadoSchema);
