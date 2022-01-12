const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No se encontro un token en la peticion.'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        // validar si encontro un usuario con el token
        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no encontrado.'
            });
        }

        // Verificar si el usuario no esta eliminado
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado eliminado.'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no pudo ser validado.'
        });
    }

};

module.exports = {
    validarJWT
}