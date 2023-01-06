import React, { useState, useCallback } from "react";
import MaterialReactTable, {
  MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton, MRT_ToggleFiltersButton
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { EliminarUsuario } from "../../api/EliminarUsuario";
import ModalConfirmar from "../ModalConfirmar";
import { useNavigate } from "react-router-dom";

const DataTableDeleteAndExport = props => {
  //Se crea la vairable con informacion de la data table
  const [tableData, setTableData] = useState(props.data)
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [values, setValues] = useState();
  const history = useNavigate();

  //Opciones de la creacion de csv
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: props.columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  // Metodo para exportar
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };
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

  //Modal Confirmar
  const handleConfirmar = async () => {
    const resp = await EliminarUsuario(values.original.correo)
    tableData.splice(values.index, 1);
    setTableData([...tableData]);
    setShowModalConfirmar(false);
    console.log(resp)
  }

  const handleCloseConfirmar = () => {
    setShowModalConfirmar(false);
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
        renderRowActions={({ row, table }) => (
          <Box>
            {(props.delete)
              ?
              <Tooltip title="Eliminar">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
              :
              null}
          </Box>
        )}

        renderToolbarInternalActions={({ table }) => (
          <>
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            {(props.export)
              ?
              <Tooltip title="Exportar">
                <IconButton onClick={() => { handleExportRows(table.getPrePaginationRowModel().rows); }}>
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
              : null}
            <MRT_FullScreenToggleButton table={table} />
          </>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>

            <Button
              variant="contained"
              color="primary"
              onClick={() => { history("/NuevoClienteEmpresa"); }}
            >
              + Agregar Usuario
            </Button>
          </div>

        )}
      />

    </>
  );
};
export default DataTableDeleteAndExport;
