const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/bomberos-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
