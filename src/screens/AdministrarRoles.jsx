import React from "react";
import AdministrarRols from "../components/AdministrarRoles";
import BarraOpciones from "../components/BarraOpciones";


const AdministrarRoles = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <AdministrarRols user={user} />
        </div>
    );
}

export default AdministrarRoles;