import { Outlet, Navigate, } from 'react-router-dom'


const EmpresaRoutes = () => {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
        if (user.rol !== "Empresa") {
            user = null;
        }
    }
    return (
        (user === null) ? <Navigate to="/" /> : <Outlet />
    )
}

export default EmpresaRoutes