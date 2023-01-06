import { Outlet, Navigate, } from 'react-router-dom'

const PrivateRoutes = () => {
    const user = localStorage.getItem("user");
    return (
        (user === null) ? <Navigate to="/" /> : <Outlet />
    )
}

export default PrivateRoutes