import React from "react";
import BarraOpciones from "../components/BarraOpciones";
import FormAdminUsuarios from "../components/FormAdminUsuarios";

const AdministrarUsuarios = () => {
    var user = localStorage.getItem("user");
    return (  
        <div>
            <BarraOpciones user={user} />
            <FormAdminUsuarios user={user} />
        </div>
    );
}
 
export default AdministrarUsuarios;