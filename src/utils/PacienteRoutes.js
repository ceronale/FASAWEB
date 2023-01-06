import { Outlet, Navigate, } from 'react-router-dom'


const PacienteRoutes = () => {
    var user = JSON.parse(localStorage.getItem("user"));
    var path = "/"
    if (user !== null) {
        if (user.rol !== "Paciente") {
            user = null;
            var path = "/home"
        }
    }

    return (
        (user === null) ? <Navigate to={path} /> : <Outlet />
    )
}

export default PacienteRoutes