import React, { useState } from "react";
import { useNavigate, } from 'react-router-dom';
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import DataTable from "./DataTable/DataTable";
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import ModalAlert from './Modals/ModalAlert';
import Autocomplete from '@mui/material/Autocomplete';
import { getCartola } from "../api/CartolaBeneficiario";
import CircularProgress from '@mui/material/CircularProgress';
import 'dayjs/locale/es';

const ListarCartolaBeneficiarios = (user) => {
  //Obetner usuario
  const usuario = (JSON.parse(user.user));
  const navigate = useNavigate();
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);

  const [convenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
  const [convenio, setConvenio] = useState(null);
  const [rut, setRut] = useState('');
  const [formattedRut, setFormattedRut] = useState('');

  const [loading, setLoading] = useState(false);

  // Declare state variables for the modal
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  const [showModal, setShowModal] = useState(false);

  // Define the columns of the table
  const columns = [{ accessorKey: 'titular', header: 'Rut Titular', }, { accessorKey: 'beneficiario', header: 'Rut Beneficiario', }, { accessorKey: 'estado', header: 'Estado', }, { accessorKey: 'fecha', header: 'Fecha', }, { accessorKey: 'farmacia', header: 'Farmacia', }, { accessorKey: 'id_receta', header: 'Id Receta', }, { accessorKey: 'direccion', header: 'Direccion', }, { accessorKey: 'comuna', header: 'Comuna', }, { accessorKey: 'boleta', header: 'Boleta', }, { accessorKey: 'guia', header: 'Guia', }, { accessorKey: 'SAP', header: 'SAP', }, { accessorKey: 'decripcion_producto', header: 'Descripcion', }, { accessorKey: 'tipo', header: 'Tipo', }, { accessorKey: 'cantidad', header: 'Cantidad', }, { accessorKey: 'precio', header: 'Precio', }, { accessorKey: 'descto', header: 'Descuento', }, { accessorKey: 'bonificado', header: 'Bonificado', }, { accessorKey: 'copago', header: 'Copago', }, { accessorKey: 'total', header: 'Total', },]; // Function to handle closing the modal
  const handleClose = () => {
    setShowModal(false);
  }

  // Declare state variables for the table
  const [dataTable, setDataTable] = useState({})

  // Function to show the data
  const showData = async () => {

    try {
      setLoading(true);
      setDataTable({});
      //format rut without dots or hyhen
      const rutNoFormat = rut.replace(/\.|-/g, '');
      if (usuario.recursos.indexOf("444") === -1) {
        if (!desde || !hasta) {
          // show error message in modal if any of the fields is empty
          setTitle("Error");
          setMsj("Debe completar todos los campos.");
          setShowModal(true);
        } else if (desde > hasta) {
          // show error message in modal if date range is not valid
          setTitle("Error");
          setMsj("La fecha desde es mayor a la fecha hasta.");
          setShowModal(true);
        } else {
          const formattedDesde = `${desde.$y}-${desde.$M + 1}-${desde.$D}`;
          const formattedHasta = `${hasta.$y}-${hasta.$M + 1}-${hasta.$D}`;
          let data = {}
          data = {
            rut: usuario.rut,
            convenio: "",
            fechaIni: formattedDesde,
            fechaFin: formattedHasta,
            tipo: usuario.idRol,
          };

          const response = await getCartola(data);
          if (response?.response?.status === 403) {
            setShowModal(true)
            setTitle("Sesión expirada")
            setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
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

          if (response.response[0]?.b64) {
            const element = document.createElement("a");
            element.setAttribute("href", `data:application/octet-stream;base64,${response.response[0].b64}`);
            element.setAttribute("download", "Cartola.xls");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            setTitle("Información");
            setMsj("Por la cantidad de registros, se descargará un archivo excel");
            setLoading(false);
            setShowModal(true);
            setDataTable({});
            return
          }


          //if response.responsse is empty show error message in modal no se obtuvieron resultados
          if (response.length === 0) {
            setTitle("Error");
            setMsj("No se obtuvieron resultados");
            setShowModal(true);
          } else if (response.response[0].codigo) {
            if (response.response[0].codigo === 1) {
              setTitle("Error");
              setMsj("No se obtuvieron resultados");
              setLoading(false);
              setShowModal(true);

              setDataTable({});
              return
            }
          } else if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
            setTitle("Error");
            setMsj("Error de conexión");
            setShowModal(true);
          }
          setDataTable(undefined);
          setDataTable(response.response);
        }
        setLoading(false);

      } else {

        if (!convenio || !desde || !hasta) {
          // show error message in modal if any of the fields is empty
          setTitle("Error");
          setMsj("Debe completar todos los campos.");
          setShowModal(true);
        } else if (rutNoFormat.length && rutNoFormat.length < 8) {

          // show error message in modal if rut have less than 7 digits 
          setTitle("Error");
          setMsj("El rut debe tener al menos 8 caracteres.");
          setShowModal(true);

        } else if (desde > hasta) {
          // show error message in modal if date range is not valid
          setTitle("Error");
          setMsj("La fecha desde es mayor a la fecha hasta.");
          setShowModal(true);
        } else {

          const formattedDesde = `${desde.$y}-${desde.$M + 1}-${desde.$D}`;
          const formattedHasta = `${hasta.$y}-${hasta.$M + 1}-${hasta.$D}`;
          let data = {}
          data = {
            rut: rutNoFormat,
            convenio: convenio.value,
            fechaIni: formattedDesde,
            fechaFin: formattedHasta,
            tipo: usuario.idRol,
          };
          const response = await getCartola(data);
          if (response?.response?.status === 403) {
            setShowModal(true)
            setTitle("Sesión expirada")
            setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
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

          if (response.response[0]?.b64) {
            const element = document.createElement("a");
            element.setAttribute("href", `data:application/octet-stream;base64,${response.response[0].b64}`);
            element.setAttribute("download", "Cartola.xls");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            setTitle("Información");
            setMsj("Por la cantidad de registros, se descargará un archivo excel");
            setLoading(false);
            setShowModal(true);
            setDataTable({});
            return
          }




          if (response.length === 0) {
            setTitle("Error");
            setMsj("No se obtuvieron resultados");
            setShowModal(true);
          } else if (response.response[0].codigo) {
            if (response.response[0].codigo === 1) {
              setTitle("Error");
              setMsj("No se obtuvieron resultados");
              setLoading(false);
              setShowModal(true);

              setDataTable({});
              return
            }
          }

          setDataTable(undefined);
          setDataTable(response.response);



        }

      };
      setLoading(false);


    } catch (error) {
      setShowModal(true)
      setTitle("Error")
      setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
    }
  }

  const formatRut = (rut) => {
    // Eliminar caracteres no numéricos
    rut = rut.replace(/[^\dkK]/g, '');
    if (rut.length < 2) return rut;
    // Agregar puntos entre el quinto y sexto dígito
    rut = rut.replace(/^([\d]{1,2})([\d]{3})([\d]{3})([\dkK])$/, '$1.$2.$3-$4');
    return rut;
  }

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
            <Titulo>Cartola beneficiario</Titulo>
          </ContenedorTitulo>
          <div id="notaLogin">
            En esta sección podrás listar y exportar las cartolas de los beneficiarios.
          </div>
          <Form >
            <Box sx={{ flexGrow: 1, marginBottom: 2 }}>



              <Grid container spacing={2}>
                {
                  (usuario.recursos.indexOf("444") === -1)
                    ?
                    null :
                    <>
                      <Grid xs={3}>
                        <Autocomplete
                          value={convenio}
                          onChange={(event, newValue) => {
                            setConvenio(newValue);
                          }}
                          id="controllable-states-demo"
                          options={convenios}
                          renderInput={(params) => <TextField {...params} label="Convenio" />}
                        />
                      </Grid>
                      <Grid xs={3}>
                        <TextField
                          id="rut"
                          label="Rut"
                          variant="outlined"
                          sx={{ width: '100%' }}
                          inputProps={{ maxLength: 12, pattern: '[0-9kK]*' }}
                          value={formattedRut}
                          onChange={(event) => {
                            setRut(event.target.value)
                            setFormattedRut(formatRut(event.target.value))
                          }}
                        />
                      </Grid>
                    </>
                }
                <Grid xs={2}>
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
                <Grid xs={2}>
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
                <Grid xs={2}>
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
              : <DataTable data={dataTable} columns={columns} export={true} nombreArchivo={"CartolaBeneficiario"} />
          }
        </div>
      </div>
    </main>

  );
}

export default ListarCartolaBeneficiarios;
