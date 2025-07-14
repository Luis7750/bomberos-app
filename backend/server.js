const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Importar rutas
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const llamadoRoutes = require('./routes/llamadoRoutes');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/voluntarios', voluntarioRoutes);
app.use('/api/llamados', llamadoRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API está funcionando...');
  });
}

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
