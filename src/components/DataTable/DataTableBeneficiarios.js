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
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
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


const DataTableBeneficiarios = props => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [rows, setRows] = useState([]);

    // State variables to handle form validation errors and loading state
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasValidationError, setHasValidationError] = useState(false);

    // State variables for the modal
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();

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
        setShowModalUpload(false);
    }
    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }

    // Confirm action in modal and execute update of table information
    const handleConfirmar = async () => {
        //TODO: Add update logic
    }

    // Function to format the RUT (Chilean ID number)
    const formatRut = (rut) => {
        rut = "" + rut; // Convert to string
        // Remove non-numeric characters
        rut = rut.replace(/[^\dkK]/g, '');
        if (rut.length < 2) return rut;
        // Add dots between the 5th and 6th digit
        rut = rut.replace(/^([\d]{1,2})([\d]{3})([\d]{3})([\dkK])$/, '$1.$2.$3-$4');
        return rut;
    };

    // Regular expression for date format
    const dateFormat = /^\d{2}-\d{2}-\d{4}$/;


    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.id,
                helperText: validationErrors.id,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, id: 'ID es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.id;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'rutBeneficiario', header: 'Rut Beneficiario', size: 100, enableEditing: false, muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.rutBeneficiario, helperText: validationErrors.rutBeneficiario, value: formatRut(values.rutBeneficiario),
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, rutBeneficiario: 'Rut Beneficiario es requerido' }));
                        setHasValidationError(true);
                    } else if (value.length > 12) {
                        setValidationErrors((prev) => ({ ...prev, rutBeneficiario: 'Rut Beneficiario debe tener maximo 12 caracteres' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.rutBeneficiario;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                    setValues((prev) => ({ ...prev, rutBeneficiario: value }));
                },
            },
        },
        {
            accessorKey: 'apellido1',
            header: 'Apellido Paterno',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.apellido1,
                helperText: validationErrors.apellido1,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, apellido1: 'Apellido Paterno es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.apellido1;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },


        },
        {
            accessorKey: 'apellido2',
            header: 'Apellido Materno',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.apellido2,
                helperText: validationErrors.apellido2,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, apellido2: 'Apellido Materno es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.apellido2;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.nombre,
                helperText: validationErrors.nombre,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, nombre: 'Nombre es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.nombre;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'genero',
            header: 'Genero',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.genero,
                helperText: validationErrors.genero,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, genero: 'Genero es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.genero;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'direccion',
            header: 'Direccion',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.direccion,
                helperText: validationErrors.direccion,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, direccion: 'Direccion es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.direccion;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'fechaNacimiento',
            header: 'Fecha Nacimiento',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.fechaNacimiento,
                helperText: validationErrors.fechaNacimiento,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, fechaNacimiento: 'Fecha Nacimiento es requerido' }));
                        setHasValidationError(true);
                    } else {
                        var dateFormat = /^\d{2}-\d{2}-\d{4}$/;
                        if (!value.match(dateFormat)) {
                            setValidationErrors((prev) => ({ ...prev, fechaNacimiento: 'Formato de fecha no válido, debe ser DD-MM-YYYY' }));
                            setHasValidationError(true);
                        } else {
                            delete validationErrors.fechaNacimiento;
                            setValidationErrors({ ...validationErrors });
                            setHasValidationError(false);
                        }
                    }
                },
            },
        },
        {
            accessorKey: 'comuna',
            header: 'Comuna',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.comuna,
                helperText: validationErrors.comuna,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, comuna: 'Comuna es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.comuna;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'ciudad',
            header: 'Ciudad',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.ciudad,
                helperText: validationErrors.ciudad,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, ciudad: 'Ciudad es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.ciudad;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },


        },
        {
            accessorKey: 'codigoCarga',
            header: 'Codigo de Carga',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.codigoCarga,
                helperText: validationErrors.codigoCarga,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, codigoCarga: 'Codigo de Carga es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.codigoCarga;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'codigoConvenio',
            header: 'Codigo de Convenio',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.codigoConvenio,
                helperText: validationErrors.codigoConvenio,

                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, codigoConvenio: 'Codigo de Convenio es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.codigoConvenio;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'codigoRelacion',
            header: 'Codigo de Relacion',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.codigoRelacion,
                helperText: validationErrors.codigoRelacion,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, codigoRelacion: 'Codigo de Relacion es requerido' }));
                        setHasValidationError(true);
                    } else if (value < 1 || value > 4) {
                        setValidationErrors((prev) => ({ ...prev, codigoRelacion: 'Codigo de Relacion debe estar entre 1 y 4' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.codigoRelacion;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },

            },


        },
        {
            accessorKey: 'credenciales',
            header: 'Credenciales',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.credenciales,
                helperText: validationErrors.credenciales,

                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, credenciales: 'Credenciales es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.credenciales;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'grupo',
            header: 'Grupo',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.grupo,
                helperText: validationErrors.grupo,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, grupo: 'Grupo es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.grupo;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },

        {
            accessorKey: 'mail',
            header: 'Correo Electronico',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.mail,
                helperText: validationErrors.mail,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, mail: 'Correo Electronico es requerido' }));
                        setHasValidationError(true);
                    } else {
                        // RegEx to check if email is in correct format
                        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!emailRegex.test(value)) {
                            setValidationErrors((prev) => ({ ...prev, mail: 'Correo Electronico no es valido' }));
                            setHasValidationError(true);
                        } else {
                            delete validationErrors.mail;
                            setValidationErrors({ ...validationErrors });
                            setHasValidationError(false);
                        }
                    }
                },
            },
        },
        {
            accessorKey: 'poliza',
            header: 'Poliza',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.poliza,
                helperText: validationErrors.poliza,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, poliza: 'Poliza es requerido' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.poliza;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'rutTitular',
            header: 'Rut Titular',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.rutTitular,
                helperText: validationErrors.rutTitular,
                value: formatRut(values.rutTitular),

                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, rutTitular: 'Rut Titular es requerido' }));
                        setHasValidationError(true);
                    } else if (value.length > 12) {
                        setValidationErrors((prev) => ({ ...prev, rutTitular: 'Rut Titular debe tener maximo 12 caracteres' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.rutTitular;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },

        },
        {
            accessorKey: 'termino',
            header: 'Termino',
            size: 100,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.termino,
                helperText: validationErrors.termino,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, termino: 'Termino es requerido' }));
                        setHasValidationError(true);
                    } else if (!dateFormat.test(value)) {
                        setValidationErrors((prev) => ({ ...prev, termino: 'Termino debe tener el formato DD-MM-YYYY' }));
                        setHasValidationError(true);
                    } else {
                        delete validationErrors.termino;
                        setValidationErrors({ ...validationErrors });
                        setHasValidationError(false);
                    }
                },
            },
        },
        {
            accessorKey: 'vigencia',
            header: 'Vigencia',
            size: 100,
            enableEditing: false,
            muiTableBodyCellEditTextFieldProps: {
                error: !!validationErrors.vigencia,
                helperText: validationErrors.vigencia,
                onChange: (event) => {
                    const value = event.target.value;
                    if (!value) {
                        setValidationErrors((prev) => ({ ...prev, vigencia: 'Vigencia es requerido' }));
                        setHasValidationError(true);
                    } else {
                        var dateFormat = /^\d{2}-\d{2}-\d{4}$/;
                        if (!value.match(dateFormat)) {
                            setValidationErrors((prev) => ({ ...prev, vigencia: 'Formato de fecha no válido, debe ser DD-MM-YYYY' }));
                            setHasValidationError(true);
                        } else {
                            delete validationErrors.vigencia;
                            setValidationErrors({ ...validationErrors });
                            setHasValidationError(false);
                        }
                    }
                },
            },
        },
    ];


    // Initialize the tableData state variable with the data passed in as props
    const [tableData, setTableData] = useState(() => props.data)

    // Use the useEffect hook to set the tableData state variable with the data passed in as props when the component mounts
    useEffect(() => {
        setTableData(props.data);
    }, [])


    const handleEditDate = async (values) => {
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
            console.log(response);

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
            console.log(error);
            setLoading(false);
            setTitleAlert("Error")
            setMsjAlert("Error al actualizar beneficiario");
            setShowModalAlert(true);
        }
    };
    // Method to handle editing of table data
    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        setValues(values);
        setRow(row);
        if (!hasValidationError) {
            setLoading(true);
            setShowModalConfirmar(false);
            //create a  variable to store the values of values to do not change the original values
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


            //add a try and catch to handle the error

            try {

                // Make API call to update beneficiario
                const response = await updateBeneficiario(values, props.user.correo);
                console.log(response);

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
                console.log(error);
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

        return row.original;
    };

    // Metodo para eliminar
    const handleDeleteRow = useCallback(
        (row, table) => {
            setRows(row);
            setValues(row.original);
            console.log(values);
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
        <>        <div style={{ position: 'relative' }}>
            {loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                    <CircularProgress />
                </div>
            )}
            <ModalAlert zIndex={99999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
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
    const [values, setValues] = useState(allValues);
    const [showModalAlert, setShowModalAlert] = useState(false);
    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }
    console.log(values.termino)

    const parts = values.termino.split('-');
    const datex = new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
    const [date, setDate] = useState(datex);
    console.log(date);
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

export default DataTableBeneficiarios;
