import React from "react";
import BarraOpciones from "../components/BarraOpciones";
import AdministrarUsuariosComponent from "../components/AdministrarUsuarios";

const AdministrarUsuarios = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <AdministrarUsuariosComponent user={user} />
        </div>
    );
}

export default AdministrarUsuarios;