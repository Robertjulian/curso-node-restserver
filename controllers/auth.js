const bcryptjs = require('bcryptjs');
const { request, response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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


const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });
        if(!usuario) {
            // Crear el usuario
            const data = {
                nombre,
                correo,
                password : ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // validar el estado del usuario en la BD
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado, comuniquese con el administrador.'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }


}

module.exports = {
    login,
    googleSignIn
}