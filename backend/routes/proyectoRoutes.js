const router = require("express").Router()
const proyectoController = require("../controllers/proyectoController")
const Auth = require("../middleware/Auth")

router.get("/",Auth,proyectoController.obtenerProyectos)
router.post("/",Auth,proyectoController.nuevoProyecto)

router.get("/:id",Auth,proyectoController.obtenerProyecto)
router.put("/:id",Auth,proyectoController.editarProyecto)
router.delete("/:id",Auth,proyectoController.eliminarProyecto)

router.post("/tareas/:id",Auth,proyectoController.obtenerTareas)

router.post("/colaboradores",Auth,proyectoController.buscarColaborador)
router.post("/colaboradores/:id",Auth,proyectoController.agregarColaborador)
router.post("/eliminar-colaboradores/:id",Auth,proyectoController.eliminarColaborador)

module.exports = router