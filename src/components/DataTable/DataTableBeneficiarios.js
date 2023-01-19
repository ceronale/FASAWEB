import React, { useState, useEffect, useCallback } from "react";
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import "../../styles/PolizasGrupos.css";
import { updateBeneficiario } from "../../api/BeneficiarioService";
import ModalUploadFile from "../Modals/ModalUploadFile";
import * as XLSX from 'xlsx/xlsx.mjs';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2


import { Box, IconButton, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { Edit } from "@material-ui/icons";
import CircularProgress from '@mui/material/CircularProgress';




const DataTableBeneficiarios = props => {



    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [loading, setLoading] = useState(false);


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

    //Edit table variables
    const [values, setValues] = useState();
    const [row, setRow] = useState();

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }

    const handleCloseUpload = () => {
        setShowModalUpload(false);
    }

    const handleCloseAlert = () => {
        setShowModalAlert(false);
    }
    //Confirma la accion del modal y ejecuta update de la informacion de la tabla 
    const handleConfirmar = async () => {

        const isEmpty = ({
            apellido1,
            apellido2,
            codigoCarga,
            codigoConvenio,
            fechaNacimiento,
            genero,
            grupo,
            mail,
            nombre,
            poliza,
            rutBeneficiario,
            termino,
            vigencia
        }) => !apellido1 || !apellido2 || !codigoCarga || !codigoConvenio || !fechaNacimiento || !genero || !grupo || !mail || !nombre || !poliza || !rutBeneficiario || !termino || !vigencia;

        if (isEmpty(values)) {
            setTitleAlert("Error")
            setMsjAlert("Todos los campos deben contener datos")
            setShowModalAlert(true);
            setShowModalConfirmar(false);
        } else {
            setLoading(true);
            setShowModalConfirmar(false);
            const response = await updateBeneficiario(values, props.user.correo);
            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                console.log("Error de conexión");
                setLoading(false);
                setTitleAlert("Error")
                setMsjAlert("Error de conexión")
                setShowModalAlert(true);
            } else {
                setLoading(false);
                // setDataTable(undefined)
                // setDataTable(response.response);
            }
            // if (response1[0].codigoRespuesta === 0) {
            //     setTitleAlert("Exito")
            //     setMsjAlert(response1[0].detalleRespuest)
            //     tableData[row.index] = values;
            //     setTableData([...tableData]);
            //     setShowModalAlert(true);
            // } else {
            //     setTitleAlert("Error")
            //     setMsjAlert("Ha ocurrido un error en la actualizacion de los datos")
            //     setShowModalAlert(true);
            // }
        }


    }
    const columns = [
        {
            accessorKey: 'rutBeneficiario',
            header: 'Rut',
            size: 20,
        },
        {
            accessorKey: 'codigoCarga',
            header: 'Codigo Carga',
            size: 100,
        },
        {
            accessorKey: 'codigoConvenio',
            header: 'Codigo Convenio',
            size: 100,
        },
        {
            accessorKey: 'grupo',
            header: 'Grupo',
            size: 100,
        },
        {
            accessorKey: 'poliza',
            header: 'Poliza',
            size: 200,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            size: 200,

        },
        {
            accessorKey: 'apellido1',
            header: 'Apellido',
            size: 120,
        },
        {
            accessorKey: 'apellido2',
            header: 'Materno',
            size: 120,
        },
        {
            accessorKey: 'vigencia',
            header: 'Vigencia',
            enableEditing: false,
            size: 120,
        },
        {
            accessorKey: 'termino',
            header: 'Termino',
            size: 120,
        },
        {
            accessorKey: 'genero',
            header: 'Genero',
            size: 120,
        },
        {
            accessorKey: 'fechaNacimiento',
            header: 'Fecha de nacimiento',
            size: 120,
        },
        {
            accessorKey: 'mail',
            header: 'Correo',
            size: 120,
        },
    ];
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
        console.log('');
    };

    const downloadExcel = (rows) => {
        const newData = rows.map(row => {
            return getRows(row);
        })
        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "polizas")
        //Buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "Polizas.xlsx")
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
        (row) => {
            setValues(row);
            console.log(row);
            setTitle("¿Desea continuar?")
            setMsj("Seleccione confirmar si desea eliminar el campo")
            setShowModalConfirmar(true)
        },
        [tableData],
    );
    const handleEditRow = useCallback(
        (row, table) => {
            table.setEditingRow(row)
            setValues(row.original);
            console.log(row.original)
            // setShowModalRoles(true)
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
            <ModalAlert title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />

            <ModalUploadFile
                title={"Cargar datos masivos"}
                msj={"Cargue el archivo xlx con el cual desea actualizar los registros"}
                show={showModalUpload}
                handleClose={handleCloseUpload}
            />
        </div>
        </>
    );

};
export default DataTableBeneficiarios;
