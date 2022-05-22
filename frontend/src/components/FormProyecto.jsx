import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProyectoContext from "../context/proyectos/ProyectoContext";
import Alerta from "./Alerta";

const FormProyecto = () => {
  const { alerta, proyecto, mostrarAlerta, crearProyecto, actualizarProyecto } =
    useContext(ProyectoContext);

  const [id, setId] = useState(null);

  const [proyectoform, setProyectoForm] = useState({
    nombre: "",
    descripcion: "",
    fechaEntrega: "",
    cliente: "",
  });

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setId(proyecto._id);
      setProyectoForm({
        nombre: proyecto?.nombre,
        descripcion: proyecto?.descripcion,
        fechaEntrega: proyecto.fechaEntrega?.split("T")[0],
        cliente: proyecto?.cliente,
      });
    }
  }, [params]);

  const handleChange = (e) => {
    setProyectoForm({
      ...proyectoform,
      [e.target.name]: e.target.value,
    });
  };

  const { nombre, descripcion, fechaEntrega, cliente } = proyectoform;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    if (id) {
      await actualizarProyecto({
        nombre,
        descripcion,
        fechaEntrega,
        cliente,
        id,
      });
    } else {
      await crearProyecto(proyectoform);
    }

    setProyectoForm({
      nombre: "",
      descripcion: "",
      fechaEntrega: "",
      cliente: "",
    });
  };

  return (
    <form
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {alerta.msg && <Alerta alerta={alerta} />}

      <div className="mt-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="nombre"
        >
          Nombre Proyecto
        </label>
        <input
          id="nombre"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Proyecto"
          name="nombre"
          onChange={handleChange}
          value={nombre}
        />
      </div>
      <div className="mt-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="descripcion"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripción"
          name="descripcion"
          onChange={handleChange}
          value={descripcion}
        />
      </div>

      <div className="mt-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="fecha-entrega"
        >
          Fecha de entrega
        </label>
        <input
          id="fecha-entrega"
          type="date"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          name="fechaEntrega"
          onChange={handleChange}
          value={fechaEntrega}
        />
      </div>

      <div className="mt-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="cliente"
        >
          Nombre de cliente
        </label>
        <input
          id="cliente"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del cliente"
          name="cliente"
          onChange={handleChange}
          value={cliente}
        />
      </div>

      <input
        type="submit"
        className="my-5 w-full bg-sky-700 p-3 uppercase font-bold text-white cursor-pointer hover:bg-sky-800 transition-colors"
        value={id ? "Actualizar Proyecto" : "Crear Proyecto"}
      />
    </form>
  );
};

export default FormProyecto;
