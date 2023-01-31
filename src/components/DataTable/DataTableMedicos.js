import React, { useState, useEffect, useCallback } from "react";
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
import { set } from "react-hook-form";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
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

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }

    const handleCloseUpload = () => {
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
        setTitle("¿Desea continuar?")
        setMsj("Seleccione confirmar si desea editar el campo")
        setShowModalConfirmar(true)
        setValues(values);
        setRow(row);
        exitEditingMode();
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
        row.original.rutMedico = row.original.rutMedico || " ";
        row.original.fechaDesde = row.original.fechaDesde || " ";
        row.original.exc_Inc = row.original.exc_Inc || " ";
        return row.original;
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
                        columns={props.columns}
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
                                >
                                    Exportar

                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => { setShowModalUpload(true) }}
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
                    msj={"Cargue el archivo .csv con el cual desea actualizar los registros"}
                    show={showModalUpload}
                    handleClose={handleCloseUpload}
                    codigoLista={props.codigoLista}
                />
                <CreateNewAccountModal
                    columns={props.columns}
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
                            {columns.map((column) => (
                                column.header === "Nombre" ? null :
                                    <TextField
                                        key={column.accessorKey}
                                        label={column.header}
                                        name={column.accessorKey}
                                        variant="standard"
                                        onChange={(e) =>
                                            setValues({ ...values, [e.target.name]: e.target.value })
                                        }
                                    />
                            ))}
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
