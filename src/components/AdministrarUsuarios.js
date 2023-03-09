import React, { useState, useEffect } from "react";
import { useNavigate, } from 'react-router-dom';
import { ContenedorTitulo, Titulo } from "./Formularios";
import { EliminarUsuario } from "../api/EliminarUsuario";
import DataTableDeleteAndExport from "./DataTable/DataTableDeleteAndExport";
import "../styles/AdminUsuarios.css";
import ModalAlert from "./Modals/ModalAlert";
import ModalConfirmar from "./Modals/ModalConfirmar";
import { ListarUsuarios } from "../api/ListarUsuarios";
import CircularProgress from '@mui/material/CircularProgress';


const AdministrarUsuarios = (user) => {
    const [loading, setLoading] = useState(false);
    const [usuario] = useState(JSON.parse(user.user));
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [idElminar, setIdElminar] = useState("");
    const navigate = useNavigate();
    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const handleConfirmar = async () => {

        setLoading(true);
        const resp = await EliminarUsuario(idElminar, usuario.correo)
        if (resp === 403) {
            setShowModal(true)
            setTitle("Sesión expirada")
            setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }

        var codigoRespuesta = resp['eliminar'][0]['codigoRespuesta'];
        var detalleRespuesta = resp['eliminar'][0]['detalleRespuesta'];
        setShowModalConfirmar(false);
        setTitle("Eliminar usuario existente")
        setShowModal(true)
        setMsj(detalleRespuesta)
        if (codigoRespuesta === 0) {
            setIdElminar("");
        }
        setLoading(false);
    }


    // DataTable
    // 1.-Configurar Hooks
    const [data, setData] = useState({})


    // 2.-Funcion para mostrar los datos
    const showData = async () => {
        setLoading(true);
        const response = await ListarUsuarios()

        if (response === 403) {
            setShowModal(true)
            setTitle("Sesión expirada")
            setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }
        setLoading(true)
        setData(undefined)
        setData(response.usuario)
        setLoading(false);
    }

    useEffect(() => {
        showData()
    }, [])

    // 3.-Configurar columnas para Datatable
    const columns = [
        {
            accessorKey: 'rut',
            header: 'Rut',
            size: 120,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            size: 120,
        },
        {
            accessorKey: 'apellido',
            header: 'Apellido',
            size: 120,
        },
        {
            accessorKey: 'apellido2',
            header: 'Segundo Apellido',
            size: 120,
        },

        {
            accessorKey: 'celular',
            header: 'Celular',
            size: 120,
        },
        {
            accessorKey: 'correo',
            header: 'Correo',
            size: 50,
        },
        {
            accessorKey: 'cargo',
            header: 'Cargo',
            size: 120,
        },
    ];


    return (
        <main>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}
                <div className="row">
                    <div className="col">
                        <ContenedorTitulo>
                            <Titulo>Administración de Usuarios</Titulo>
                        </ContenedorTitulo>
                        <div id="notaLogin">
                            En esta sección podrás agregar, eliminar y asignar roles a usuarios del sistema.
                        </div>
                        {
                            (data === undefined)
                                ?
                                null
                                : <DataTableDeleteAndExport
                                    data={data}
                                    columns={columns}
                                    export={false}
                                    delete={true}
                                    usuario={usuario.correo}
                                />
                        }
                    </div>
                </div>
                <ModalConfirmar
                    title={title}
                    msj={msj}
                    show={showModalConfirmar}
                    handleClose={handleCloseConfirmar}
                    handleYes={handleConfirmar}
                />
            </div>
            <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
        </main>
    );
}

export default AdministrarUsuarios;