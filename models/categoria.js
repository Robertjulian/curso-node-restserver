const { Schema, model } = require('mongoose');

const categoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }
});

categoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...categoria } = this.toObject();
    return categoria;
  }

module.exports = model('Categoria', categoriaSchema);