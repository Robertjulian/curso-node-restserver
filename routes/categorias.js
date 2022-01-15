const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const router = Router();


// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);


// Obtener una categoria por Id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
    obtenerCategoria);

// Crear una categoria - privado - cualquier usuario con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    validarCampos,
],
    crearCategoria);

// Actualiza una categoria - privado - cualquier usuario con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    validarCampos
],
    actualizarCategoria);

// Eliminar una categoria - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
    eliminarCategoria);

module.exports = router;