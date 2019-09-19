const express = require('express');

// Encriptado de contraseñas npm bcrypt
const bcrypt = require('bcrypt');

// Devuelve la copia del objeto ocultando los campos deseados npm underscore
const _=require('underscore');

// Importamos el modelo
const Usuario = require('../models/usuario')

const app = express();



app.get('/usuario', function (req, res) {
  
  // mandarlo por query /usuario?desde=10&limite=5
  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Usuario.find({estado: true}, 'nombre email role estado google img')
          .skip(desde) //saltarse los primeros 5
          .limit(limite) //mostrar los siguientes 5
          .exec((err, usuarios) => {
            if(err){
              return res.status(400).json({
                ok: false,
                err
              });
          }

          Usuario.count({estado: true}, (err, conteo) => {

              res.json({
              ok:true,
              usuarios: usuarios,
              cuantos: conteo
              });

          });

          
          }) // ejecutalo
});





app.post('/usuario', function (req, res) {

let body = req.body

//Crear un nuevo usuario
let usuario = new Usuario({
  nombre: body.nombre,
  email: body.email,
  password: bcrypt.hashSync(body.password, 10), //segundo arg numeros de veces de encriptado
  confirmPassword: bcrypt.hashSync(body.confirmPassword, 10),
  role: body.role
});


// Grabar en la base de datos
usuario.save((err, usuarioDB) => {

  if(err){
      return res.status(400).json({
        ok: false,
        err
      })
  }


  res.json({
    ok:true,
    usuario: usuarioDB
  })
});


if (body.nombre === undefined) {
  res.status(400).json({
    ok: false,
    message: "El nombre es necesario"
  });
}

});




app.put('/usuario/:id', function (req, res) {
  
  //recoger id de los params
  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'email', 'img','role', 'estado']);

  // primer parametro id segundo objeto a actualizar
  // luego las opciones: new para actualizar objeto y run Validators para aplicar las validaciones del modelo
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

      if(err){
          return res.status(400).json({
            ok: false,
            err
      })
      }
    
      res.json({
        ok: true,
        usuario: usuarioDB
      });
        
  })

  
});


app.delete('/usuario/:id', function (req, res) {
  
    let id = req.params.id;
    
    let cambiaEstado = {
      estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=> {

      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      };

      if (!usuarioBorrado){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado'
          }
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado
      })

    });





});


module.exports = app;