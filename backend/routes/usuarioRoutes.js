const router = require("express").Router()
const usuarioController = require("../controllers/usuarioController")
const Auth = require("../middleware/Auth")

router.post("/",usuarioController.crearUsuario)
router.post("/login",usuarioController.autenticar)
router.get("/perfil",Auth,usuarioController.obtenerPerfil)


module.exports = router