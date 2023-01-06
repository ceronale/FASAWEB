import React, { useState, useCallback } from "react";
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

const DataTableUsuarioRoles = props => {
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
            setValues(row.original);
            console.log(row.original)
            setShowModalRoles(true)
        },
        [tableData],
    );

    //Modal Confirmar
    const handleConfirmar = async () => {
        console.log("Se elimina xd")
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
                            onClick={() => { console.log("Creamos nuevo usuario") }}>
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
                        description={values.Descripcion}
                        left={props.left} right={props.right}
                    />
            }



        </>
    );
};
export default DataTableUsuarioRoles;
