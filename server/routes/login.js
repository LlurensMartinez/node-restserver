const express = require('express');

// Encriptado de contraseñas npm bcrypt
const bcrypt = require('bcrypt');

//Gerador de token NPM
const jwt = require('jsonwebtoken');

// Importamos el modelo
const Usuario = require('../models/usuario')

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    // buscas es email en la base de datos y sacas el usuarioDB completo
    Usuario.findOne({ email: body.email}, (err, usuarioDB)=>{

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if(!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario y/o contraseña incorrectos'
          }
        });
      }

      // Comprar contraseña con comntraseña base de datos
      if (!bcrypt.compareSync(body.password, usuarioDB.password)){

        return res.status(400).json({
          ok: false,
          err: {
            message: 'usuario y/o Contraseña incorrectos'
          }

        });
      }

      // Generar token de seguridad
      let token = jwt.sign({
        usuario: usuarioDB
      },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}); // expira en 30 dias

      res.json({
        ok:true,
        usuario: usuarioDB,
        token
      })



    });
  
});

module.exports = app;