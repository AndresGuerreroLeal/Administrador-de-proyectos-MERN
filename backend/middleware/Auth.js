const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const Auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const datos = await jwt.verify(token, process.env.SECRETA);

      req.usuario = await Usuario.findById(datos.id).select(
        "-password -token -createdAt -updateAt"
      );
   
    } catch (err) {
      console.log(err);
      return res.status(404).json({ msg: "Hubo un error" });
    }

    if (!token) {
      return res.status(401).json({ msg: "Token no válido" });
    }
  }
  next();
};

module.exports = Auth;
