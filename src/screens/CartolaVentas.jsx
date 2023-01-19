import BarraOpciones from "../components/BarraOpciones";
import ListarCartolaVentas from "../components/ListarCartolaVentas";

const CartolaVentas = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <ListarCartolaVentas user={user} />
        </div>
    );
}

export default CartolaVentas;