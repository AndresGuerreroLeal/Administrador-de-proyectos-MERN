const jwt = require("jsonwebtoken");

const generarJWT = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.SECRETA,
    {
      expiresIn: "80d",
    }
  );
};

module.exports = generarJWT;
