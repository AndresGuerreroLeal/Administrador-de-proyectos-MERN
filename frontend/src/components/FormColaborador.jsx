import React, { useContext, useState } from "react";
import ProyectoContext from "../context/proyectos/ProyectoContext";
import Alerta from "./Alerta";

const FormColaborador = () => {
  const [colaboradorform, setColaboradorForm] = useState({
    email: "",
  });

  const { mostrarAlerta, alerta,submitColaborador } = useContext(ProyectoContext);

  const { email } = colaboradorform;

  const handleChange = (e) => {
    setColaboradorForm({
      ...colaboradorform,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (email === "") {
      mostrarAlerta({
        msg: "El email es obligatorio",
        error: true,
      });
      return;
    }

    await submitColaborador(email);

    setColaboradorForm({
        email:""
    })
  };

  const { msg } = alerta;

  return (
    <form
      className="bg-white py-10 px-5 w-full rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="email"
        >
          Email Colaborador
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email del usuario"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className=" text-sm bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded"
        value="Buscar colaborador"
      />
    </form>
  );
};

export default FormColaborador;
