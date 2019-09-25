const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');

//=================================
// Obtener productos
//=================================

app.get('/productos', verificaToken, (req,res)=> {
    // mandarlo por query /productos?desde=0&limite=5
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({})
            .skip(desde) //desde donde mostramos
            .limit(limite) //mostrar los siguientes 5
            .populate('usuario', 'nombre email') //Muestra el object id del usuario (solo nombre y email)
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
              if(err){
                return res.status(500).json({
                  ok: false,
                  err
                });   
             }

             Producto.count((err, conteo) => {

              if(err){
                return res.status(400).json({
                  ok: false,
                  err
                });   
             }

              res.json({
              ok:true,
              productos: productos,
              cuantos: conteo
              });

          });
  });


});

//=================================
// Obtener un producto por ID
//=================================

app.get('/productos/:id', verificaToken, (req,res)=> {
  // populate cargar usuario categoria

  //recoger id de los params
  let id = req.params.id
  
  Producto.findById(id,(err, productoDB) => {

        if(err){
            return res.status(500).json({
              ok: false,
              err 
        });
        }

        if(!productoDB){
          return res.status(400).json({
            ok: false,
            err: {
                message: 'EL ID no es correcto'
              }
          });
        }
      
        res.json({
          ok: true,
          producto: productoDB
        });
          
    })
    .populate('usuario', 'nombre email') //Muestra el object id del usuario (solo nombre y email)
    .populate('categoria', 'descripcion')

});
//=================================
// Buscar Producto
//=================================

app.get('/productos/buscar/:termino', verificaToken,(req,res)=>{
  
  let termino = req.params.termino;

  // Mandar expresion regular 'i' = insensible mayusculas y minusculas
  let regex = new RegExp(termino, 'i')


  Producto.find({nombre: regex})
          .populate('usuario', 'nombre email') 
          .populate('categoria', 'descripcion')
          .exec((err,productos)=>{

            if(err){
              return res.status(500).json({
                ok: false,
                err
              });
            }

            res.json({
              ok:true,
              productos
            })
          })

});


//=================================
// Crear un nuevo producto
//=================================

app.post('/productos', verificaToken, (req,res)=> {
  // grabar el usuario
  // grabar una categoria del listado
  let body = req.body

  //Crear una nueva categoria
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    disponible: body.disponible,
    usuario: req.usuario._id,
    categoria: body.categoria
  });

  // Grabar en la base de datos
  producto.save((err, productoDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
        });
    }

    if(!productoDB){
        return res.status(400).json({
          ok: false,
          err
        });
    }

    res.status(201).json({
      ok:true,
      producto: productoDB
    })
  });

});

//=================================
// Actualizar un producto
//=================================

app.put('/productos/:id', verificaToken, (req,res)=> {
  //recoger id de los params
  let id = req.params.id
  let body = req.body

  let producto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    disponible: body.disponible,
    categoria: body.categoria
  }

  Producto.findByIdAndUpdate(id, producto, {new: true, runValidators: true}, (err, productoDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
    });
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }
  
    res.json({
      ok: true,
      producto: productoDB
    });
      
  })
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion')

});

//=================================
// Borrar un producto
//=================================

app.delete('/productos/:id', verificaToken, (req,res)=> {
  // borrar un producto sin borrarlo de la base de datos
  let id = req.params.id;
    
    let cambiaDisponibilidad = {
      disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponibilidad, {new: true}, (err, usuarioBorrado)=> {

      if(err){
        return res.status(500).json({
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