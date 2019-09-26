const express = require('express');

// npm install --save express-fileupload
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto')

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
        ok: false,
        err: {
          message: 'No se ha seleccionado ningún archivo'
        }
    });
  };

  // Valida tipo
  let tiposValidos = ['productos', 'usuarios'];
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos permitidos son ${tiposValidos.join(', ')}`,
      }
  })
  }

  // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length -1];
  
  // Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if( extensionesValidas.indexOf( extension ) < 0 ){
    return res.status(400).json({
        ok: false,
        err: {
          message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`,
          extRecibida: extension
        }
    })
  }

  // Cambair nombre al archiv0
  //jobojhoo-123.jpg
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
          ok: false,
          err
      });

    // La imagen esta cargada

    if(tipo === 'productos'){
      imagenProducto(id,res, nombreArchivo);
    }else{
      imagenUsuario(id,res, nombreArchivo);
    }
    
    

  })

});

imagenUsuario = (id, res, nombreArchivo) => {

  let cambiaNombre = {
    img: nombreArchivo
  }
  
  // Buscar por id la imagen vieja para despues actualizar por la nueva
  Usuario.findById(id, (err, usuarioDB) => {
    if (err){
      borraArchivo(usuarioDB.img, 'usuarios');

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB){
      borraArchivo(usuarioDB.img, 'usuarios');

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }
    
    borraArchivo(usuarioDB.img, 'usuarios');
      
  });

  Usuario.findByIdAndUpdate(id, cambiaNombre, {new: true}, (err, usuarioGuardado)=> {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!usuarioGuardado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioGuardado,
    })

  });
}


imagenProducto = (id, res, nombreArchivo) => {

  let cambiaNombre = {
    img: nombreArchivo
  }

  Producto.findById(id, (err, productoDB) => {
    if (err){
      borraArchivo(productoDB.img, 'productos');

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB){
      borraArchivo(productoDB.img, 'productos');

      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }
    
    borraArchivo(productoDB.img, 'productos');
      
  });

  Producto.findByIdAndUpdate(id, cambiaNombre, {new: true}, (err, productoGuardado)=> {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!productoGuardado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    res.json({
      ok: true,
      producto: productoGuardado,
    })

  });



}

borraArchivo = (nombreImagen, tipo) => {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    
  if(fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen);  
  }
}

module.exports = app;