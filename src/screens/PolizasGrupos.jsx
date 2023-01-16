import React from "react";
import PolizasGruposComponent from "../components/PolizasGrupos";
import BarraOpciones from "../components/BarraOpciones";

const PolizasGrupos = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <PolizasGruposComponent user={user} />
        </div>
    );
}

export default PolizasGrupos;