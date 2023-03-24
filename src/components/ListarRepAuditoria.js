import React, { useState, useEffect } from "react";
import { useNavigate, } from 'react-router-dom';
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { ReporteAuditoriaService, getUsuarios } from "../api/ReporteAuditoriaService";
import DataTable from "./DataTable/DataTable";
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ModalAlert from './Modals/ModalAlert';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import 'dayjs/locale/es';

const ListarRepAuditoria = (user) => {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const columns = [
    {
      accessorKey: 'accion',
      header: 'Accion',
    },
    {
      accessorKey: 'detalle',
      header: 'Detalle',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    },
    {
      accessorKey: 'servicio',
      header: 'Servicio',
    },
    {
      accessorKey: 'usuario',
      header: 'Usuario',
    },
  ];

  //Obetner usuario
  const usuario = (JSON.parse(user.user));

  // Variables modal
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  const [showModal, setShowModal] = useState(false);

  //Cerrar modal
  const handleClose = () => {
    setShowModal(false);
  }

  // 1.-Configurar Hooks
  const [dataTable, setDataTable] = useState({})

  // 2.-Funcion para mostrar los datos
  const showData = async () => {
    try {
      if (!servicioSelected || !accion || !desde || !hasta) {
        setTitle("Error");
        setMsj("Debe completar todos los campos.");
        setShowModal(true);
      } else if (desde > hasta) {
        setTitle("Error");
        setMsj("La fecha desde es mayor a la fecha hasta.");
        setShowModal(true);
      } else {
        const formattedDesde = `${desde.$y}-${desde.$M + 1}-${desde.$D}`;
        const formattedHasta = `${hasta.$y}-${hasta.$M + 1}-${hasta.$D}`;
        //intialize data if usuarioselected is diferent to null
        const data = usuarioInputSelected ? {
          user: usuarioInputSelected.value,
          servicio: servicioSelected,
          accion: accion,
          fechaDesde: formattedDesde,
          fechaHasta: formattedHasta,
        } : {
          user: usuario.correo,
          servicio: servicioSelected,
          accion: accion,
          fechaDesde: formattedDesde,
          fechaHasta: formattedHasta,
        };

        setDataTable(undefined);
        setLoading(true);

        const response = await ReporteAuditoriaService(data);
        if (response?.response?.status === 403
        ) {
          setTitle("Sesión expirada")
          setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
          setShowModal(true)

          //set time out to logout of 5 seconds
          setTimeout(() => {
            localStorage.removeItem("user");
            navigate(`/`);
          }, 3000);
          return;
        }


        if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
          setTitle("Error");
          setMsj("Error de conexión");
          setShowModal(true);
          setLoading(false);
          return;
        }

        //Check if the response is ok response.auditoria[0].codigo === 0 is ok and response.auditoria[0].codigo === 1 is error
        if (response.auditoria[0].codigo === 1) {
          setTitle("Error");
          setMsj(response.auditoria[0].detalle);
          setShowModal(true);
          setDataTable({});
        } else {
          setIsButtonDisabled(false);
          setDataTable(response.auditoria);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setShowModal(true)
      setTitle("Error")
      setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
    }
  };


  //Variables de selects accion y servicio
  const [servicio, setServicio] = useState([]);
  const [servicioSelected, setServicioSelected] = useState('');

  const [usuarioInput, setusuarioInput] = useState([]);
  const [usuarioInputSelected, setUsuarioInputSelected] = useState(null);

  const [isServicioDisabled, setIsServicioDisabled] = useState(true);
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [accion, setAccion] = useState('');


  const eliminar = [
    {
      value: 'eliminarRutListaMedicos',
      label: 'Medico',
    },
    {
      value: 'eliminarUsuario',
      label: 'Usuario',
    },
  ];
  const cargaMasiva = [
    {
      value: 'cargaMasivaMedicos',
      label: 'Medicos',
    },
    {
      value: 'cargaMasivaPolizas',
      label: 'Polizas',
    },
    {
      value: 'cargaMasivaBeneficiarios',
      label: 'Beneficiarios',
    },
  ];

  const actualizar = [
    {
      value: 'actualizarPwd',
      label: 'Password',
    },
    {
      value: 'actualizarListaMedicos',
      label: 'Medicos',
    },
    {
      value: 'actualizarPoliza',
      label: 'Poliza',
    },
    {
      value: 'actualizarBeneficiario',
      label: 'Beneficiario',
    },

  ];

  const crear = [
    {
      value: 'insertarPaciente',
      label: 'Paciente',
    },
    {
      value: 'insertarEmpresa',
      label: 'Empresa',
    },
    {
      value: 'insertarListaMedicos',
      label: 'Medico',
    },
    {
      value: 'insertarAutorizacionPrevia',
      label: 'Autorización Previa',
    },
    {
      value: 'cargarDocumento',
      label: 'Cargar Documento',
    },
  ];


  const operations = {
    Insertar: crear,
    Actualizar: actualizar,
    Eliminar: eliminar,
    CargaMasiva: cargaMasiva,
  };

  const handleChangeAccion = (event) => {
    const value = event.target.value;
    setAccion(value);
    setServicio('');
    setServicioSelected('');
    setServicio(operations[value]);
    setIsServicioDisabled(false);
  };

  //Call an api to get the data of usuarioInput
  useEffect(() => {
    try {


      const fetchData = async () => {
        const response = await getUsuarios();
        if (response?.response?.status === 403
        ) {
          setTitle("Sesión expirada")
          setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
          setShowModal(true)

          //set time out to logout of 5 seconds
          setTimeout(() => {
            localStorage.removeItem("user");
            navigate(`/`);
          }, 3000);
          return;
        }

        if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
          setTitle("Error");
          setMsj("Error de conexión");
          setShowModal(true);
          setLoading(false);
          return;
        }

        //set response like this value: response.usuario[0].corre, label: response.usuario[0].correo
        const data = response.usuario.map((item, index) => {
          const correo = item.correo !== undefined ? item.correo.toString() : '';
          return {
            value: correo,
            label: correo,
          };
        });


        setusuarioInput(data);
      };

      fetchData();
    } catch (error) {
      setLoading(false);
      setShowModal(true)
      setTitle("Error")
      setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
    }
  }, []);


  const handleChangeServicio = (event) => {
    setServicioSelected(event.target.value);
  };


  return (
    <main>
      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
            <CircularProgress />
          </div>
        )}
        <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
        <div>
          <ContenedorTitulo>
            <Titulo>Visualización de reporte y auditoria</Titulo>
          </ContenedorTitulo>
          <div id="notaLogin">
            En esta sección podrás ver las acciones realizadas por un usuario y exportar la información.
          </div>
          <Form >
            <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
              <Grid container spacing={2}>


                {
                  (usuario.recursos.indexOf("445") === -1)
                    ?
                    null :
                    <>
                      <Grid xs={4}>
                        <FormControl fullWidth >
                          <Autocomplete
                            value={usuarioInputSelected}
                            onChange={(event, newValue) => {
                              setUsuarioInputSelected(newValue);
                            }}
                            id="controllable-states-demo"
                            options={usuarioInput}
                            renderInput={(params) => <TextField {...params} label="Usuario" />}
                          />
                        </FormControl>
                      </Grid>
                    </>

                }



                <Grid xs={4}>
                  <FormControl fullWidth  >
                    <InputLabel id="demo-simple-select-label">Accion</InputLabel>
                    <Select
                      labelId="accion-label"
                      id="accion-id"
                      label="Accion"
                      value={accion}
                      onChange={handleChangeAccion}
                    >
                      <MenuItem value={"Insertar"}>Insertar</MenuItem>
                      <MenuItem value={"Actualizar"}>Actualizar</MenuItem>
                      <MenuItem value={"Eliminar"}>Eliminar</MenuItem>
                      <MenuItem value={"CargaMasiva"}>Carga masiva</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl fullWidth disabled={isServicioDisabled}>
                    <InputLabel id="demo-simple-select-label">Servicio</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Servicio"
                      value={servicioSelected}
                      onChange={handleChangeServicio}
                    >
                      {servicio.map((servicio) => (
                        <MenuItem key={servicio.value} value={servicio.value}>
                          {servicio.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
                    <DatePicker
                      label="Desde"
                      value={desde}
                      onChange={(desde) => {
                        setDesde(desde);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
                    <DatePicker
                      label="Hasta"
                      value={hasta}
                      onChange={(hasta) => {
                        setHasta(hasta);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6}>
                  <Button size="large" variant="contained" onClick={showData} style={{ marginTop: 5 }}>
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
          {
            (dataTable === undefined)
              ?
              null
              :
              <DataTable data={dataTable} columns={columns} export={true} isButtonDisabled={isButtonDisabled} nombreArchivo={"ReporteAuditoria"} />
          }
        </div>
      </div>
    </main>

  );
}

export default ListarRepAuditoria;