//Gerador de token NPM
const jwt = require('jsonwebtoken');

//====================================
// Verificar Token
//====================================

let verificaToken = (req, res, next) => {

    let token= req.params.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => { //SEED  de autentication
      
      if(err){
        return res.status(401).json({
          ok: false,
          err: {
            name: "JsonWebTokenError",
            message: "invalid Token"
          }
        })
      }

      req.usuario = decoded.usuario;

      next();
    });

    
};

//====================================
// Verificar Token
//====================================

let verificaAdmin_Role = (req, res, next) => {

  let usuario = req.usuario
  

  if( usuario.role === 'ADMIN_ROLE') {
      next();
    
  }else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    })
  }

};

//====================================
// Verificar Token para imagen
//====================================

let verificaTokenImg = (req, res, next) =>{

  let token= req.query.token

  jwt.verify(token, process.env.SEED, (err, decoded) => { //SEED  de autentication
      
    if(err){
      return res.status(401).json({
        ok: false,
        err: {
          name: "JsonWebTokenError",
          message: "invalid Token"
        }
      })
    }

    req.usuario = decoded.usuario;

    next();
  });


}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}