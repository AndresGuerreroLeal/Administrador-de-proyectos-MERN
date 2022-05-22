const Usuario = require("../models/Usuario");
const generarJWT = require("../helpers/generarJWT")

exports.crearUsuario = async (req, res) => {
  const { email } = req.body;
  let usuario = await Usuario.findOne({ email });

  if (usuario) {
    return res.status(400).json({ msg: "El usuario ya esta registrado" });
  }

  try {
    usuario = await new Usuario(req.body);

    await usuario.save();


      
    res.json(usuario);
  } catch (err) {
    console.log(err);
  }
};

exports.autenticar = async (req, res) => {
  const { email,password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(403).json({ msg: "Credenciales invalidas" });
    }

    if (await usuario.comprobarPassword(password)) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token:generarJWT(usuario._id)
      });
    } else {
      return res.status(403).json({ msg: "Credenciales invalidas" });
    }
  } catch (err) {
    console.log(err);
  }
};


exports.obtenerPerfil = (req,res)=>{
  const {usuario} = req

  res.json(usuario)

}