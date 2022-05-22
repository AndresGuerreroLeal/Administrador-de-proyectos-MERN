const router = require("express").Router();
const tareaController = require("../controllers/tareaController");
const Auth = require("../middleware/Auth");

router.post("/", Auth, tareaController.agregarTarea);

router.get("/:id", Auth, tareaController.obtenerTarea);
router.put("/:id", Auth, tareaController.actualizarTarea);
router.delete("/:id", Auth, tareaController.eliminarTarea);

router.post("/estado/:id", Auth, tareaController.cambiarEstado);

module.exports = router;
