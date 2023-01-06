import React, { useState, useEffect } from "react";
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import ModalConfirmar from "../ModalConfirmar";
import ModalTest from "../ModalTest";


import { MRT_Localization_ES } from 'material-react-table/locales/es';
import "../../styles/PolizasGrupos.css";
import { updateMedico } from "../../api/Medicos";
import ModalUploadFileMedicos from "../Modals/ModalUploadFileMedicos";
import * as XLSX from 'xlsx/xlsx.mjs';


const DataTableMedicos = props => {
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
        console.log(values);
        if ((values.nombre === "" || values.nombre === null) ||
            (values.rutMedico === "" || values.rutMedico === null) ||
            (values.fechaDesde === "" || values.fechaDesde === null) ||
            (values.exc_Inc === "" || values.exc_Inc === null)
        ) {
            setTitleAlert("Error")
            setMsjAlert("Todos los campos deben contener datos")
            setShowModalAlert(true);
            setShowModalConfirmar(false);

        } else {

            //Se ponen todos los valores en un objeto llamado data para enviarlos al api
            const data = {
                "rut": values.rutMedico,
                "nombre": values.nombre,
                "fecha": values.fechaDesde,
                "exc_Inc": values.exc_Inc,
                "codigoLista": props.codigoLista,
                "operacion": " "
            }

            const resp = await updateMedico(data, props.user)
            console.log(resp);
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
        console.log('');
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


    const getRows = (row) => {
        delete row.tableData;
        row.original.rutMedico = row.original.rutMedico || " ";
        row.original.fechaDesde = row.original.fechaDesde || " ";
        row.original.exc_Inc = row.original.exc_Inc || " ";
        return row.original;
    };

    return (
        <>
            <div className="boxTable">
                <MaterialReactTable
                    columns={props.columns}
                    data={tableData}
                    positionToolbarAlertBanner="bottom"
                    editingMode="row"
                    enableEditing
                    onEditingRowCancel={handleCancelRowEdits}
                    onEditingRowSave={handleSaveRowEdits}
                    localization={MRT_Localization_ES}
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

            <ModalTest title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />

            <ModalUploadFileMedicos
                title={"Cargar datos masivos"}
                msj={"Cargue el archivo .csv con el cual desea actualizar los registros"}
                show={showModalUpload}
                handleClose={handleCloseUpload}
            />

        </>
    );
};
export default DataTableMedicos;
