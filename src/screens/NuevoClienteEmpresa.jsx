import React from "react";

import BarraOpciones from "../components/BarraOpciones";
import FormClienteEmpresa from "../components/Forms/FormClienteEmpresa";

const NuevoClienteEmpresa = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <FormClienteEmpresa usuario={user} />
        </div>
    );
}

export default NuevoClienteEmpresa;