/* Importaciones de componentes */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

//import "./api/LoginService";
import Navbar from "./components/Navbar";
import Login from "./screens/Login";
import Home from "./screens/Home";
import OlvidasteContraseña from "./screens/OlvidasteContraseña";
import NuevoPacienteCliente from "./screens/NuevoPacienteCliente";
import AdministrarUsuarios from "./screens/AdministrarUsuarios";
import NuevoClienteEmpresa from "./screens/NuevoClienteEmpresa";
import PolizasGrupos from "./screens/PolizasGrupos";
import ModificarPass from "./screens/ModificarPass";
import RestaurarPass from "./screens/RestaurarPass";
import Beneficiarios from "./screens/Beneficiarios";
import CartolaVentas from "./screens/CartolaVentas";
import AdministrarRoles from "./screens/AdministrarRoles";
import Medicos from "./screens/Medicos";
import Documentos from "./screens/Documentos";
import ReporteAuditoria from "./screens/ReporteAuditoria";
import PrivateRoutes from './utils/PrivateRoutes';
import PacienteRoutes from './utils/PacienteRoutes';
import EmpresaRoutes from './utils/EmpresaRoutes';
import LoginRoutes from './utils/LoginRoutes';

export default function App() {
  const user = localStorage.getItem("user");
  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route element={<LoginRoutes />}>
          <Route exact path="/" element={<Login />} />
        </Route>

        <Route exact path="/OlvidasteContraseña" element={<OlvidasteContraseña />} />
        <Route exact path="/NuevoPacienteCliente" element={<NuevoPacienteCliente />} />


        <Route element={<PacienteRoutes />}>
          <Route exact path="/CartolaVentas" element={<CartolaVentas />} />
        </Route>

        <Route element={<EmpresaRoutes />}>
          <Route exact path="/AdministrarUsuarios" element={<AdministrarUsuarios />} />
          <Route exact path="/NuevoClienteEmpresa" element={<NuevoClienteEmpresa />} />
          <Route exact path="/PolizasGrupos" element={<PolizasGrupos />} />
          <Route exact path="/Beneficiarios" element={<Beneficiarios />} />
          <Route exact path="/CartolaVentas" element={<CartolaVentas />} />

        </Route>

        <Route element={<PrivateRoutes />}>
          <Route exact path="/RestaurarPass" element={<RestaurarPass />} />
          <Route exact path="/ModificarPass" element={<ModificarPass />} />
          <Route exact path="/Home" element={<Home />} />
          <Route exact path="/Medicos" element={<Medicos />} />
          <Route exact path="/ReporteAuditoria" element={<ReporteAuditoria />} />
        </Route>

        <Route exact path="/AdministrarRoles" element={<AdministrarRoles />} />

        <Route exact path="/Documentos" element={<Documentos />} />

      </Routes>
    </BrowserRouter>
  );
}