import React, { useState, useCallback, useEffect } from "react";
import MaterialReactTable, {
  MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton, MRT_ToggleFiltersButton
} from 'material-react-table';
import Delete from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { EliminarUsuario } from "../../api/EliminarUsuario";
import ModalConfirmar from "../Modals/ModalConfirmar";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ModalAlert from "../Modals/ModalAlert";
import { Box, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, FormControl, TextField, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { getRoles, getComponentesAndRolByUser, setUserAndRol, updateUserAndRol } from "../../api/RolesServices";



const DataTableDeleteAndExport = props => {
  //Se crea la vairable con informacion de la data table
  const [tableData, setTableData] = useState(props.data)
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [values, setValues] = useState();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  //Vairables for modalAlert
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState();
  const [msjModal, setMsjModal] = useState();
  const [rolModalOpen, setRolModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const handleClose = () => {
    setShowModal(false);
  }

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
      setMsj("Seleccione confirmar si desea eliminar el usuario")
      setShowModalConfirmar(true)
    },
    [tableData],
  );

  //Modal Confirmar
  const handleConfirmar = async () => {
    setLoading(true);
    const resp = await EliminarUsuario(values.original.correo, props.usuario)

    if (resp === 403) {
      setShowModal(true)
      setTitleModal("Sesión expirada")
      setMsjModal("Su sesión ha expirado, por favor vuelva a ingresar")
      //set time out to logout of 5 seconds
      setTimeout(() => {
        localStorage.removeItem("user");
        navigate(`/`);
      }, 5000);
      return;
    }

    if (resp.eliminar[0].codigoRespuesta === 0) {
      setTitleModal("Exito");
      setMsjModal("El usuario se ha eliminado correctamente");
      setShowModal(true);
      tableData.splice(values.index, 1);
      setTableData([...tableData]);
    } else {
      setTitleModal("Error al eliminar");
      setMsjModal("Ha ocurrido un error al eliminar el usuario");
      setShowModal(true);
    }
    setLoading(false);
    setShowModalConfirmar(false);
  }

  const handleEditRol = useCallback(
    (row) => {
      setLoading(true);
      getComponentesAndRolByUser(row.original.id).then((response) => {
        if (!response.rolUsuario[0].codigo) {
          row.original.id_rol = response.rolUsuario[0].id_rol
        }
        setValues(row.original);
        setRolModalOpen(true);
        setLoading(false);
      }).catch(() => {
        setTitle("Error");
        setMsj("Error al obtener los roles");
        setShowModal(true);
        setLoading(false);
      });

    },
    [tableData],
  );


  const handleCloseConfirmar = () => {
    setShowModalConfirmar(false);
  }

  //metodo para abrir un modal de exito el usuario se ha actualizado correctamente
  const handleOpenModal = () => {
    setTitleModal("Exito");
    setMsjModal("El usuario se ha actualizado correctamente");
    setShowModal(true);
    setRolModalOpen(false);
  }


  useEffect(() => {
    getRoles().then((response) => {
      if (response === 403) {
        setShowModal(true)
        setTitleModal("Sesión expirada")
        setMsjModal("Su sesión ha expirado, por favor vuelva a ingresar")
        //set time out to logout of 5 seconds
        setTimeout(() => {
          localStorage.removeItem("user");
          navigate(`/`);
        }, 5000);
        return;
      }

      let rolFormat = response.roles.map((rol) => {
        return { value: rol.id_rol, label: rol.nombre };
      });
      setRoles(rolFormat);
      setLoading(false);
    }).catch(() => {
      setTitle("Error");
      setMsj("Error al obtener los roles");
      setShowModal(true);
      setLoading(false);
    });
  }, []);


  return (
    <>
      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
            <CircularProgress />
          </div>
        )}
        <ModalAlert
          title={titleModal}
          msj={msjModal}
          show={showModal}
          handleClose={handleClose} />

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
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Tooltip arrow placement="left" title="Editar">
                    <IconButton onClick={() => handleEditRol(row, table)}>
                      <PersonIcon />
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
        {rolModalOpen && <SetRoleModal
          open={rolModalOpen}
          onClose={() => setRolModalOpen(false)}
          allValues={values}
          roles={roles}
          handleOpenModal={handleOpenModal}
        />
        }
      </div>
    </>
  );
};


export const SetRoleModal = ({ open, onClose, allValues, roles, handleOpenModal }) => {
  const [titleAlert, setTitleAlert] = useState();
  const [msjAlert, setMsjAlert] = useState();
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [value] = useState(allValues);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rol, setRol] = useState(roles.filter(function (item) {
    if (allValues.id_rol) {
      return item.value === allValues.id_rol;
    } else {
      return ''
    }
  })[0]);

  const handleCloseAlert = () => {
    setShowModalAlert(false);
  }

  const handleSubmit = () => {

    //create a variable call data and asing the value rol and id usuario
    setLoading(true);
    if (!value.id_rol) {

      let data = {
        id_rol: rol.value,
        id_usuario: value.id
      }
      //call the api and send the data setUserAndRol
      setUserAndRol(data).then((response) => {
        if (response === 403) {
          setTitleAlert("Sesión expirada")
          setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
          setShowModalAlert(true);

          //set time out to logout of 5 seconds
          setTimeout(() => {
            localStorage.removeItem("user");
            navigate(`/`);
          }, 5000);
          return;
        }

        if (response.response1[0].codigo === 1) {
          handleOpenModal();
        } else {
          setTitleAlert("Error");
          setMsjAlert("Error al actualizar el usuario");
          setShowModalAlert(true);
          setLoading(false);
        }

      }).catch(() => {
        setTitleAlert("Error");
        setMsjAlert("Error al actualizar el usuario");
        setShowModalAlert(true);
      });
    } else {
      let data = {
        id_rol: value.id_rol,
        id_usuario: value.id,
        id_rolNuevo: rol.value
      }
      //call the api and send the data updateUserAndRol
      updateUserAndRol(data).then((response) => {
        if (response === 403) {
          setTitleAlert("Sesión expirada")
          setMsjAlert("Su sesión ha expirado, por favor vuelva a ingresar")
          setShowModalAlert(true)
          //set time out to logout of 5 seconds
          setTimeout(() => {
            localStorage.removeItem("user");
            navigate(`/`);
          }, 5000);
          return;
        }


        if (response.response1[0].codigo === 0) {
          handleOpenModal();

        } else {
          setTitleAlert("Error");
          setMsjAlert("Error al actualizar el usuario");
          setShowModalAlert(true);
        }

      }).catch((error) => {
        setTitleAlert("Error");
        setMsjAlert("Error al actualizar el usuario");
        setShowModalAlert(true);
      }

      );

    }
  }

  return (
    <>
      <Dialog open={open} style={{ zIndex: 2 }}>
        <ModalAlert zIndex={99999} title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />
        <DialogTitle textAlign="center">Actualizar rol del usuario</DialogTitle>
        <DialogContent>

          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                marginTop: '1.5rem',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              <div style={{ position: 'relative' }}>
                {loading && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                    <CircularProgress />
                  </div>
                )}
                <FormControl fullWidth>
                  <Autocomplete
                    value={rol}
                    onChange={(event, newValue) => {
                      setRol(newValue);
                    }}
                    variant="standard"
                    id="select-convenio"
                    options={roles}
                    renderInput={(params) => <TextField {...params} label="Rol del usuario" />}
                  />

                </FormControl>
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
      </Dialog>
    </>
  );
};

export default DataTableDeleteAndExport;