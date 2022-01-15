const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole, tieneRol } = require('../middlewares');
const {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
  patchUsuarios,
} = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', getUsuarios);

router.put('/:id',
  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
  ],
  putUsuarios
);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio, minimo 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo', 'El correo no es valido').custom(emailExiste),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  postUsuarios
);

router.delete('/:id',
  [
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
  ],
  deleteUsuarios
);

module.exports = router;
