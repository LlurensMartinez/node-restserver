const express = require('express');

// Encriptado de contraseñas npm bcrypt
const bcrypt = require('bcrypt');

//Gerador de token NPM
const jwt = require('jsonwebtoken');

//Login con google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// Importamos el modelo
const Usuario = require('../models/usuario')

const router = express.Router();

router.post('/login', (req, res) => {

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

// Configuraciones de google

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  // retornamos los valores del usuario
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}



router.post('/google', async (req, res) => {

    // Recibimos el token
    let token = req.body.idtoken
    
    let googleUser = await verify(token)
        .catch(e=>{
          return res.status(403).json({
            ok:false,
            err: e
          });
        });

    // verificamons si en mi base de datos existe el correo
    Usuario.findOne ({email: googleUser.email}, (err, usuarioDB)=>{
      
      if(err){
        console.log('error 1')
        return res.status(500).json({
          ok: false,
          err
        });
      };

      if (usuarioDB) {
        
        // Si el email esta registrado pero no desde google
        if(usuarioDB.google === false ) {
          return res.status(400).json({
          ok:false,
          err: {
            message: 'Debe de usar su autentiación normal'
          }
        });
      
        }else{
              // Si el google del usuario es true reneovamos el token
              let token = jwt.sign({
                usuario: usuarioDB
              },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}); // Cadicidad 30 dias
              return res.json({
                ok:true,
                usuario: usuarioDB,
                token,
              });
            }
      } else {
        //Si el usuario no existe en nuestra base de datos creamos un nuevo usuario
        let usuario = new Usuario({
          nombre: googleUser.nombre,
          email: googleUser.email,
          img: googleUser.img,
          google: true,
          password: ':)',
          confirmPassword: ':)'
        })
        
        // Guardamos el usuario en la base de datos
        usuario.save((err, usuarioDB) => {
          if(err){
            console.log('error 2')
            return res.status(500).json({
              ok: false,
              err
            });
          }

          //genreamos nuevo token
          let token = jwt.sign({
            usuario: usuarioDB
          },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}); // Cadicidad 30 dias

          return res.json({
            ok:true,
            usuario: usuarioDB,
            token,
          });


        })
        
      }
    });
  })



module.exports = router;