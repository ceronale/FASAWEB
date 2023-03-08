import React, { useState, useEffect, useCallback } from "react";
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import "../../styles/PolizasGrupos.css";
import { updateBeneficiario } from "../../api/BeneficiarioService";
import ModalUploadFileBeneficiarios from "../Modals/ModalUploadFileBeneficiarios";
import * as XLSX from 'xlsx/xlsx.mjs';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { IconButton, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { Edit } from "@material-ui/icons";
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { useNavigate, } from 'react-router-dom';


const DataTableBeneficiarios = props => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    // State variables to handle form validation errors and loading state
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);


    // State variables for the modal
    const [title] = useState();
    const [msj] = useState();

    // State variables for the alert modal
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [showModalAlert, setShowModalAlert] = useState(false);

    // State variables for the upload file modal
    const [showModalUpload, setShowModalUpload] = useState(false);
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);

    // State variables for editing table data
    const [values, setValues] = useState({
        apellido1: "",
        apellido2: "",
        ciudad: "",
        codigoCarga: "",
        codigoConvenio: "",
        codigoRelacion: "",
        comuna: "",
        credenciales: "",
        direccion: "",
        fechaNacimiento: "",
        genero: "",
        grupo: "",
        id: "",
        mail: "",
        nombre: "",
        poliza: "",
        rutBeneficiario: "",
        rutTitular: "",
        termino: "",
        vigencia: "",
    });

    const [, setRow] = useState();


    // Handlers for closing modals
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

    // Confirm action in modal and execute update of table information
    const handleConfirmar = async () => {
        //TODO: Add update logic
    }


    const validateRequired = (value) => !!value.length;
    const validateEmail = (email) =>
        !!email.length &&
        email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );


    //validate that rut has at least 8 digits
    const validateRut = (rut) => {
        if (rut.length >= 8) {
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
                        cell.column.id === 'email'
                            ? validateEmail(event.target.value)
                            : cell.column.id === 'rutEmpresa'
                                ? validateRut(event.target.value)
                                : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid depending on column if bioequivalente must say 0 or 1

                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]:
                                cell.column.id === 'rutTitular' || cell.column.id === 'rutBeneficiario' ? `${cell.column.columnDef.header} el rut debe contener al menos 8 caracteres` :
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
            value: "1",
            label: "Masculino",
        },
        {
            value: "2",
            label: "Femenino",
        },
    ];
    const columns = [
        {
            accessorKey: 'codigoConvenio',
            header: 'Codigo de Convenio',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),
        },
        {
            accessorKey: 'grupo',
            header: 'Grupo',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),

        },
        {
            accessorKey: 'credenciales',
            header: 'Credenciales',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),

        },
        {
            accessorKey: 'rutTitular',
            header: 'Rut Titular',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),

        },
        {
            accessorKey: 'rutBeneficiario', header: 'Rut Beneficiario', size: 100, enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
            }),
        },
        {
            accessorKey: 'codigoCarga',
            header: 'Codigo de Carga',
            size: 100,

            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: {
                    maxLength: 3,
                    onKeyPress: (event) => {
                        const keyCode = event.which || event.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /[0-9]/;
                        if (!regex.test(keyValue)) {
                            event.preventDefault();
                        }
                    },
                },
            }),
        },
        {
            accessorKey: 'poliza',
            header: 'Poliza',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 15 },
                onKeyPress: (event) => {
                    const keyCode = event.which || event.keyCode;
                    const keyValue = String.fromCharCode(keyCode);
                    const regex = /[0-9]/;
                    if (!regex.test(keyValue)) {
                        event.preventDefault();
                    }
                },
            }),

        },
        {
            accessorKey: 'codigoRelacion',
            header: 'Codigo de Relacion',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 2 },
                onKeyPress: (event) => {
                    const keyCode = event.which || event.keyCode;
                    const keyValue = String.fromCharCode(keyCode);
                    const regex = /[0-9]/;
                    if (!regex.test(keyValue)) {
                        event.preventDefault();
                    }
                },
            }),
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 15 },
            }),
        },
        {
            accessorKey: 'apellido1',
            header: 'Apellido 1',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 20 },
            }),
        },
        {
            accessorKey: 'apellido2',
            header: 'Apellido 2',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 15 },
            }),
        },
        {
            accessorKey: 'fechaNacimiento',
            header: 'Fecha Nacimiento',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...getCommonEditTextFieldProps(cell),
                type: 'date',
                value: row.original.fechaNacimiento.split("-").reverse().join("-"),
                onChange: (event) => {
                    const { value } = event.target;
                    row.original.fechaNacimiento = value.split("-").reverse().join("-");
                },
            }),
        },
        {
            accessorKey: 'genero',
            header: 'Genero',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...getCommonEditTextFieldProps(cell),
                select: true,
                children: bio.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                        {state.label}
                    </MenuItem>
                )),
                value: row.original.genero === "Femenino" ? "2" : row.original.genero === "Masculino" ? "1" : null,
                onChange: (event) => {
                    const { value } = event.target;
                    row.original.genero = value === "2" ? "Femenino" : value === "1" ? "Masculino" : null;
                },
                inputProps: { maxLength: 1, pattern: '[0-1]' },
            }),
        },
        {
            accessorKey: 'vigencia',
            header: 'Vigencia',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...getCommonEditTextFieldProps(cell),
                type: 'date',
                value: row.original.vigencia.split("-").reverse().join("-"),
                onChange: (event) => {
                    const { value } = event.target;
                    row.original.vigencia = value.split("-").reverse().join("-");
                },
            }),
        },
        {
            accessorKey: 'termino',
            header: 'Termino',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
                ...getCommonEditTextFieldProps(cell),
                type: 'date',
                value: row.original.termino.split("-").reverse().join("-"),
                onChange: (event) => {
                    const { value } = event.target;
                    row.original.termino = value.split("-").reverse().join("-");
                },
            }),
        },

        {
            accessorKey: 'mail',
            header: 'Correo Electronico',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 80 },
            }),
        },
        {
            accessorKey: 'direccion',
            header: 'Direccion',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 60 },
            }),
        },

        {
            accessorKey: 'comuna',
            header: 'Comuna',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 20 },
            }),
        },
        {
            accessorKey: 'ciudad',
            header: 'Ciudad',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                ...getCommonEditTextFieldProps(cell),
                inputProps: { maxLength: 20 },
            }),
        },

    ]

    // Initialize the tableData state variable with the data passed in as props
    const [tableData, setTableData] = useState(() => props.data)

    // Use the useEffect hook to set the tableData state variable with the data passed in as props when the component mounts
    useEffect(() => {
        setTableData(props.data);
    }, [])


    const handleEditDate = async (values) => {
        setLoading(true);
        let valuesCopy = { ...values };

        // Format date and gender fields to match API requirements
        values.fechaNacimiento = values.fechaNacimiento.split("-").reverse().join("");
        values.vigencia = values.vigencia.split("-").reverse().join("");
        values.termino = values.termino.split("-").reverse().join("");
        if (values.rutBeneficiario && values.rutBeneficiario.replace) {
            values.rutBeneficiario = values.rutBeneficiario.replace(/[^0-9]/g, '');
        }

        if (values.rutTitular && values.rutTitular.replace) {
            values.rutTitular = values.rutTitular.replace(/[^0-9]/g, '');
        }

        if (values.genero === "Masculino" || values.genero === "masculino") {
            values.genero = 1;
        } else if (values.genero === "Femenino" || values.genero === "femenino") {
            values.genero = 2;
        }
        if (values.genero === "M" || values.genero === "m") {
            values.genero = 1;
        } else if (values.genero === "F" || values.genero === "f") {
            values.genero = 2;
        }

        try {
            // Make API call to update beneficiario
            const response = await updateBeneficiario(values, props.user.correo);
            if (response === 403) {
                setShowModalAlert(true)
                setTitleAlert("Sesión expirada")
                setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
                //set time out to logout of 5 seconds
                setTimeout(() => {
                    localStorage.removeItem("user");
                    navigate(`/`);
                }, 3000);
                return;
            }
            // Handle network error
            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                setLoading(false);
                setTitleAlert("Error")
                setMsjAlert("Error de conexión")
                setShowModalAlert(true);
            } else {
                setLoading(false);
            }
            // Handle successful update
            if (response.actualizaResponse[0].codigoError === 0) {
                setTitleAlert("Éxito")
                setMsjAlert("Beneficiario actualizado correctamente")
                setShowModalAlert(true);
                tableData[rows.index] = valuesCopy;
                setTableData([...tableData]);
            } else {
                setTitleAlert("Error")
                setMsjAlert("Error al actualizar beneficiario");
                setShowModalAlert(true);
            }
        } catch (error) {

            setLoading(false);
            setTitleAlert("Error")
            setMsjAlert("Error al actualizar beneficiario");
            setShowModalAlert(true);
        }
    };
    // Method to handle editing of table data
    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        setLoading(true);
        setValues(values);
        setRow(row);
        if (!Object.keys(validationErrors).length) {
            //create a  variable to store the values of values to do not change the original values
            let valuesCopy = { ...values };
            setShowModalConfirmar(false);


            if (valuesCopy.genero === "1") {
                valuesCopy.genero = "Masculino";
            } else if (valuesCopy.genero === "2") {
                valuesCopy.genero = "Femenino";
            }

            if (values.genero === "Masculino" || values.genero === "masculino") {
                values.genero = 1;
            } else if (values.genero === "Femenino" || values.genero === "femenino") {
                values.genero = 2;
            }

            if (values.genero === "M" || values.genero === "m") {
                values.genero = 1;
            } else if (values.genero === "F" || values.genero === "f") {
                values.genero = 2;
            }

            valuesCopy.fechaNacimiento = values.fechaNacimiento.split("-").reverse().join("-");
            valuesCopy.vigencia = values.vigencia.split("-").reverse().join("-");
            valuesCopy.termino = values.termino.split("-").reverse().join("-");


            // Format date and gender fields to match API requirements
            values.fechaNacimiento = values.fechaNacimiento.replace(/-/g, "");
            values.vigencia = values.vigencia.replace(/-/g, "");
            values.termino = values.termino.replace(/-/g, "");


            if (values.rutBeneficiario && values.rutBeneficiario.replace) {
                values.rutBeneficiario = values.rutBeneficiario.replace(/[^0-9]/g, '');
            }



            if (values.rutTitular && values.rutTitular.replace) {
                values.rutTitular = values.rutTitular.replace(/[^0-9]/g, '');
            }

            //add a try and catch to handle the error
            try {
                // Make API call to update beneficiario
                const response = await updateBeneficiario(values, props.user.correo);
                if (response === 403) {
                    setShowModalAlert(true)
                    setTitleAlert("Sesión expirada")
                    setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")

                    //set time out to logout of 5 seconds
                    setTimeout(() => {
                        localStorage.removeItem("user");
                        navigate(`/`);
                    }, 3000);
                    return;
                }
                // Handle network error
                if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                    setLoading(false);
                    setTitleAlert("Error")
                    setMsjAlert("Error de conexión")
                    setShowModalAlert(true);
                } else {
                    setLoading(false);
                }

                // Handle successful update
                if (response.actualizaResponse[0].codigoError === 0) {
                    setTitleAlert("Éxito")
                    setMsjAlert("Beneficiario actualizado correctamente")
                    setShowModalAlert(true);
                    tableData[row.index] = valuesCopy;
                    setTableData([...tableData]);
                } else {
                    setTitleAlert("Error")
                    setMsjAlert("Error al actualizar beneficiario");
                    setShowModalAlert(true);
                }

            } catch (error) {
                setLoading(false);
                setTitleAlert("Error")
                setMsjAlert("Error al actualizar beneficiario");
                setShowModalAlert(true);
            }

            exitEditingMode();
        }
    };

    // Method to handle canceling row edits
    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const downloadExcel = (rows) => {
        const newData = rows.map(row => {
            return getRows(row);
        })
        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "polizas")
        //Buffer
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "Beneficiarios.xlsx")
    }


    const getRows = (row) => {
        delete row.tableData;
        Object.entries(row.original).forEach(([key, value]) => {
            if (value === undefined) {
                row.original[key] = " ";
            }
        });

        // format row.original.fechaNacimiento and row.original.vigencia and row.original.termino 
        row.original.fechaNacimiento = row.original.fechaNacimiento.replace(/-/g, "");
        row.original.vigencia = row.original.vigencia.replace(/-/g, "");
        row.original.termino = row.original.termino.replace(/-/g, "");



        const reorderedRow = {
            codigoConvenio: row.original.codigoConvenio,
            grupo: row.original.grupo,
            credenciales: row.original.credenciales,
            rutTitular: row.original.rutTitular,
            rutBeneficiario: row.original.rutBeneficiario,
            codigoCarga: row.original.codigoCarga,
            poliza: row.original.poliza,
            codigoRelacion: row.original.codigoRelacion,
            nombre: row.original.nombre,
            apellido1: row.original.apellido1,
            apellido2: row.original.apellido2,
            fechaNacimiento: row.original.fechaNacimiento,
            genero: row.original.genero,
            vigencia: row.original.vigencia,
            termino: row.original.termino,
            mail: row.original.mail,
            direccion: row.original.direccion,
            comuna: row.original.comuna,
            ciudad: row.original.ciudad,
            id: row.original.id
        };

        return reorderedRow;
    };

    // Metodo para eliminar
    const handleDeleteRow = useCallback(
        (row, table) => {
            setRows(row);
            setValues(row.original);

            setCreateModalOpen(true)
        },
        [tableData],
    );

    const handleEditRow = useCallback(
        (row, table) => {
            table.setEditingRow(row)
            setValidationErrors({});
            setValues(row.original);
        },
        [tableData],
    );


    return (
        <>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999999' }}>
                        <CircularProgress />
                    </div>
                )}
                <ModalAlert zIndex={9999999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
                <div className="boxTable">

                    {tableData === undefined ? null :
                        <MaterialReactTable
                            zIndex={5}
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
                                            <IconButton color="error" onClick={() => handleDeleteRow(row, table)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
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
                    }
                </div>

                <ModalConfirmar
                    title={title}
                    msj={msj}
                    show={showModalConfirmar}
                    handleClose={handleCloseConfirmar}
                    handleYes={handleConfirmar}
                />

                <ModalUploadFileBeneficiarios
                    title={"Cargar datos masivos"}
                    msj={"Cargue el archivo xlx con el cual desea actualizar los registros"}
                    show={showModalUpload}
                    handleClose={handleCloseUpload}
                    convenio={props.convenio}
                />
                {createModalOpen && <CreateNewAccountModal
                    columns={props.columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleEditDate}
                    allValues={values}
                />
                }
            </div>
        </>
    );

};

