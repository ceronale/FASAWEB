import { Outlet, Navigate, } from 'react-router-dom'


const DocumentosRoutes = () => {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
        if (user.recursos.indexOf("438") === -1) {
            user = null;
        }
    }
    return (
        (user === null) ? <Navigate to="/" /> : <Outlet />
    )
}

export default DocumentosRoutes