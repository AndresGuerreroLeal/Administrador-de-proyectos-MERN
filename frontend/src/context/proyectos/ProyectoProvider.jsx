import { useContext, useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import ProyectoContext from "./ProyectoContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"
import AuthContext from "../Auth/AuthContext";

let socket;

const ProyectoProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [modalformulariotarea, setModalFormularioTarea] = useState(false);
  const [modaleliminartarea, setModalEliminarTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalElimianrColaborador] =
    useState(false);
  const [buscador,setBuscador] = useState(false)

  const navigate = useNavigate();

  const {auth} = useContext(AuthContext)
  
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios.get("/api/proyectos", config);

        setProyectos(data);
      } catch (err) {
        console.log(err);
      }
    };
    obtenerProyectos();
  }, [auth]);

  useEffect(()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL)

  },[])

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({});
    }, 1000);
  };

  const crearProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(
        "/api/proyectos",
        proyecto,
        config
      );

      setProyectos([...proyectos, data]);

      mostrarAlerta({
        msg: "Proyecto creado correctamente",
        error: false,
      });

      setTimeout(() => {
        navigate("/proyectos");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const actualizarProyecto = async (proyectoNuevo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/api/proyectos/${proyectoNuevo.id}`,
        proyectoNuevo,
        config
      );

      setProyectos(
        proyectos.map((proyecto) =>
          proyecto._id === data._id ? data : proyecto
        )
      );

      mostrarAlerta({
        msg: "Proyecto actualizado correctamente",
        error: false,
      });

      setTimeout(() => {
        navigate("/proyectos");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.get(`/api/proyectos/${id}`, config);

      setProyecto(data);

      setAlerta({})
    } catch (err) {
      navigate("/proyectos")
      setAlerta({
        msg: err.response.data.msg,
        error: true,
      });

      setTimeout(()=>{
        setAlerta({})
      },3000)

    } finally {
      setCargando(false);
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(
        `/api/proyectos/${id}`,
        config
      );

      setProyectos(proyectos.filter((proyecto) => proyecto._id !== id));

      mostrarAlerta({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        navigate("/proyectos");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalformulariotarea);
    setTarea({});
  };

  const crearTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/api/tareas", tarea, config);

      setAlerta({});
      setModalFormularioTarea(false);

      //SOCKET IO
      socket.emit("nueva tarea", data);

    } catch (err) {
      console.log(err);
      console.log(err.response.data.msg);
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const editarTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/api/tareas/${tarea.tareaId}`,
        {
          nombre: tarea.nombre,
          descripcion: tarea.descripcion,
          prioridad: tarea.prioridad,
          fechaEntrega: tarea.fechaEntrega,
        },
        config
      );

      
      setAlerta({});
      
      setModalFormularioTarea(false);

      //SOCKET IO
      socket.emit("actualizar tarea", data);

    } catch (err) {
      console.log(err);
      console.log(err.response.data.msg);
    }
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modaleliminartarea);
  };

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(
        `/api/tareas/${tarea._id}`,
        config
      );

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setModalEliminarTarea(false);

      
      //SOCKET IO
      socket.emit("eliminar tarea",tarea)
      
      setTarea({});
      setTimeout(()=>{
        setAlerta({})
      },3000)
    } catch (err) {
      setAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    }
  };

  const submitColaborador = async (email) => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(
        "/api/proyectos/colaboradores",
        { email },
        config
      );

      setColaborador(data);
      setAlerta({});
    } catch (err) {
      mostrarAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(
        `/api/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      );

      mostrarAlerta({
        msg: data.msg,
        error: false,
      });

      setColaborador({});
    } catch (err) {
      mostrarAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    }
  };

  const handleModalEliminarColaborador = (colaborador) => {
    setModalElimianrColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(
        `/api/proyectos/eliminar-colaboradores/${proyecto._id}`,
        { id: colaborador._id },
        config
      );

      const proyectoActualizado = { ...proyecto };

      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );

      setProyecto(proyectoActualizado);

      mostrarAlerta({
        msg: data.msg,
        error: false,
      });

      setColaborador({});

      handleModalEliminarColaborador();
    } catch (err) {
      mostrarAlerta({
        msg: err.response.data.msg,
        error: true,
      });
    }
  };

  const completarTarea =async(id)=>{
    try{
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const {data} = await clienteAxios.post(`/api/tareas/estado/${id}`,{},config)

      setTarea({})
      setAlerta({})

      //SOCKET IO
      socket.emit("cambiar estado", data);

    }catch(err){
      console.log(err.response)
    }
  }

  const handleBuscador = ()=>{
    setBuscador(!buscador)
  }

  //SOCKET IO
  const submitTareasProyecto = (tarea)=>{
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado);
  }

  const eliminarTareaProyecto =(tarea)=>{
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    setProyecto(proyectoActualizado);
  }

  const actualizarTareaProyecto =(tareaActualizada)=>{
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tarea) =>
      tarea._id !== tareaActualizada._id ? tarea : tareaActualizada
    );
    setProyecto(proyectoActualizado);
  }

  const cambiarEstadoTarea = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };
  
  const cerrarSesionProyectos = () =>{
    setProyectos([])
    setProyecto({})
    setAlerta({})
  } 

  return (
    <ProyectoContext.Provider
      value={{
        proyectos,
        alerta,
        proyecto,
        cargando,
        modalformulariotarea,
        tarea,
        colaborador,
        modaleliminartarea,
        modalEliminarColaborador,
        buscador,
        handleModalTarea,
        mostrarAlerta,
        crearProyecto,
        obtenerProyecto,
        actualizarProyecto,
        eliminarProyecto,
        crearTarea,
        handleModalEditarTarea,
        editarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectoContext.Provider>
  );
};

export default ProyectoProvider;
