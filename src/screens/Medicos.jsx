import BarraOpciones from "../components/BarraOpciones";
import ListarMedicos from "../components/ListarMedicos";

const Medicos = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListarMedicos user={user} />
        </div>
    );
}

export default Medicos;