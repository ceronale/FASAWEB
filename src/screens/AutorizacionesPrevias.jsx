import React from "react";
import AutorizacionesPrevia from "../components/AutorizacionesPrevias";
import AutorizacionPreviaAdd from "../components/AutorizacionPreviaAdd";
import BarraOpciones from "../components/BarraOpciones";


const AutorizacionesPrevias = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <AutorizacionesPrevia user={user} />
        </div>
    );
}

export default AutorizacionesPrevias;