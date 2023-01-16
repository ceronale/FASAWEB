import React from "react";
import BarraOpciones from "../components/BarraOpciones";
import ListarBeneficiarios from "../components/ListarBeneficiarios";

const Beneficiarios = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListarBeneficiarios user={user} />
        </div>
    );
}

export default Beneficiarios;