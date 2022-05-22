import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Proyecto from "./components/Proyecto";
import AuthProvider from "./context/Auth/AuthProvider";
import ProyectoProvider from "./context/proyectos/ProyectoProvider";
import AuthLayout from "./layouts/AuthLayout";
import RutaPrivada from "./layouts/RutaPrivada";
import EditarProyecto from "./pages/EditarProyecto";
import Login from "./pages/Login";
import NoEncontrado from "./pages/NoEncontrado";
import NuevoColaborador from "./pages/NuevoColaborador";
import NuevoProyecto from "./pages/NuevoProyecto";
import Proyectos from "./pages/Proyectos";
import Registrar from "./pages/Registrar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProyectoProvider>
            
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="registrar" element={<Registrar />} />
            </Route>

            <Route path="/proyectos" element={<RutaPrivada />}>
              <Route index element={<Proyectos />} />
              <Route path="crear-proyecto" element={<NuevoProyecto />} />
              <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />
              <Route path=":id" element={<Proyecto />} />
              <Route path="editar/:id" element={<EditarProyecto />} />
            </Route>

            <Route path="*" element={<NoEncontrado />} />
          </Routes>
          
        </ProyectoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
