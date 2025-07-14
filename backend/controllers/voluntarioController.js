const Voluntario = require('../models/Voluntario');

// Obtener todos los voluntarios
exports.getVoluntarios = async (req, res) => {
  try {
    const voluntarios = await Voluntario.find().sort({ cargo: 1, nombre: 1 });
    res.json(voluntarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener voluntarios' });
  }
};

// Obtener un voluntario por ID
exports.getVoluntarioById = async (req, res) => {
  try {
    const voluntario = await Voluntario.findById(req.params.id);
    
    if (!voluntario) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    res.json(voluntario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el voluntario' });
  }
};

// Crear un nuevo voluntario
exports.createVoluntario = async (req, res) => {
  const { registro, cargo, nombre } = req.body;
  
  try {
    // Verificar si ya existe un voluntario con el mismo registro
    const voluntarioExistente = await Voluntario.findOne({ registro });
    
    if (voluntarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un voluntario con ese número de registro' });
    }
    
    const nuevoVoluntario = new Voluntario({
      registro,
      cargo,
      nombre
    });
    
    const voluntarioGuardado = await nuevoVoluntario.save();
    res.status(201).json(voluntarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el voluntario' });
  }
};

// Actualizar un voluntario
exports.updateVoluntario = async (req, res) => {
  const { registro, cargo, nombre } = req.body;
  
  try {
    // Verificar si existe otro voluntario con el mismo registro (excepto el actual)
    const voluntarioExistente = await Voluntario.findOne({ 
      registro, 
      _id: { $ne: req.params.id } 
    });
    
    if (voluntarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe otro voluntario con ese número de registro' });
    }
    
    const voluntario = await Voluntario.findById(req.params.id);
    
    if (!voluntario) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    voluntario.registro = registro;
    voluntario.cargo = cargo;
    voluntario.nombre = nombre;
    
    const voluntarioActualizado = await voluntario.save();
    res.json(voluntarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el voluntario' });
  }
};

// Eliminar un voluntario
exports.deleteVoluntario = async (req, res) => {
  try {
    const voluntario = await Voluntario.findById(req.params.id);
    
    if (!voluntario) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    await voluntario.remove();
    res.json({ mensaje: 'Voluntario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el voluntario' });
  }
};
