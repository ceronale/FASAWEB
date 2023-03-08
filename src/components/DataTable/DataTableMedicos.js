import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, } from 'react-router-dom';
import MaterialReactTable from 'material-react-table';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import "../../styles/PolizasGrupos.css";
import { updateMedico, deleteMedico, addMedico } from "../../api/MedicosService";
import ModalUploadFileMedicos from "../Modals/ModalUploadFileMedicos";
import * as XLSX from 'xlsx/xlsx.mjs';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Delete from '@mui/icons-material/Delete';
import { Edit } from "@material-ui/icons";
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    MenuItem
} from '@mui/material';

const checkDate = (date) => {
    const dateArray = date.split("-");
    if (dateArray.length === 3) {
        if (dateArray[0].length === 2 && dateArray[1].length === 2 && dateArray[2].length === 4) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const DataTableAutorizacionPrevia = props => {
    //Modal Variables
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    //Modal Alert
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [showModalAlert, setShowModalAlert] = useState(false);
    //Modal Upload File
    const [showModalUpload, setShowModalUpload] = useState(false);
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [showModalConfirmarDelete, setShowModalConfirmarDelete] = useState(false);
    //Edit table variables
    const [values, setValues] = useState();
    const [row, setRow] = useState();

    const [loading, setLoading] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const validateRequired = (value) => !!value.length;

    //Function to validate id the value is E or I or i or e
    const validateExcInc = (value) => {
        if (value === 'E' || value === 'e' || value === 'I' || value === 'i') {
            return true;
        } else {
            return false;
        }
    }

    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    const isValid =
                        cell.column.id === 'exc_Inc'
                            ? validateExcInc(event.target.value)
                            : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid depending on column if bioequivalente must say 0 or 1
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: cell.column.id === 'fechaDesde' ? `${cell.column.columnDef.header} debe ser dd-mm-yyyy` :
                                cell.column.id === 'exc_Inc' ? `${cell.column.columnDef.header} debe ser E o I` :
                                    `${cell.column.columnDef.header} es requerido`,
                        });

                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const bio = [
        {
            value: "I",
            label: "Inclusión",
        },
        {
            value: "E",
            label: "Exculsión",
        },
    ];


    const columns = [
        {
            accessorKey: 'rutMedico',
            header: 'Rut Medico',
            enableEditing: false,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            enableEditing: false,
        },
        {
            accessorKey: 'fechaDesde',
            header: 'Fecha Desde',
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 10 },
                type: 'date',
                value: row.original.fechaDesde.split("-").reverse().join("-"),
                onChange: (event) => {
                    const { value } = event.target;
                    row.original.fechaDesde = value.split("-").reverse().join("-");
                },
            }),
        },
        {
            accessorKey: 'exc_Inc', //normal accessorKey
            header: 'Inclusión / Exclusión',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 1 },
                select: true,
                children: bio.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                        {state.label}
                    </MenuItem>
                )),
            }),
        }
    ];



    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }

    const handleCloseUpload = () => {
        props.updateData();
        setShowModalUpload(false);
    }

    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }
    const handleCreateNewRow = async (values) => {
        //Change format of the date to send to the api to YYYY-MM-DD from DD-MM-YYYY
        const date = values.fechaDesde.split("-");
        const dateFormated = date[2] + "-" + date[1] + "-" + date[0];

        //Se ponen todos los valores en un objeto llamado data para enviarlos al api
        const data = {
            "rut": values.rutMedico,
            "nombre": values.nombre,
            "fecha": dateFormated,
            "exc_inc": values.exc_Inc,
            "codigoLista": props.codigoLista,
        }

        const resp = await addMedico(data, props.user)
        if (resp === 403) {
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

        setShowModalConfirmar(false);
        if (resp.response[0].codigo === 0) {
            props.showData();
        } else {
            setTitleAlert("Error")
            setMsjAlert("Ha ocurrido un error en la actualizacion de los datos")
            setShowModalAlert(true);
        };
    };

    const handleConfirmar = async () => {

        values.fechaDesde = values.fechaDesde.split("-").reverse().join("-");
        values.exc_Inc = values.exc_Inc.toUpperCase();
        if ((values.nombre === "" || values.nombre === null) ||
            (values.rutMedico === "" || values.rutMedico === null) ||
            (values.fechaDesde === "" || values.fechaDesde === null) ||
            (values.exc_Inc === "" || values.exc_Inc === null)
        ) {
            setTitleAlert("Error")
            setMsjAlert("Todos los campos deben contener datos")
            setShowModalAlert(true);
            setShowModalConfirmar(false);
        } else if (!checkDate(values.fechaDesde)) {
            setTitleAlert("Error")
            setMsjAlert("La fecha debe tener el formato DD-MM-YYYY")
            setShowModalAlert(true);
            setShowModalConfirmar(false);
        } else if (values.exc_Inc !== "E" && values.exc_Inc !== "I") {
            setTitleAlert("Error")
            setMsjAlert("El campo de exclusion/inclusion debe ser E o I")
            setShowModalAlert(true);
            setShowModalConfirmar(false);
        } else {
            //Change format of the date to send to the api to YYYY-MM-DD from DD-MM-YYYY
            const date = values.fechaDesde.split("-");
            const dateFormated = date[2] + "-" + date[1] + "-" + date[0];

            //Se ponen todos los valores en un objeto llamado data para enviarlos al api
            const data = {
                "rut": values.rutMedico,
                "nombre": values.nombre,
                "fecha": dateFormated,
                "exc_Inc": values.exc_Inc,
                "codigoLista": props.codigoLista,
            }

            const resp = await updateMedico(data, props.user)
            if (resp === 403) {
                setShowModalConfirmar(false);
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
            setShowModalConfirmar(false);

            if (resp.response[0].codigo === 0) {
                setTitleAlert("Exito")
                setMsjAlert(resp.response[0].detalle)
                tableData[row.index] = values;
                setTableData([...tableData]);
                setShowModalAlert(true);
            } else {
                setTitleAlert("Error")
                setMsjAlert("Ha ocurrido un error en la actualizacion de los datos")
                setShowModalAlert(true);
            };

        }
    }

    //Se crea la vairable con informacion de la data table
    const [tableData, setTableData] = useState(() => props.data)

    //Ingresar la informacion a la variable table apenas se incia el modulo
    useEffect(() => {
        setTableData(props.data);
    }, [])

    //Metodo para handle la edicion de informacion de la table
    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        setValues(values);
        setRow(row);
        if (!Object.keys(validationErrors).length) {
            setTitle("¿Desea continuar?")
            setMsj("Seleccione confirmar si desea editar el campo")
            setShowModalConfirmar(true)
            exitEditingMode();
        }
    };

    //Metodo para handle la cancelacion de la edicion de informacion de la table
    const handleCancelRowEdits = () => {

    };

    const downloadExcel = (rows) => {
        const newData = rows.map(row => {
            return getRows(row);
        })
        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "medicos")
        //Buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "Medicos.xlsx")
    }

    const handleEditRow = useCallback(
        (row, table) => {
            table.setEditingRow(row)
            setValues(row.original);
            // setShowModalRoles(true)
        },
        [tableData],
    );

    const getRows = (row) => {

        delete row.tableData;
        Object.entries(row.original).forEach(([key, value]) => {
            if (value === undefined) {
                row.original[key] = " ";
            }
        });

        row.original.fechaDesde = row.original.fechaDesde.replace(/-/g, "");

        const reorderedRow = {
            rutMedico: row.original.rutMedico,
            nombre: row.original.nombre,
            fechaDesde: row.original.fechaDesde,
            exc_Inc: row.original.exc_Inc,
            codigoLista: row.original.codigoLista
        };

        return reorderedRow;
    };


    const handleDeleteRow = useCallback(
        (row) => {
            setValues(row.original);
            setTitle("¿Desea continuar?")
            setMsj("Seleccione confirmar si desea eliminar el campo")
            setShowModalConfirmarDelete(true)
        },
        [tableData],
    );

    const handleConfirmarDelete = async () => {
        const data = {
            'codigoLista': props.codigoLista,
            'rut': values.rutMedico,
        }
        setLoading(true);
        setShowModalConfirmarDelete(false);
        const resp = await deleteMedico(data, props.user)
        if (resp === 403) {
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
        if (resp.response[0].codigo === 1) {
            const newData = tableData.filter(row => row.rutMedico !== values.rutMedico);
            setTitleAlert("Exito")
            setMsjAlert(resp.response[0].detalle)
            setShowModalAlert(true);
            setTableData(newData);
        } else {
            setTitleAlert("Error")
            setMsjAlert("Ha ocurrido un error en la eliminacion de los datos")
            setShowModalAlert(true);
        }
        setLoading(false);
    }

    const handleCloseConfirmarDelete = () => {
        setShowModalConfirmarDelete(false);
    }


    return (
        <>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}
                <div className="boxTable">
                    <MaterialReactTable
                        columns={columns}
                        data={tableData}
                        positionToolbarAlertBanner="bottom"
                        editingMode="modal"
                        enableEditing
                        onEditingRowCancel={handleCancelRowEdits}
                        onEditingRowSave={handleSaveRowEdits}
                        localization={MRT_Localization_ES}
                        renderRowActions={({ row, table }) => (
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <Tooltip arrow placement="left" title="Editar">
                                        <IconButton onClick={() => handleEditRow(row, table)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid xs={6}>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        )}
                        renderTopToolbarCustomActions={() => (
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                variant="contained"
                                disabled={props.isButtonDisabled}
                            >
                                + Agregar Medico
                            </Button>
                        )}
                        renderBottomToolbarCustomActions={({ table }) => (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>

                                <Button
                                    variant="contained"
                                    onClick={() => { downloadExcel(table.getPrePaginationRowModel().rows) }}
                                    disabled={props.isButtonDisabled}
                                >
                                    Exportar

                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => { setShowModalUpload(true) }}
                                    disabled={props.isButtonDisabled}
                                >
                                    Importar
                                </Button>
                            </div>

                        )}
                    />
                </div>
                <ModalConfirmar
                    title={title}
                    msj={msj}
                    show={showModalConfirmar}
                    handleClose={handleCloseConfirmar}
                    handleYes={handleConfirmar}
                />
                <ModalConfirmar
                    title={title}
                    msj={msj}
                    show={showModalConfirmarDelete}
                    handleClose={handleCloseConfirmarDelete}
                    handleYes={handleConfirmarDelete}
                />

                <ModalAlert title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />

                <ModalUploadFileMedicos
                    title={"Cargar datos masivos"}
                    msj={"Cargue el archivoxlsx con el cual desea actualizar los registros"}
                    show={showModalUpload}
                    handleClose={handleCloseUpload}
                    codigoLista={props.codigoLista}
                />
                <CreateNewAccountModal
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCreateNewRow}
                />
            </div>
        </>

    );
};


