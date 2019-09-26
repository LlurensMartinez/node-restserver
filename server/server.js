require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

const bodyParser = require('body-parser')

// create application/json parser
app.use(bodyParser.json())


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