const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const router = Router();

// Obtener todas las productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por Id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],
    obtenerProducto);

// Crear un producto - privado - cualquier usuario con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('categoria', 'No es un id valido - categoria').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
],
    crearProducto);

// Actualizar un producto - privado - cualquier usuario con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido - categoria').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
],
    actualizarProducto);

// Eliminar un producto - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],
    eliminarProducto);


module.exports = router;