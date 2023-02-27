import React, { useState } from "react";
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { getBeneficiarios, updateBeneficiario } from "../api/BeneficiarioService";
import DataTableBeneficiarios from "./DataTable/DataTableBeneficiarios";
import { Box, FormControl, Button, TextField, Autocomplete } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ModalAlert from "./Modals/ModalAlert";
import CircularProgress from "@mui/material/CircularProgress";
import Form from 'react-bootstrap/Form';




const ListarBeneficiarios = (user) => {
  //Obetner usuario
  const usuario = (JSON.parse(user.user));
  // state to store the selected filter value
  const [filtrarValue, setFiltrarValue] = useState(null);
  // state to store the options for the select input
  const [convenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
  // state to store the data for the DataTable component
  const [dataTable, setDataTable] = useState({});
  // state to store the title of the modal
  const [title, setTitle] = useState();
  // state to store the message of the modal
  const [msj, setMsj] = useState();
  // state to store the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  //state of the loading
  const [loading, setLoading] = useState(false);

  const [convenio, setConvenio] = useState(null);
  const [rut, setRut] = useState('');
  const [formattedRut, setFormattedRut] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const showData = async () => {
    try {
      //Check if the convenio
      if (convenio === null) {
        handleModal("Error", "Debe seleccionar un convenio");
        return;
      }
      //Check if the rut is empty
      if (rut === '') {
        handleModal("Error", "Debe ingresar un rut");
        return;
      }

      const data = {
        codigoCliente: convenio.value,
        activos: 1,
        rut: rut.replace(/\./g, '').replace(/\-/g, ''),
      }

      //call the service to get the data
      setLoading(true);

      const response = await getBeneficiarios(data);
      if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
        setLoading(false);
        setDataTable(undefined)
        setDataTable({})
        handleModal("Error", "Error de conexión");
      } else if (response.response[0].codigoError === 1) {
        setLoading(false);
        setDataTable(undefined)
        setDataTable({})
        handleModal("Información", "No se pudo obtener información de los beneficiarios");
      } else {
        setLoading(false);
        setDataTable(undefined)
        setDataTable(response.response);

        setIsButtonDisabled(false)
      }
    } catch (error) {
      setLoading(false);
      handleModal("Error", "No se pudo obtener información de los beneficiarios");
    }
  };


  //create function to handle the modal
  const handleModal = (title, msj) => {
    setTitle(title);
    setMsj(msj);
    setShowModal(true);
  };

  //handle the modal close
  const handleClose = () => {
    setShowModal(false);
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
      <ContenedorTitulo>
        <Titulo>Beneficiario</Titulo>
      </ContenedorTitulo>
      <div id="notaLogin">
        En esta seccion podras visualizar los beneficiarios.
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
          : <DataTableBeneficiarios data={dataTable} user={usuario} isButtonDisabled={isButtonDisabled} updateData={showData} convenio={convenio} />
      }


    </main >

  );
}




export default ListarBeneficiarios;
