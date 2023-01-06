import React, { useState, useEffect } from "react";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { EliminarUsuario } from "../api/EliminarUsuario";

import DataTableDeleteAndExport from "./DataTable/DataTableDeleteAndExport";
import "../styles/AdminUsuarios.css";
import ModalTest from "./ModalTest";
import ModalConfirmar from "./ModalConfirmar";
import { ListarUsuarios } from "../api/ListarUsuarios";


const FormAdminUsuarios = (user) => {
    const [usuario, setUsuario] = useState(JSON.parse(user.user))
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [idElminar, setIdElminar] = useState("");
    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }
    const handleClose = () => {
        setShowModal(false);
    }

    const handleConfirmar = async () => {
        const resp = await EliminarUsuario(idElminar, usuario.correo)
        var codigoRespuesta = resp['eliminar'][0]['codigoRespuesta'];
        var detalleRespuesta = resp['eliminar'][0]['detalleRespuesta'];
        setShowModalConfirmar(false);
        setTitle("Eliminar usuario existente")
        setShowModal(true)
        setMsj(detalleRespuesta)
        if (codigoRespuesta === 0) {
            setIdElminar("");
        }
    }


    // DataTable
    // 1.-Configurar Hooks
    const [users, setUsers] = useState()


    // 2.-Funcion para mostrar los datos
    const showData = async () => {
        const response = await ListarUsuarios()
        setUsers(response.usuario)
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
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <ContenedorTitulo>
                            <Titulo>Administracion de Usuarios</Titulo>
                        </ContenedorTitulo>
                        <div id="notaLogin">
                            En esta sección podras agregar un nuevo usuario al sistema.
                        </div>

                        <div className="boxTabla">
                            {
                                (users === undefined)
                                    ?
                                    null
                                    : <DataTableDeleteAndExport
                                        data={users}
                                        columns={columns}
                                        export={false}
                                        delete={true}
                                    />
                            }

                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirmar
                title={title}
                msj={msj}
                show={showModalConfirmar}
                handleClose={handleCloseConfirmar}
                handleYes={handleConfirmar}
            />
            <ModalTest title={title} show={showModal} handleClose={handleClose} msj={msj} />
        </main>
    );
}

export default FormAdminUsuarios;