const Llamado = require('../models/Llamado');
const Voluntario = require('../models/Voluntario');

// Obtener todos los llamados
exports.getLlamados = async (req, res) => {
  try {
    const llamados = await Llamado.find().sort({ createdAt: -1 });
    res.json(llamados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener llamados' });
  }
};

// Obtener un llamado por ID
exports.getLlamadoById = async (req, res) => {
  try {
    const llamado = await Llamado.findById(req.params.id)
      .populate({
        path: 'asistencias.voluntarioId',
        select: 'registro cargo nombre'
      });
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    res.json(llamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el llamado' });
  }
};

// Crear un nuevo llamado
exports.createLlamado = async (req, res) => {
  const { codigo, tipo, direccion, horaLlamada, oficialACargo } = req.body;
  
  try {
    const nuevoLlamado = new Llamado({
      codigo,
      tipo,
      direccion,
      horaLlamada,
      oficialACargo,
      asistencias: []
    });
    
    const llamadoGuardado = await nuevoLlamado.save();
    res.status(201).json(llamadoGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el llamado' });
  }
};

// Actualizar un llamado
exports.updateLlamado = async (req, res) => {
  const { codigo, tipo, direccion, horaLlamada, oficialACargo } = req.body;
  
  try {
    const llamado = await Llamado.findById(req.params.id);
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    // Actualizar campos básicos
    llamado.codigo = codigo;
    llamado.tipo = tipo;
    llamado.direccion = direccion;
    llamado.horaLlamada = horaLlamada;
    llamado.oficialACargo = oficialACargo;
    
    const llamadoActualizado = await llamado.save();
    res.json(llamadoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el llamado' });
  }
};

// Cerrar un llamado
exports.cerrarLlamado = async (req, res) => {
  try {
    const llamado = await Llamado.findById(req.params.id);
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    // Verificar que el llamado no esté ya cerrado
    if (llamado.fechaHoraCierre) {
      return res.status(400).json({ mensaje: 'El llamado ya está cerrado' });
    }
    
    llamado.fechaHoraCierre = new Date();
    
    const llamadoActualizado = await llamado.save();
    res.json(llamadoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cerrar el llamado' });
  }
};

// Registrar asistencia de voluntario
exports.registrarAsistencia = async (req, res) => {
  const { voluntarioId, horaLlegada } = req.body;
  
  try {
    const llamado = await Llamado.findById(req.params.id);
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    // Verificar que el voluntario existe
    const voluntario = await Voluntario.findById(voluntarioId);
    if (!voluntario) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    // Verificar que el voluntario no esté ya registrado en este llamado
    const asistenciaExistente = llamado.asistencias.find(
      a => a.voluntarioId.toString() === voluntarioId
    );
    
    if (asistenciaExistente) {
      return res.status(400).json({ mensaje: 'El voluntario ya está registrado en este llamado' });
    }
    
    // Agregar asistencia
    llamado.asistencias.push({
      voluntarioId,
      horaLlegada: horaLlegada || new Date(),
      actividadesInterior: []
    });
    
    const llamadoActualizado = await llamado.save();
    res.json(llamadoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar asistencia' });
  }
};

// Registrar ingreso al interior
exports.registrarIngreso = async (req, res) => {
  const { voluntarioId, horaIngreso } = req.body;
  
  try {
    const llamado = await Llamado.findById(req.params.id);
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    // Buscar la asistencia del voluntario
    const asistenciaIndex = llamado.asistencias.findIndex(
      a => a.voluntarioId.toString() === voluntarioId
    );
    
    if (asistenciaIndex === -1) {
      return res.status(404).json({ mensaje: 'El voluntario no está registrado en este llamado' });
    }
    
    // Agregar actividad de interior
    llamado.asistencias[asistenciaIndex].actividadesInterior.push({
      voluntarioId,
      horaIngreso: horaIngreso || new Date(),
      horaSalida: null,
      duracionSegundos: 0
    });
    
    const llamadoActualizado = await llamado.save();
    res.json(llamadoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar ingreso al interior' });
  }
};

// Registrar salida del interior
exports.registrarSalida = async (req, res) => {
  const { voluntarioId, horaSalida } = req.body;
  
  try {
    const llamado = await Llamado.findById(req.params.id);
    
    if (!llamado) {
      return res.status(404).json({ mensaje: 'Llamado no encontrado' });
    }
    
    // Buscar la asistencia del voluntario
    const asistenciaIndex = llamado.asistencias.findIndex(
      a => a.voluntarioId.toString() === voluntarioId
    );
    
    if (asistenciaIndex === -1) {
      return res.status(404).json({ mensaje: 'El voluntario no está registrado en este llamado' });
    }
    
    // Buscar la última actividad de interior sin hora de salida
    const actividadesInterior = llamado.asistencias[asistenciaIndex].actividadesInterior;
    const actividadIndex = actividadesInterior.findIndex(
      a => a.horaSalida === null
    );
    
    if (actividadIndex === -1) {
      return res.status(404).json({ mensaje: 'No hay registro de ingreso sin salida para este voluntario' });
    }
    
    // Registrar salida y calcular duración
    const salidaTime = horaSalida || new Date();
    const ingresoTime = new Date(actividadesInterior[actividadIndex].horaIngreso);
    const duracionMs = salidaTime - ingresoTime;
    const duracionSegundos = Math.floor(duracionMs / 1000);
    
    actividadesInterior[actividadIndex].horaSalida = salidaTime;
    actividadesInterior[actividadIndex].duracionSegundos = duracionSegundos;
    
    const llamadoActualizado = await llamado.save();
    res.json(llamadoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar salida del interior' });
  }
};
