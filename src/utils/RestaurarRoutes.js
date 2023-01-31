import { Outlet, Navigate, } from 'react-router-dom'

const RestaurarRoutes = () => {
    const user = localStorage.getItem("userRestaurar");
    return (
        (user === null) ? <Navigate to="/" /> : <Outlet />
    )
}

export default RestaurarRoutes