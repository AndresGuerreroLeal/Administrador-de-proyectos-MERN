import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando,setCargando] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await clienteAxios.get("/api/usuarios/perfil", config);

        setAuth(data);

      } catch (err) {
        setAuth({})
    
      }finally{
        setCargando(false)
      }
    };

    autenticarUsuario();
  }, []);

  const cerrarSesionAuth = ()=>{
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        cargando,
        setAuth,
        cerrarSesionAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
