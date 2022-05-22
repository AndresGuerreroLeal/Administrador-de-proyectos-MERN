import React, { useContext } from "react";
import ProyectoContext from "../context/proyectos/ProyectoContext";
import { formatoFecha } from "../helpers/formatoFecha";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {
  const { description, nombre, prioridad, fechaEntrega, estado, _id } = tarea;

  const admin = useAdmin();

  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =
    useContext(ProyectoContext);

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col item-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-xl">{formatoFecha(fechaEntrega)}</p>
        <p className="mb-1 text-xl text-gray-600">
          Prioridad:
          {prioridad}
        </p>
        {estado && (
          <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">
            Completada por: {tarea.completado?.nombre}
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-col lg:flex-row">
        {admin && (
          <button
            onClick={() => handleModalEditarTarea(tarea)}
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Editar
          </button>
        )}

        <button
          className={`${
            estado ? "bg-sky-600" : "bg-gray-600"
          } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completarTarea(_id)}
        >
          {estado ? "Completa" : "Incompleta"}
        </button>

        {admin && (
          <button
            onClick={() => handleModalEliminarTarea(tarea)}
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
