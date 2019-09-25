const express = require('express');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria')


//=================================
// Mostrar todas las categorias
//=================================
app.get('/categoria', verificaToken, (req, res) => {

  Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email') //Muestra el object id del usuario (solo nombre y email)
            .exec((err, categorias) => {
              if(err){
                return res.status(400).json({
                  ok: false,
                  err
                });   
             }

             Categoria.count((err, conteo) => {

              if(err){
                return res.status(400).json({
                  ok: false,
                  err
                });   
             }

              res.json({
              ok:true,
              catogrias: categorias,
              cuantos: conteo
              });

          });
  });
})

//=================================
// Mostrar una categoria
//=================================
app.get('/categoria/:id', verificaToken,(req, res) => {
  //recoger id de los params
  let id = req.params.id
  
  Categoria.findById(id,(err, categoriaDB) => {

        if(err){
            return res.status(500).json({
              ok: false,
              err 
        });
        }

        if(!categoriaDB){
          return res.status(400).json({
            ok: false,
            err: {
                message: 'EL ID no es correcto'
              }
          });
        }
      
        res.json({
          ok: true,
          categoria: categoriaDB
        });
          
    })
});

//=================================
// Crear nueva categoria
//=================================

app.post('/categoria', verificaToken, (req, res) => {

  let body = req.body

  //Crear una nueva categoria
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  // Grabar en la base de datos
  categoria.save((err, categoriaDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
        });
    }

    if(!categoriaDB){
        return res.status(400).json({
          ok: false,
          err
        });
    }

    res.json({
      ok:true,
      categoria: categoriaDB
    })
  });

  if (body.descripcion === undefined) {
    res.status(400).json({
      ok: false,
      message: "La descripcion es necesaria"
    });
  }
});


//=================================
// Actualizar descpricion de la categoria
//=================================

app.put('/categoria/:id', verificaToken, (req, res) => {
  //recoger id de los params
  let id = req.params.id
  let body = req.body

  let descCategoria = {
    descripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
    });
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }
  
    res.json({
      ok: true,
      categoria: categoriaDB
    });
      
  });
});

//=================================
// Eliminar una cateogria
//=================================
app.delete('/categoria/:id', [verificaToken,verificaAdmin_Role], (req, res) => {
  //solo un administrador puede borrar categorias
  let id = req.params.id;

  //Castegoria.findByidANdRemove
  Categoria.findByIdAndRemove(id,(err, categoriaDB) => {

    if(err){
        return res.status(400).json({
          ok: false,
          err
    });
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }
  
    res.json({
      ok: true,
      categoria: categoriaDB,
      message: 'Categoria borrada'
    });
      
  })
});


module.exports = app;