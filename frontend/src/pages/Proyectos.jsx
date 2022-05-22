import React, { useContext, useEffect } from 'react'
import Alerta from '../components/Alerta'
import PreviewProyecto from '../components/PreviewProyecto'
import ProyectoContext from '../context/proyectos/ProyectoContext'


const Proyectos = () => {

  const {proyectos,alerta} = useContext(ProyectoContext)

  
  const {msg} = alerta

  return (
    <>
        <h1 className='text-4xl font-black'>
            Proyectos
        </h1>

        {msg && <Alerta alerta={alerta} />}

        <div className='bg-white shadow mt-10 rounded-lg'>
          {proyectos.length ? 
            proyectos.map(proyecto=>(
              <PreviewProyecto proyecto={proyecto} key={proyecto._id}/>
            ))
            
          : <p className=' text-center text-gray-600 uppercase p-5'>
              No hay proyectos creados actualmente.
            </p>}
        </div>
    </>
  )
}

export default Proyectos