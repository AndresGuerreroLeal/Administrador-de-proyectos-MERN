import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";
import AuthContext from "../context/Auth/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const [alerta, setAlerta] = useState({});

  const { email, password } = usuario;

  const {setAuth} = useContext(AuthContext)

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      return setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
    }

    setAlerta({});
    try {
      const { data } = await clienteAxios.post(`/api/usuarios/login`, {
        email,
        password,
      });

      setAlerta({
        msg: data.msg,
        error: false,
      });

      localStorage.setItem("token",data.token)

      setAuth(data)

      setUsuario({
        email: "",
        password: "",
      });

      navigate("/proyectos");
      
    } catch (err) {
      setAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;


  return (
    <div className="flex flex-col justify-center ">
      <h1 className="text-sky-800 font-black text-6xl capitalize">
        Iniciar sesión
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form className="my-10 bg-white shadow rounded-md p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email de registro"
            id="email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Password de registro"
            id="password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-sky-800 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-900 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link to="/registrar" className="block text-center my-5 uppercase text-sm text-slate-500">
          ¿No tienes una cuenta regístrate?
        </Link>
      </nav>
    </div>
  );
};

export default Login;
