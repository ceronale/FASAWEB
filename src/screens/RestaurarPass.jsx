import React from "react";

import FormRestaurarPass from "../components/RestaurarPass";

const RestaurarPass = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <FormRestaurarPass user={user} />
        </div>
    );
}

export default RestaurarPass;