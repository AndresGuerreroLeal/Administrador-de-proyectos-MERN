import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import axios from "axios";
import clienteAxios from "../config/axios";

const Registrar = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    passwordconf: "",
  });

  const [alerta, setAlerta] = useState({});

  const { nombre, email, password, passwordconf } = usuario;

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, email, password, passwordconf].includes("")) {
      return setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
    }

    if (password.length < 6) {
      return setAlerta({
        msg: "La password debe ser mínimo de 6 caracteres",
        error: true,
      });
    }

    if (password !== passwordconf) {
      return setAlerta({
        msg: "Las passwords no son iguales ",
        error: true,
      });
    }

    setAlerta({});
    try {
      const { data } = await clienteAxios.post(`/api/usuarios`, {
        nombre,
        email,
        password,
      });

      setAlerta({
        msg: data.msg,
        error: false,
      });

      
      setUsuario({
        nombre: "",
        email: "",
        password: "",
        passwordconf: "",
      });

      navigate("/");
      
    } catch (err) {
      setAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <div>
      <h1 className="text-sky-800 font-black text-6xl capitalize">
        Regístrate
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-white shadow rounded-md p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="nombre"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nombre
          </label>
          <input
            type="text"
            placeholder="Agrega tu nombre"
            id="nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="nombre"
            value={nombre}
            onChange={handleChange}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Agrega tu email"
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
            placeholder="Agrega una password"
            id="password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="passwordconf"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Confirmar Passoword
          </label>
          <input
            type="password"
            placeholder="Confirma password"
            id="passwordconf"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            name="passwordconf"
            value={passwordconf}
            onChange={handleChange}
          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-800 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-900 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to="/"
          className="block text-center my-5 uppercase text-sm text-slate-500"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </div>
  );
};

export default Registrar;
