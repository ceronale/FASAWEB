import React from "react";
import FormPolizas from "../components/FormPolizas";
import BarraOpciones from "../components/BarraOpciones";

const PolizasGrupos = () => {
    var user = localStorage.getItem("user");
    return ( 
        <div>
            <BarraOpciones user={user} />
            <FormPolizas user={user} />
        </div>
    );
}
 
export default PolizasGrupos;