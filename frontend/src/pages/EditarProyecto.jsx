import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FormProyecto from '../components/FormProyecto'
import ProyectoContext from '../context/proyectos/ProyectoContext'

const EditarProyecto = () => {

    const params = useParams()

    const {proyecto,cargando,obtenerProyecto,eliminarProyecto} = useContext(ProyectoContext)

    useEffect(()=>{
        obtenerProyecto(params.id)
    },[])

    const {nombre} = proyecto

    const handleClick = () => {
      if (confirm("¿Deseas eliminar este proyecto?")) {
        eliminarProyecto(params.id);
      }
    };

    if(cargando) return "Cargando..."

  return (
    <>
      <div className="flex justify-between ">
        <h1 className="font-black text-4xl">Editar proyecto: {nombre}</h1>
        <div className="flex items-center gap-2 text-gray-400 hover:text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <button className='uppercase font-bold'
            onClick={handleClick}
          >Eliminar</button>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <FormProyecto />
      </div>
    </>
  );
}

export default EditarProyecto