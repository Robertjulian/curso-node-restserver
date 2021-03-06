const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio'],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  const { _id, __v, password, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

module.exports = model('Usuario', usuarioSchema);
