import BarraOpciones from "../components/BarraOpciones";
import FormHome from "../components/FormHome";

const Home = () => {
    var user = localStorage.getItem("user");
    return (
        <div>
            <BarraOpciones user={user} />
            <FormHome user={user} />
        </div>
    );
}

export default Home;