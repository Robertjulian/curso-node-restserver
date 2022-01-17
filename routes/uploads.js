const { Router } = require('express');
const { check } = require('express-validator');
const {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo, validarCampos } = require('../middlewares');
const router = Router();


router.post('/', [validarArchivo, validarCampos], cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
],
    actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
],
    mostrarImagen
);


module.exports = router;