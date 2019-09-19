const mongoose = require('mongoose');
//npm mongoose-unqie-validator
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
}


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
  nombre: {
      type: String,
      required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Hay que confirmar la contraseña']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

// no imprimir contraseña
usuarioSchema.methods.toJSON = function() {

  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

// validar y lanzar mensaje
usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe de ser único'})


module.exports = mongoose.model('Usuario', usuarioSchema);