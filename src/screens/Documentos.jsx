import React from "react";
import BarraOpciones from "../components/BarraOpciones";
import ListaDocumentos from "../components/ListarDocumentos";
const Documentos = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListaDocumentos user={user} />

        </div>

    );
};

export default Documentos;
