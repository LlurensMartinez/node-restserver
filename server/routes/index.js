const express = require('express');

const app = express();


// Importamos y usamos las rutas del usuario
app.use( require('./usuario'));
app.use( require('./login'));
app.use( require('./comentario'));
app.use( require('./producto'));
app.use( require('./upload'));
app.use( require('./imagenes'));

module.exports = app;