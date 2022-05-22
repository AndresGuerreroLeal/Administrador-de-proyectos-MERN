import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/Auth/AuthContext";
import ProyectoContext from "../context/proyectos/ProyectoContext";
import Busqueda from "./Busqueda";

const Header = () => {
  const { handleBuscador, cerrarSesionProyectos } = useContext(ProyectoContext);

  const { cerrarSesionAuth } = useContext(AuthContext);

  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    cerrarSesionProyectos();
    localStorage.removeItem("token");
  };

  return (
    
    <header className="px-4 py-5 bg-white border-b">
      <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">

      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text-sky-600 font-black mb-5 md:mb-0 text-center">
          Proyectos
        </h2>

        <div className="flex items-center gap-4 flex-col md:flex-row">
          <button
            onClick={handleBuscador}
            type="button"
            className="font-bold uppercase"
            >
            Buscar Proyecto
          </button>

          <Link to="/proyectos" className="font-bold uppercase">
            Proyectos
          </Link>
          <button
            type="button"
            className="text-white text-sm bg-sky-700 p-3 rounded-md uppercase font-bold"
            onClick={handleCerrarSesion}
            >
            Cerrar Sesión
          </button>

          <Busqueda />
        </div>
      </div>
            </nav>
    </header>
  );
};

export default Header;
