import React, { useState, useCallback, useEffect } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import ModalAlert2 from "../Modals/ModalAlert";
import {
    Box, Button, IconButton, Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import FormAdministrarRoles from '../Forms/FormAdministrarRoles';
import { deleteRol, getComponentesByRol, getComponentes, addRol, updateRol } from "../../api/RolesServices";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, } from 'react-router-dom';

const DataTableRoles = props => {
    //Se crea la vairable con informacion de la data table
    const [tableData, setTableData] = useState(props.data)
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [showModalRoles, setShowModalRoles] = useState(false);
    const [values, setValues] = useState();
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [showModalAlert, setShowModalAlert] = useState(false);
    const [showModalAlert2, setShowModalAlert2] = useState(false);
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [loading, setLoading] = useState(false);
    const [components, setComponents] = useState();
    const navigate = useNavigate();


    // Metodo para eliminar
    const handleDeleteRow = useCallback(
        (row) => {
            setValues(row);
            setTitle("¿Desea continuar?")
            setMsj("Seleccione confirmar si desea eliminar el campo")
            setShowModalConfirmar(true)
        },
        [tableData],
    );

    const handleEditRow = useCallback(
        (row) => {
            setValues(undefined);
            setLoading(true);
            setLeft([]);
            setRight([]);
            let componentes;
            let componentesByRol;
            getComponentes().then((response) => {
                if (response === 403) {
                    setTitleAlert("Sesión expirada")
                    setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
                    setShowModalAlert(true)

                    //set time out to logout of 5 seconds
                    setTimeout(() => {
                        localStorage.removeItem("user");
                        navigate(`/`);
                    }, 3000);
                    return;
                }
                setComponents(response.recursos);
                componentes = response.recursos;
                getComponentesByRol(row.original.id_rol).then((response) => {
                    if (response === 403) {
                        setTitleAlert("Sesión expirada")
                        setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
                        setShowModalAlert(true)

                        //set time out to logout of 5 seconds
                        setTimeout(() => {
                            localStorage.removeItem("user");
                            navigate(`/`);
                        }, 3000);
                        return;
                    }
                    componentesByRol = response.recursoRol;
                    componentes.forEach((componente) => {
                        if (!componentesByRol.find(c => c.id_recurso === componente.id_recursos)) {
                            setLeft((prevLeft) => [...prevLeft, componente.nombre_logico]);
                        } else {
                            setRight((prevRight) => [...prevRight, componente.nombre_logico]);
                        }
                    });
                    setValues(row.original);
                });
            });
        },
        [tableData]
    );

    useEffect(() => {
        if (left.length > 0 || right.length > 0) {
            setShowModalRoles(true);
            setLoading(false);
        }
    }, [left, right]);

    const handleNuevoRol = () => {
        setValues(undefined);
        setLoading(true);
        setLeft([]);
        setRight([]);
        let componentes;
        getComponentes().then((response) => {
            if (response === 403) {
                setTitleAlert("Sesión expirada")
                setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
                setShowModalAlert(true)

                //set time out to logout of 5 seconds
                setTimeout(() => {
                    localStorage.removeItem("user");
                    navigate(`/`);
                }, 3000);
                return;
            }
            setComponents(response.recursos);
            componentes = response.recursos;
            componentes.forEach((componente) => {
                setLeft((prevLeft) => [...prevLeft, componente.nombre_logico]);
            });
            setValues({ nombre: '', new: true });
            setLoading(false);
        });
    };
    //Modal Confirmar
    const handleConfirmar = async () => {
        const response = await deleteRol(values.original.id_rol);

        if (response === 403) {
            setTitleAlert("Sesión expirada")
            setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
            setShowModalAlert(true)

            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }

        //modal alert if the response is ok response.response1[0].codigo === 0 is ok and response.response1[0].codigo === 1 is error
        if (response.response1[0].codigo === 0) {
            setTitleAlert("Eliminado");
            setMsjAlert("El rol se elimino correctamente");
            setShowModalAlert(true);
        } else {
            setTitleAlert("Error");
            setMsjAlert("El rol no se elimino correctamente");
            setShowModalAlert(true);
        }

        tableData.splice(values.index, 1);
        setTableData([...tableData]);
        setShowModalConfirmar(false);
    }

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }


    const handleSumbitModal = () => {

    }


    const handleAddRol = async (values) => {
        const response = await addRol(values);

        if (response === 403) {
            setTitleAlert("Sesión expirada")
            setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
            setShowModalAlert(true)

            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }
        const { codigo } = response.response[0];
        setLoading(true);
        if (codigo === 1) {
            setTitleAlert("Éxito");
            setMsjAlert("El rol se ha añadido correctamente");
            setLoading(false);
            setShowModalAlert2(true);
        } else {
            setTitleAlert("Error");
            setMsjAlert("El rol no se ha añadido correctamente");
            setLoading(false);
            setShowModalAlert(true);
        }

        setShowModalRoles(false);
    }

    const handleEditRol = async (values) => {
        const response = await updateRol(values);

        if (response === 403) {
            setTitleAlert("Sesión expirada")
            setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
            setShowModalAlert(true)

            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }

        setLoading(true);
        const { codigo } = response.response1[0];
        if (codigo === 0) {
            setTitleAlert("Éxito");
            setMsjAlert("El rol se ha editado correctamente");
            setLoading(false);
            setShowModalAlert2(true);
        } else {
            setTitleAlert("Error");
            setMsjAlert("El rol no se ha editado correctamente");
            setLoading(false);
            setShowModalAlert(true);
        }

        setShowModalRoles(false);
    }

    const handleClose = () => {
        setShowModalAlert2(false)
        props.getRols();
    }



    return (
        <>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '99999' }}>
                        <CircularProgress />
                    </div>
                )}
                <ModalAlert2
                    title={titleAlert}
                    msj={msjAlert}
                    show={showModalAlert2}
                    handleClose={() => handleClose()}
                />

                <ModalAlert
                    title={titleAlert}
                    msj={msjAlert}
                    show={showModalAlert}
                    handleClose={() => setShowModalAlert(false)}
                />
                <ModalConfirmar
                    title={title}
                    msj={msj}
                    show={showModalConfirmar}
                    handleClose={handleCloseConfirmar}
                    handleYes={handleConfirmar} />

                <MaterialReactTable
                    columns={props.columns}
                    data={tableData}
                    positionToolbarAlertBanner="bottom"
                    enableRowActions
                    localization={MRT_Localization_ES}
                    positionActionsColumn="last"
                    renderRowActions={({ row, table }) => (
                        <Box>
                            <Tooltip title="Editar">
                                <IconButton color="primary" onClick={() => handleEditRow(row)}>
                                    <CreateIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <IconButton color="error" onClick={() => handleDeleteRow(row)} disabled={row.original.id_rol === 52 || row.original.id_rol === 53 || row.original.id_rol === 50}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleNuevoRol()}>
                                + Agregar Nuevo Rol
                            </Button>
                        </div>

                    )}
                />
                {
                    (values === undefined)
                        ?
                        null
                        :
                        <ModalRolesx
                            columns={props.columns}
                            open={showModalRoles}
                            onClose={() => setShowModalRoles(false)}
                            onSubmit={handleSumbitModal}
                            allValues={values}
                            left={left}
                            right={right}
                            componentes={components}
                            handleAddRol={handleAddRol}
                            handleEditRol={handleEditRol}
                            rolslist={tableData}
                        />
                }


            </div>
        </>
    );
};

