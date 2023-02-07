import React, { useState, useCallback, useEffect } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import {
    Box, Button, IconButton, Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import FormAdministrarRoles from '../Forms/FormAdministrarRoles';
import { margin } from "@mui/system";
import { deleteRol, getComponentesByRol, getComponentes, addRol, updateRol } from "../../api/RolesServices";
import CircularProgress from "@mui/material/CircularProgress";

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
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [loading, setLoading] = useState(false);
    const [components, setComponents] = useState();

    // Metodo para eliminar
    const handleDeleteRow = useCallback(
        (row) => {
            setValues(row.original);
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
                setComponents(response.recursos);
                componentes = response.recursos;
                getComponentesByRol(row.original.id_rol).then((response) => {
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
        const response = await deleteRol(values.id_rol);
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
        console.log(values);
    }


    return (
        <>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}

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
                                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
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
                        />
                }


            </div>
        </>
    );
};

export const ModalRolesx = ({ allValues, open, onClose, onSubmit, left, right, componentes }) => {
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [values, setValues] = useState({});
    const [showModalAlert, setShowModalAlert] = useState(false);
    const [leftx, setLeft] = useState(left);
    const [rightx, setRight] = useState(right);

    const getDatos = (leftParam, rightParam) => {
        setLeft(leftParam);
        setRight(rightParam);
    }

    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }

    const handleSubmit = () => {
        console.log(values);
        let id_recursos = componentes
            .filter(componente2 => rightx.includes(componente2.nombre_logico))
            .map(componente2 => componente2.id_recursos)
            .join(',');
        //check if values has new property
        if (values.new) {
            //create a variable call data and set all the values that you need to send to the api
            let data = {
                nombre: values.nombre,
                recursos: id_recursos
            }
            //call the api addrow and send the data
            addRol(data).then((response) => {
                console.log(response);
                //modal alert if the response is ok response.response1[0].codigo === 0 is ok and response.response1[0].codigo === 1 is error
                // if (response.response1[0].codigo === 0) {
                //     setTitleAlert("Exito");
                //     setMsjAlert("El rol se agrego correctamente");
                //     setShowModalAlert(true);
                // }
                // else {
                //     setTitleAlert("Error");
                //     setMsjAlert("El rol no se agrego correctamente");
                //     setShowModalAlert(true);
                // }
            })
        } else {
            //create a variable call data and set all the values that you need to send to the api
            let data = {
                id_rol: values.id_rol,
                nombre: values.nombre,
                recursos: id_recursos
            }
            //call the api editrow and send the data
            updateRol(data).then((response) => {
                console.log(response);
                //modal alert if the response is ok response.response1[0].codigo === 0 is ok and response.response1[0].codigo === 1 is error
                // if (response.response1[0].codigo === 0) {
                //     setTitleAlert("Exito");
                //     setMsjAlert("El rol se edito correctamente");
                //     setShowModalAlert(true);
                // }
                // else {
                //     setTitleAlert("Error");
                //     setMsjAlert("El rol no se edito correctamente");
                //     setShowModalAlert(true);
                // }
            }
            )
        }

        //close the modal
        onClose();

    }

    useEffect(() => {
        setValues(allValues);
    }, [allValues]);

    return (
        <>
            <Dialog open={open} maxWidth={"lg"} style={{ zIndex: 2 }}>
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
            </Dialog>
        </>
    );
};
export default DataTableRoles;
