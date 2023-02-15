import BarraOpciones from "../components/BarraOpciones";
import ListarCartolaBeneficiarios from "../components/ListarCartolaBeneficiarios";

const CartolaBeneficiario = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListarCartolaBeneficiarios user={user} />
        </div>
    );
}

export default CartolaBeneficiario;