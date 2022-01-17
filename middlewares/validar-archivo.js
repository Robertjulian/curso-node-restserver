const { response } = require("express");


const validarArchivo = async (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No se encontraron archivos en la petición.' });;
    }

    next();
};

module.exports = {
    validarArchivo
}