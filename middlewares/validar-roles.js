const { response } = require("express");
const role = require("../models/role");


const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'No se pudo acceder al token del usuario al momento de validar el rol'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario ${nombre} no es administrador - Imposible ejecutar esta accion.`
        });
    }

    next();
};

const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'No se pudo acceder al token del usuario al momento de validar el rol'
            });
        }

        const { rol, nombre } = req.usuario;

        if(!roles.includes(rol)) {
            return res.status(401).json({
                msg: `La accion que esta ejecutando require de estos roles: ${roles}`
            }); 
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}