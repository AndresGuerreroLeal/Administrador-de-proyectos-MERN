import { useContext } from "react";
import AuthContext from "../context/Auth/AuthContext";
import ProyectoContext from "../context/proyectos/ProyectoContext";

const useAdmin = () => {
  const { proyecto } = useContext(ProyectoContext);
  const { auth } = useContext(AuthContext);

  return proyecto.creador === auth._id;
};

export default useAdmin;