import React, { useState } from "react";
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




const ListarCartolaBeneficiarios = (user) => {
  //Obetner usuario
  const usuario = (JSON.parse(user.user));

  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);

  const [convenios, setConvenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
  const [convenio, setConvenio] = useState(null);
  const [rut, setRut] = useState('');
  const [formattedRut, setFormattedRut] = useState('');

  const [loading, setLoading] = useState(false);

  // Declare state variables for the modal
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  const [showModal, setShowModal] = useState(false);

  // Define the columns of the table
  const columns = [{ accessorKey: 'estado', header: 'Estado', }, { accessorKey: 'fecha', header: 'Fecha', }, { accessorKey: 'farmacia', header: 'Farmacia', }, { accessorKey: 'id_receta', header: 'Id Receta', }, { accessorKey: 'direccion', header: 'Direccion', }, { accessorKey: 'comuna', header: 'Comuna', }, { accessorKey: 'boleta', header: 'Boleta', }, { accessorKey: 'guia', header: 'Guia', }, { accessorKey: 'SAP', header: 'SAP', }, { accessorKey: 'decripcion_producto', header: 'Descripcion', }, { accessorKey: 'tipo', header: 'Tipo', }, { accessorKey: 'cantidad', header: 'Cantidad', }, { accessorKey: 'precio', header: 'Precio', }, { accessorKey: 'descto', header: 'Descuento', }, { accessorKey: 'bonificado', header: 'Bonificado', }, { accessorKey: 'copago', header: 'Copago', }, { accessorKey: 'total', header: 'Total', },]; // Function to handle closing the modal
  const handleClose = () => {
    setShowModal(false);
  }

  // Declare state variables for the table
  const [dataTable, setDataTable] = useState({})

  // Function to show the data
  const showData = async () => {
    //format rut without dots or hyhen
    const rutNoFormat = rut.replace(/\.|-/g, '');

    if (!rut || !convenio || !desde || !hasta) {
      // show error message in modal if any of the fields is empty
      setTitle("Error");
      setMsj("Debe completar todos los campos.");
      setShowModal(true);
    } else if (rutNoFormat.length < 6) {
      // show error message in modal if rut have less than 7 digits 
      setTitle("Error");
      setMsj("El rut debe tener al menos 7 caracteres.");
      setShowModal(true);
    } else if (desde > hasta) {
      // show error message in modal if date range is not valid
      setTitle("Error");
      setMsj("La fecha desde es mayor a la fecha hasta.");
      setShowModal(true);
    } else {
      // format desde and hasta date
      const formattedDesde = `${desde.$y}-${desde.$M + 1}-${desde.$D}`;
      const formattedHasta = `${hasta.$y}-${hasta.$M + 1}-${hasta.$D}`;
      const data = {
        rut: rut,
        convenio: convenio.value,
        fechaIni: formattedDesde,
        fechaFin: formattedHasta,

      };

      setLoading(true);
      const response = await getCartola(data);

      setDataTable(undefined);
      setDataTable(response.response);
      setLoading(false);
    }
  };


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

      <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
      <div>
        <ContenedorTitulo>
          <Titulo>Cartola beneficiario</Titulo>
        </ContenedorTitulo>
        <div id="notaLogin">
          En esta seccion podras visualizar las los beneficiarios.
        </div>
        <Form >
          <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <Grid container spacing={2}>
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
              <Grid xs={2}>
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
              <Grid xs={2}>
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
            : <DataTable data={dataTable} columns={columns} />
        }


      </div>
    </main>

  );
}

export default ListarCartolaBeneficiarios;
