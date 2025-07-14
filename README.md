# Instrucciones para ejecutar la aplicación

## Requisitos previos
- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)

## Instalación

1. Clonar o descargar el repositorio

2. Instalar dependencias:
```
cd bomberos-app
npm install
```

3. Asegurarse de que MongoDB esté en ejecución en su sistema

4. Iniciar la aplicación:
```
npm run dev
```

Esto iniciará tanto el servidor backend (en el puerto 5000) como el frontend (utilizando live-server).

## Estructura del proyecto

```
bomberos-app/
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── api.js
│   └── index.html
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── voluntarioController.js
│   │   └── llamadoController.js
│   ├── models/
│   │   ├── Voluntario.js
│   │   └── Llamado.js
│   ├── routes/
│   │   ├── voluntarioRoutes.js
│   │   └── llamadoRoutes.js
│   └── server.js
└── package.json
```

## Uso de la aplicación

1. **Gestión de voluntarios**:
   - Añadir, editar o eliminar voluntarios usando los botones en la primera columna
   - Los voluntarios se ordenan automáticamente por cargo y nombre

2. **Registro de voluntarios en el lugar**:
   - Arrastrar voluntarios desde la primera columna a la segunda para registrar su llegada
   - Se registra automáticamente la hora de llegada

3. **Registro de voluntarios en el interior**:
   - Arrastrar voluntarios desde la segunda columna a la tercera para registrar su ingreso al interior
   - Se inicia automáticamente un cronómetro para cada voluntario
   - Alertas visuales a los 15 minutos (amarillo) y 20 minutos (rojo parpadeante)
   - Arrastrar de vuelta a la segunda columna para registrar la salida

4. **Cierre de llamado**:
   - Completar la información del llamado en el encabezado
   - Hacer clic en "Cerrar llamado" para guardar todos los datos
   - Se creará automáticamente un nuevo llamado

## Notas técnicas

- La aplicación utiliza MongoDB para almacenar los datos de voluntarios y llamados
- El frontend se comunica con el backend mediante una API RESTful
- La funcionalidad drag-and-drop está implementada con la API nativa de HTML5
- Los cronómetros y alertas visuales se gestionan mediante JavaScript
