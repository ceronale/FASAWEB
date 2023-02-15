import { Outlet, Navigate, } from 'react-router-dom'


const ReporteAuditoriaRoutes = () => {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
        if (user.recursos.indexOf("439") === -1) {
            user = null;
        }
    }
    return (
        (user === null) ? <Navigate to="/" /> : <Outlet />
    )
}

export default ReporteAuditoriaRoutes