import React from "react";
import AutorizacionPreviaAdd from "../components/AutorizacionPreviaAdd";
import BarraOpciones from "../components/BarraOpciones";


const AutorizacionePreviaAdd = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <AutorizacionPreviaAdd user={user} />

        </div>
    );
}

export default AutorizacionePreviaAdd;