export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [showModalAlert, setShowModalAlert] = useState(false);
    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        values.nombre = "a"
        values.exc_Inc = values.exc_Inc.toUpperCase();
        //cheack if all values are not empty
        const allValuesAreNotEmpty = Object.values(values).every((value) => value !== '');
        if (!allValuesAreNotEmpty) {
            //Call modal alert to show error
            setTitleAlert("Error")
            setMsjAlert("Debe completar todos los campos")
            setShowModalAlert(true);
        } else if (!checkDate(values.fechaDesde)) {
            setTitleAlert("Error")
            setMsjAlert("La fecha debe tener el formato DD-MM-YYYY")
            setShowModalAlert(true);

        } else if (values.exc_Inc !== "E" && values.exc_Inc !== "I") {
            setTitleAlert("Error")
            setMsjAlert("El campo de exclusion/inclusion debe ser E o I")
            setShowModalAlert(true);

        } else {
            onSubmit(values);
            onClose();
            setValues(() =>
                columns.reduce((acc, column) => {
                    acc[column.accessorKey ?? ''] = '';
                    return acc;
                }, {}),
            );

        }



    };
    const bio = [
        {
            value: "I",
            label: "Inclusión",
        },
        {
            value: "E",
            label: "Exculsión",
        },
    ];


    return (
        <>
            <Dialog open={open} style={{ zIndex: 2 }}>
                <ModalAlert zIndex={99999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
                <DialogTitle textAlign="center">Crear medico</DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}


                        >
                            <InputLabel htmlFor="component-disabled">Rut Medico</InputLabel>
                            <TextField
                                key={"rutMedico"}
                                name={"rutMedico"}
                                variant="standard"
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                            <InputLabel htmlFor="component-disabled">Fecha Desde</InputLabel>
                            <TextField
                                key={"fechaDesde"}
                                name={"fechaDesde"}
                                type="date"
                                variant="standard"
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value.split("-").reverse().join("-") })
                                }
                            />
                            <InputLabel htmlFor="component-disabled">Exclusion/Inclusion</InputLabel>
                            <TextField
                                key={"exc_Inc"}
                                name={"exc_Inc"}
                                variant="standard"
                                select={true}
                                children={
                                    bio.map((state) => (
                                        <MenuItem key={state.value} value={state.value}>
                                            {state.label}
                                        </MenuItem>
                                    ))
                                }

                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }

                            />

                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmit} variant="contained">
                        Crear medico
                    </Button>
                </DialogActions>
            </Dialog>
        </>


    );
};
export default DataTableAutorizacionPrevia;
