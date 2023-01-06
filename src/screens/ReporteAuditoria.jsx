import React from "react";
import ListarRepAuditoria from "../components/ListarRepAuditoria";
import BarraOpciones from "../components/BarraOpciones";

const ReporteAuditoria = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListarRepAuditoria user={user} />
        </div>
    );
}

export default ReporteAuditoria;