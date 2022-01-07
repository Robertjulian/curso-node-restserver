const { Router } = require("express");
const router = Router();
const {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
  patchUsuarios,
} = require("../controllers/usuarios");

router.get("/", getUsuarios);

router.put("/:id", putUsuarios);

router.post("/", postUsuarios);

router.delete("/", deleteUsuarios);

router.patch("/", patchUsuarios);

module.exports = router;
