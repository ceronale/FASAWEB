import React from "react";
import FormModificarPass from "../components/FormModificarPass";

const ModificarPass = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <FormModificarPass user={user} />
        </div>
    );
}

export default ModificarPass;