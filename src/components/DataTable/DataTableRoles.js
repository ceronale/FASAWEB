import React, { useState, useCallback, useEffect } from "react";
import MaterialReactTable, {
    MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton, MRT_ToggleFiltersButton
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import ModalConfirmar from "../ModalConfirmar";
import { useNavigate } from "react-router-dom";
import ModalRoles from "../Modals/ModalRoles";

const DataTableRoles = props => {
    //Se crea la vairable con informacion de la data table
    const [tableData, setTableData] = useState(props.data)
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [showModalRoles, setShowModalRoles] = useState(false);
    const [values, setValues] = useState();
    const history = useNavigate();
    const [name, setName] = useState()
    const [description, setDescription] = useState()

    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

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
        (row) => {
            setLeft(["Polizas y Grupos", "Autorizaciones previas.", "Listar Medicos.", "Visualizar documentos", "Reporte de auditoria"]);
            setRight(["Cartola de beneficiarios", "Actualizar beneficiarios.", "Crear Cliente Empresa", "Listar - Eliminar Usuarios."]);
            setValues(row.original);
            console.log(row.original)
            setShowModalRoles(true)
        },
        [tableData],
    );

    const handleNuevoRol = () => {
        setValues([]);
        setShowModalRoles(true);
        setLeft(["Polizas y Grupos", "Autorizaciones previas.", "Listar Medicos.", "Visualizar documentos", "Reporte de auditoriaCartola de beneficiarios", "Actualizar beneficiarios.", "Crear Cliente Empresa", "Listar - Eliminar Usuarios."]);
        setRight([]);
    }

    //Modal Confirmar
    const handleConfirmar = async () => {
        tableData.splice(values.index, 1);
        setTableData([...tableData]);
        setShowModalConfirmar(false);
    }

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }
    const handleCloseModalRoles = () => {
        setShowModalRoles(false);
    }


    return (
        <>
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
                    : <ModalRoles
                        show={showModalRoles}
                        handleClose={handleCloseModalRoles}
                        name={values.rol}
                        description={values.descripcion}
                        propLeft={left} propRight={right}
                    />
            }



        </>
    );
};
export default DataTableRoles;