export const ModalRolesx = ({ allValues, open, onClose, onSubmit, left, right, componentes, handleAddRol, handleEditRol, rolslist }) => {
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [values, setValues] = useState({});
    const [showModalAlert, setShowModalAlert] = useState(false);
    const [leftx, setLeft] = useState(left);
    const [rightx, setRight] = useState(right);
    const [loading, setLoading] = useState(false);

    const getDatos = (leftParam, rightParam) => {
        setLeft(leftParam);
        setRight(rightParam);
    }

    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }

    const handleSubmit = async () => {
        let id_recursos = componentes
            .filter(componente2 => rightx.includes(componente2.nombre_logico))
            .map(componente2 => componente2.id_recursos)
            .join(',');

        let componentesIncluidos = componentes
            .filter(componente2 => !rightx.includes(componente2.nombre_logico))
            .map(componente2 => componente2.id_recursos)
            .join(',');
        //check if componentesIncluidos o id_recursos is empty and if it is set the value to 0
        if (!componentesIncluidos) {
            componentesIncluidos = 0;
        }
        if (!id_recursos) {

            id_recursos = 0;
        }

        if (values.new) {

            //check if values.nombre is not in the list of rolslist
            if (rolslist.some(rol => rol.nombre === values.nombre)) {
                setTitleAlert("Error");
                setMsjAlert("El nombre del rol ya existe");
                setShowModalAlert(true);
                return;
            }

            //Check if the values are empty or not values.nombre and id_recursos
            if (!values.nombre || !id_recursos) {
                setTitleAlert("Error");
                setMsjAlert("Por favor, rellene todos los campos. El rol debe tener al menos un componente");
                setShowModalAlert(true);
                return;
            }

            const data = {
                nombre: values.nombre,
                recursos: id_recursos
            }
            setLoading(true);
            handleAddRol(data);
        } else {

            if (!values.nombre || !id_recursos) {
                setTitleAlert("Error");
                setMsjAlert("Por favor, rellene todos los campos");
                setShowModalAlert(true);
                return;
            }

            const data = {
                id_rol: values.id_rol,
                nombre: values.nombre,
                recursos: componentesIncluidos,
                nuevoRecurso: id_recursos,
            }
            setLoading(true);
            handleEditRol(data);
        }
    };

    useEffect(() => {
        setValues(allValues);
    }, [allValues]);

    return (
        <>
            <Dialog open={open} maxWidth={"lg"} style={{ zIndex: 2 }}>
                <div style={{ position: 'relative' }}>
                    {loading && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '99999' }}>
                            <CircularProgress />
                        </div>
                    )}
                    <ModalAlert zIndex={99999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
                    <DialogTitle textAlign="center">Agregar o Editar Rol</DialogTitle>
                    <DialogContent>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <Stack
                                sx={{
                                    width: '100%',
                                    minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                    gap: '1.5rem',
                                }}
                            >

                                <div style={{ marginTop: '1px' }}>
                                    <Typography variant="h8" gutterBottom component="div">
                                        Datos del rol
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="name"
                                        value={values.nombre}
                                        variant="standard"
                                        onChange={(e) => setValues({ ...values, nombre: e.target.value })}
                                    />
                                </div>

                                <Typography variant="h8" gutterBottom component="div">
                                    Permisos componentes
                                </Typography>
                                <FormAdministrarRoles getDatos={getDatos} propLeft={leftx} propRight={rightx} />

                            </Stack>
                        </form>
                    </DialogContent>
                    <DialogActions sx={{ p: '1.25rem' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button color="primary" onClick={handleSubmit} variant="contained">
                            Guardar
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
};
export default DataTableRoles;
