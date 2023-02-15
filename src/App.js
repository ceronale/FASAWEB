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
import CartolaBeneficiario from "./screens/CartolaBeneficiario";
import AdministrarRoles from "./screens/AdministrarRoles";
import Medicos from "./screens/Medicos";
import Documentos from "./screens/Documentos";
import ReporteAuditoria from "./screens/ReporteAuditoria";
import PrivateRoutes from './utils/PrivateRoutes';
import PacienteRoutes from './utils/PacienteRoutes';
import EmpresaRoutes from './utils/EmpresaRoutes';
import LoginRoutes from './utils/LoginRoutes';
import RestaurarRoutes from './utils/RestaurarRoutes';

import AutorizacionesPrevias from './screens/AutorizacionesPrevias';
import AutorizacionesPreviaAdd from './screens/AutorizacionesPreviaAdd';

import AdministrarUsuariosRoutes from './utils/AdministrarUsuariosRoutes';
import AdministrarRolesRoutes from './utils/AdministrarRolesRoutes';
import PolizasGruposRoutes from './utils/PolizasGruposRoutes';
import AutorizacionPreviaRoutes from './utils/AutorizacionPreviaRoutes';
import BeneficiariosRoutes from "./utils/BeneficiariosRoutes";
import CartolaBeneficiariosRoutes from "./utils/CartolaBeneficiariosRoutes";
import DocumentosRoutes from "./utils/DocumentosRoutes";
import MedicosRoutes from "./utils/MedicosRoutes";
import ReporteAuditoriaRoutes from "./utils/ReporteAuditoriaRoutes";




export default function App() {
  const user = localStorage.getItem("user");
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route element={<AdministrarUsuariosRoutes />}>
          <Route exact path="/AdministrarUsuarios" element={<AdministrarUsuarios />} />
          <Route exact path="/NuevoClienteEmpresa" element={<NuevoClienteEmpresa />} />
        </Route>

        <Route element={<AdministrarRolesRoutes />}>
          <Route exact path="/AdministrarRoles" element={<AdministrarRoles />} />
        </Route>

        <Route element={<PolizasGruposRoutes />}>
          <Route exact path="/PolizasGrupos" element={<PolizasGrupos />} />
        </Route>

        <Route element={<AutorizacionPreviaRoutes />}>
          <Route exact path="/AutorizacionesPrevias" element={<AutorizacionesPrevias />} />
          <Route exact path="/AutorizacionesPreviaAdd" element={<AutorizacionesPreviaAdd />} />
        </Route>

        <Route element={<BeneficiariosRoutes />}>
          <Route exact path="/Beneficiarios" element={<Beneficiarios />} />
        </Route>

        <Route element={<CartolaBeneficiariosRoutes />}>
          <Route exact path="/CartolaBeneficiario" element={<CartolaBeneficiario />} />
        </Route>
        <Route element={<DocumentosRoutes />}>
          <Route exact path="/Documentos" element={<Documentos />} />
        </Route>
        <Route element={<MedicosRoutes />}>
          <Route exact path="/Medicos" element={<Medicos />} />
        </Route>
        <Route element={<ReporteAuditoriaRoutes />}>
          <Route exact path="/ReporteAuditoria" element={<ReporteAuditoria />} />
        </Route>

        <Route element={<LoginRoutes />}>
          <Route exact path="/" element={<Login />} />
        </Route>

        <Route exact path="/OlvidasteContraseña" element={<OlvidasteContraseña />} />
        <Route exact path="/NuevoPacienteCliente" element={<NuevoPacienteCliente />} />


        <Route element={<PrivateRoutes />}>
          <Route exact path="/ModificarPass" element={<ModificarPass />} />
          <Route exact path="/Home" element={<Home />} />
        </Route>

        <Route element={<RestaurarRoutes />}>
          <Route exact path="/RestaurarPass" element={<RestaurarPass />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}