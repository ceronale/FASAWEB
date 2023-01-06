import { Outlet, Navigate, } from 'react-router-dom'

const LoginRoutes = () => {
    const user = localStorage.getItem("user");

    return (
        (user === null) ? <Outlet /> : <Navigate to="/Home" />
    )
}

export default LoginRoutes