
import React, { useState, useEffect } from "react";
import DataTableRoles from "./DataTable/DataTableRoles";
import { ContenedorTitulo, Titulo } from "./Formularios";
import CircularProgress from '@mui/material/CircularProgress';
import { getRoles } from "../api/RolesServices";
import ModalAlert from "./Modals/ModalAlert";

const AdministrarRoles = (user) => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);

    const columns = [
        {
            accessorKey: 'nombre',
            header: 'Rol',
            maxSize: 5
        },
    ];

    //call the api to get roles to the table useffect
    useEffect(() => {
        setLoading(true);
        getRoles().then((response) => {
            console.log(response);
            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                setTitle("Error");
                setMsj("Error de conexión");
                setShowModal(true);
                console.log("Error de conexión");
                setLoading(false);
                return;
            }

            setRoles(undefined);
            setRoles(response.roles);

            setLoading(false);
        }).catch((error) => {
            setTitle("Error");
            setMsj("Error al obtener los roles");
            setShowModal(true);
            setLoading(false);
        });
    }, []);

    //method to get the roles
    const getRols = async () => {
        getRoles().then((response) => {
            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                setTitle("Error");
                setMsj("Error de conexión");
                setShowModal(true);
                setLoading(false);
                return;
            }

            setRoles(undefined);
            setRoles(response.roles);
            setLoading(false);
        }).catch((error) => {
            setTitle("Error");
            setMsj("Error al obtener los roles");
            setShowModal(true);
            setLoading(false);
        });
    }


    return (
        <div style={{ position: 'relative' }}>
            {loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                    <CircularProgress />
                </div>
            )}
            <ModalAlert
                title={title}
                msj={msj}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <main >
                <ContenedorTitulo>
                    <Titulo>Administrar Roles</Titulo>
                </ContenedorTitulo>
                <div id="notaLogin">
                    En esta sección podras editar, crear y elimnar roles.
                </div>
                {
                    (roles === undefined)
                        ?
                        null
                        : <DataTableRoles columns={columns} data={roles} getRols={getRols} />
                }

            </main >
        </div>
    );
}

export default AdministrarRoles;