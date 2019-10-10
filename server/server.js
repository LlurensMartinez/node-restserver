require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

const cors = require('cors');

const bodyParser = require('body-parser')

// create application/json parser
app.use(bodyParser.json())

//Habilitar cors
app.use(cors({
  credentials: true,
  origin: ['http://localhost:8080']
}));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// habilitar la carpeta public del frontend
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.resolve(__dirname, '../public')));



// Configuracion global de rutas
app.use(require('./routes/index'));





// Conexion Mongoose con localhost y la base de datos
mongoose.connect(process.env.URLDB,
                {useNewUrlParser: true, useCreateIndex:true}, 
                (err, res) =>{

  if (err) throw err;

  console.log('Base de datos ONLINE');
})



app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    const statusError = err.status || '500' 
    res.status(statusError).json(err);
  }
});