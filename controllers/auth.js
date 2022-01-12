const bcryptjs = require('bcryptjs');
const { request, response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario y/o password no son correctos - correo'
            });
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario y/o password no son correctos - estado'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario y/o password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: "POST - Login",
            usuario, token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Ocurrion un error, hable con el administrador"
        });
    }
}


module.exports = {
    login
}