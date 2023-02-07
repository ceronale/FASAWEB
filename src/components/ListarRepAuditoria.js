import React, { useState, useEffect } from "react";
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { ReporteAuditoriaService } from "../api/ReporteAuditoriaService";
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

const ListarRepAuditoria = (user) => {
  const [loading, setLoading] = useState(false);
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


    if (!usuario.correo || !servicioSelected || !accion || !desde || !hasta) {
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
      const data = {
        user: usuario.correo,
        servicio: servicioSelected,
        accion: accion,
        fechaDesde: formattedDesde,
        fechaHasta: formattedHasta,
      };
      setDataTable(undefined);
      console.log(data);
      setLoading(true);



      const response = await ReporteAuditoriaService(data);
      //Check if the response is ok response.auditoria[0].codigo === 0 is ok and response.auditoria[0].codigo === 1 is error
      if (response.auditoria[0].codigo === 1) {
        setTitle("Error");
        setMsj(response.auditoria[0].detalle);
        setShowModal(true);
        setDataTable({});
      } else {
        setDataTable(response.auditoria);

      }
      setLoading(false);
    }
  };


  //Variables de selects accion y servicio
  const [servicio, setServicio] = useState([]);
  const [servicioSelected, setServicioSelected] = useState('');

  const [usuarioInput, setusuarioInput] = useState([]);
  const [usuarioInputSelected, setUsuarioInputSelected] = useState('');

  const [isServicioDisabled, setIsServicioDisabled] = useState(true);
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [accion, setAccion] = useState('');


  const eliminar = [
    {
      value: 'eliminarRutListaMedicos',
      label: 'Eliminar Medico',
    },
    {
      value: 'eliminarUsuario',
      label: 'Eliminar Usuario',
    },
  ];
  const cargaMasiva = [
    {
      value: 'cargaMasivaMedicos',
      label: 'Carga masiva medicos',
    },
    {
      value: 'cargaMasivaPolizas',
      label: 'Carga masiva polizas',
    },
    {
      value: 'cargaMasivaBeneficiarios',
      label: 'Carga masiva beneficiarios',
    },
  ];

  const actualizar = [
    {
      value: 'actualizarPwd',
      label: 'Actualizar Password',
    },
    {
      value: 'actualizarConvenio',
      label: 'Actualizar Convenio',
    },
    {
      value: 'actualizarListaMedicos',
      label: 'Actualizar Medicos',
    },
    {
      value: 'actualizarPoliza',
      label: 'Actualizar Poliza',
    },
    {
      value: 'actualizarBeneficiario',
      label: 'Actualizar Beneficiario',
    },

  ];

  const crear = [
    {
      value: 'insertarPaciente',
      label: 'Insertar Paciente',
    },
    {
      value: 'insertarEmpresa',
      label: 'Insertar Empresa',
    },
    {
      value: 'insertarMedico',
      label: 'Insertar Medico',
    },
    {
      value: 'cargarDocumento',
      label: 'Cargar Documento',
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
    //const response = await algunaCosaParaListarUsuario();
    //setusuarioInput(response.usuarios);
    //create example data to set in usuarioInput  
    const data = [
      {
        value: 'usuario1',
        label: 'usuario1',
      },
      {
        value: 'usuario2',
        label: 'usuario2',
      },
      {
        value: 'usuario3',
        label: 'usuario3',
      },
    ];
    setusuarioInput(data);

  }, []);


  const handleChangeServicio = (event) => {
    setServicioSelected(event.target.value);
  };

  const handleChangeUsuario = (event) => {
    setUsuarioInputSelected(event.target.value);
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
            En esta seccion podras visualizar las acciones realizadas.
          </div>
          <Form >
            <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={4}>
                  <FormControl fullWidth >
                    <InputLabel id="usuario-select">Usuario</InputLabel>
                    <Select
                      labelId="usuario-select"
                      id="usuario-select"
                      label="Usuario"
                      value={usuarioInputSelected}
                      onChange={handleChangeUsuario}
                    >
                      {usuarioInput.map((u) => (
                        <MenuItem key={u.value} value={u.value}>
                          {u.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

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
                  <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
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
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
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
              <DataTable data={dataTable} columns={columns} />
          }
        </div>
      </div>
    </main>

  );
}

export default ListarRepAuditoria;