const express = require('express');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

const router = express.Router();

const Comentarios = require('../models/comentarios')


//=================================
// Mostrar todas las categorias
//=================================
router.get('/comentario', (req, res) => {

  Comentarios.find({})
            .populate('user', '_id nombre apellidos img') //Muestra el object id del usuario (solo nombre y email)
            .exec((err, comments) => {
              if(err){
                return res.status(400).json({
                  ok: false,
                  err
                });   
             }
             Comentarios.count((err, count) => {

              if(err){
                return res.status(400).json({
                  ok: false,
                  err
                });   
             }
             
              res.json({
              ok:true,
              comments: comments,
              count: count
              });

          });
  });
})

//=================================
// Mostrar comentarios
//=================================
router.get('/comentario/:id', verificaToken,(req, res) => {
  
  //recoger id de los params
  let id = req.params.id

  Comentarios.findById(id,(err, comentarioDB) => {

        if(err){
            return res.status(500).json({
              ok: false,
              err 
        });
        }

        if(!comentarioDB){
          return res.status(400).json({
            ok: false,
            err: {
                message: 'EL ID no es correcto'
              }
          });
        }
      
        res.json({
          ok: true,
          comentario: comentarioDB
        });
          
    })
});

//=================================
// Crear nuevo comentario
//=================================

router.post('/comentario/:token', verificaToken, (req, res) => {

  let body = req.body

  //Crear un nuevo comentario
  let comentario = new Comentarios({
    comment: body.comment,
    title: body.title,
    user: req.usuario._id
  });

  // Grabar en la base de datos
  comentario.save((err, comentarioDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
        });
    }

    if(!comentarioDB){
        return res.status(400).json({
          ok: false,
          err
        });
    }

    res.json({
      ok:true,
      comentario: comentarioDB
    })
  });

  if (body.comment === undefined) {
    res.status(400).json({
      ok: false,
      message: "El comentario es necesario"
    });
  }
});


//=================================
// Actualizar descpricion y titulo del comentario
//=================================

router.put('/comentario/:id/:token', verificaToken, (req, res) => {
  //recoger id de los params
  let id = req.params.id
  let body = req.body

  let descComentario = {
    title: body.title,
    comment: body.comment
  }

  Comentarios.findByIdAndUpdate(id, descComentario, {new: true, runValidators: true}, (err, comentarioDB) => {

    if(err){
        return res.status(500).json({
          ok: false,
          err
    });
    }

    if(!comentarioDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }
  
    res.json({
      ok: true,
      comentario: comentarioDB
    });
      
  });
});

//=================================
// Eliminar un comentario
//=================================
router.delete('/comentario/:id/:token', verificaToken, (req, res) => {
  //solo un administrador puede borrar categorias
  let id = req.params.id;

  //Castegoria.findByidANdRemove
  Comentarios.findByIdAndRemove(id,(err, comentarioDB) => {

    if(err){
        return res.status(400).json({
          ok: false,
          err
    });
    }

    if(!comentarioDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }
  
    res.json({
      ok: true,
      comments: comentarioDB,
      message: 'Comentario borrado'
    });
      
  })
});


module.exports = router;