export const CreateNewAccountModal = ({ allValues, open, onClose, onSubmit }) => {
    const [titleAlert, setTitleAlert] = useState();
    const [msjAlert, setMsjAlert] = useState();
    const [values] = useState(allValues);
    const [showModalAlert, setShowModalAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }


    const parts = values.termino.split('-');
    const datex = new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
    const [date, setDate] = useState(datex);

    const handleSubmit = () => {
        var dd = String(date.$d.getDate()).padStart(2, '0');
        var mm = String(date.$d.getMonth() + 1).padStart(2, '0');
        var yyyy = date.$d.getFullYear();
        values.termino = dd + '-' + mm + '-' + yyyy;
        if (values.termino === "") {
            setTitleAlert("Error")
            setMsjAlert("La fecha no puede estar vacia")
            setShowModalAlert(true);
        } else {
            setLoading(true);
            onSubmit(values);
            onClose();
        }
    }


    return (
        <>
            <Dialog open={open} style={{ zIndex: 2 }}>

                <ModalAlert zIndex={99999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
                <DialogTitle textAlign="center">Actualizar fecha termino</DialogTitle>
                <DialogContent>


                    <form onSubmit={(e) => e.preventDefault()}>

                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                                gap: '1.5rem',
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                {loading && (
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999999' }}>
                                        <CircularProgress />
                                    </div>
                                )}
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DatePicker
                                        value={date}
                                        sx={{ width: '100%' }}
                                        onChange={(e) => {
                                            setDate(e)
                                        }}
                                        renderInput={(params) => <TextField fullWidth  {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>
                        </Stack>

                    </form>

                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmit} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>

            </Dialog >
        </>
    );
};

export default DataTableBeneficiarios;
