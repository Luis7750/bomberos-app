const mongoose = require('mongoose');

const VoluntarioSchema = new mongoose.Schema({
  registro: {
    type: Number,
    required: true,
    unique: true
  },
  cargo: {
    type: String,
    default: ''
  },
  nombre: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voluntario', VoluntarioSchema);
