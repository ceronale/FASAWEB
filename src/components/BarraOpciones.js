import React from "react";
import "../styles/BarraOpciones.css";
import { NavLink } from "react-router-dom";

const BarraOpciones = (user) => {

    let usuario;
    if (user && user.user) {
        usuario = JSON.parse(user.user);

        // ...
    } else {
        usuario = {};
        usuario.rol = "norol"
    }

    return (
        <div className="Barra">

            <div className="contenedorOpciones">

                {
                    (usuario.recursos.indexOf("431") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/AdministrarUsuarios" className="opcion" >Administrar Usuarios</NavLink>
                        </>

                }
                {
                    (usuario.recursos.indexOf("432") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/AdministrarRoles" className="opcion" >Administrar Roles</NavLink>
                        </>

                }
                {
                    (usuario.recursos.indexOf("433") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/PolizasGrupos" className="opcion" >Polizas y Grupos</NavLink>
                        </>

                }

                {
                    (usuario.recursos.indexOf("434") === -1)
                        ?
                        null
                        : <>
                            <NavLink to="/Beneficiarios" className="opcion" >Beneficiarios</NavLink>
                        </>
                }
                {
                    (usuario.recursos.indexOf("435") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/CartolaBeneficiario" className="opcion" >Cartola Beneficiarios</NavLink>
                        </>

                }
                {
                    (usuario.recursos.indexOf("436") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/AutorizacionesPrevias" className="opcion" >Autoriz. Previas</NavLink>
                        </>

                }
                {
                    (usuario.recursos.indexOf("437") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/Medicos" className="opcion" >Medicos</NavLink>
                        </>

                }
                {
                    (usuario.recursos.indexOf("438") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/Documentos" className="opcion" >Documentos</NavLink>
                        </>

                }

                {
                    (usuario.recursos.indexOf("439") === -1)
                        ?
                        null :
                        <>
                            <NavLink to="/ReporteAuditoria" className="opcion" >Reporte Auditoria</NavLink>
                        </>

                }




                {
                    (usuario.recursos.indexOf("442") === -1)
                        ?
                        null
                        : <>
                            <a href="https://www.farmaciasahumada.cl/storelocator" className="opcion">Consultar Farmacias</a>
                            <a href="https://web.farmaciasahumada.cl/fasaonline/fasa/MFT/MFT.HTM" className="opcion">Consultar Medicamentos</a>
                        </>
                }

            </div>
        </div>
    );
}

export default BarraOpciones;