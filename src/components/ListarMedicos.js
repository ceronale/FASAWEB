import React, { useState } from "react";
import { useNavigate, } from 'react-router-dom';
import { ContenedorTitulo, Titulo } from './Formularios';
import { getLista, getMedicos } from "../api/MedicosService";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import ModalAlert from './Modals/ModalAlert';
import DataTableMedicos from "./DataTable/DataTableMedicos";
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete, TextField } from "@mui/material";


const ListarMedicos = (user) => {
  //State to handle the disable/enable of lista select
  const [isListaDisabled, setIsListaDisabled] = useState(true);
  //State to handle the user data
  const [usuario] = useState(JSON.parse(user.user));
  //State to handle the convenios of the user
  const [convenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
  //State to handle the selected convenio
  const [convenioSelected, setConvenioSelected] = useState('')
  //State to handle the listas of the selected convenio
  const [listas, setListas] = useState([])
  //State to handle the selected lista
  const [listaSelected, setListaSelected] = useState('')
  //State to handle the data of the table
  const [dataTable, setDataTable] = useState({})
  //State to handle the title of the modal
  const [title, setTitle] = useState();
  //State to handle the message of the modal
  const [msj, setMsj] = useState();
  //State to handle the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  //State of the loading
  const [loading, setLoading] = useState(false);
  //State to handle the disable/enable of the button
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const navigate = useNavigate();

  //Function to handle the close of the modal
  const handleClose = () => {
    setShowModal(false);
  }


  //Function to handle the change of the convenio selecthandleChangeConvenio(event, newValue);
  const handleChangeConvenio = async (event, newValue) => {
    setLoading(true);
    //get the value of theselect
    const value = newValue;
    //Update the selected convenio
    setConvenioSelected(value);
    //Reset the selected lista
    setListaSelected('');
    //create a try and catrch block to handle the error of the request and show the modal with the error message
    try {
      const response = await getLista(value);

      if (response?.response?.status === 403
      ) {
        setLoading(false);
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


      if (response.codigolista.length === 0) {
        setTitle("Error");
        setMsj("No hay medicos para mostrar");
        setShowModal(true);
        setLoading(false);
        return;
      } else {
        setIsButtonDisabled(false);
        //Update the listas state
        setListas([...response.codigolista]);
        //Enable the lista select
        setIsListaDisabled(false);
        setLoading(false);
      }

      if (response) {
        setLoading(false);
      }

      //Update the listas state
      setListas([...response.codigolista]);
      //Enable the lista select
      setIsListaDisabled(false);
    } catch (error) {
      //Show modal with error message
      setLoading(false);
      setTitle("Error");
      setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
      setShowModal(true);
    }
  };

  //Function to handle the click of the show data button
  const showData = async () => {

    //Validate all inputs are filled before sending the request
    if (!convenioSelected || !listaSelected) {
      //Show modal with error message
      setTitle("Error");
      setMsj("Debe seleccionar un convenio y una lista");
      setShowModal(true);
    } else {
      //create a try and catrch block to handle the error of the request and show the modal with the error message
      try {
        const response = await getMedicos(listaSelected);
        setDataTable(undefined);
        setDataTable({});
        if (response?.response?.status === 403
        ) {
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

        if (response.medicos.length === 0) {
          setTitle("Error");
          setMsj("No hay medicos para mostrar");
          setShowModal(true);
          setLoading(false);
          return;
        } else {
          //Reset the dataTable state
          setDataTable(undefined);
          //Update the dataTable state with the medicos data
          setIsButtonDisabled(false);
          setDataTable(response.medicos);
          setLoading(false);
        }


      } catch (error) {
        setLoading(false);
        //Show modal with error message
        setTitle("Error");
        setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
        setShowModal(true);
      }
    }
  }

  //Function to handle the click of the show data button
  const showData2 = async () => {
    //Validate all inputs are filled before sending the request
    if (!convenioSelected || !listaSelected) {
      //Show modal with error message
      setTitle("Error");
      setMsj("Debe seleccionar un convenio y una lista");
      setShowModal(true);
    } else {
      //create a try and catrch block to handle the error of the request and show the modal with the error message
      try {
        const response = await getMedicos(listaSelected);
        //Reset the dataTable state
        setDataTable(undefined);
        //Update the dataTable state with the medicos data
        setDataTable(response.medicos);
        setTitle("Exito");
        setMsj("Se ha ingresado con exito el registro");
        setShowModal(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        //Show modal with error message
        setTitle("Error");
        setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
        setShowModal(true);
      }
    }
  }

  //Function to handle the change of the lista select
  const handleChangeLista = (event) => {
    setListaSelected(event.target.value);
  };

  return (
    <>
      <main>
        <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
              <CircularProgress />
            </div>
          )}
          <div className="boxTabla">
            <ContenedorTitulo>
              <Titulo>Visualización de Medicos</Titulo>
            </ContenedorTitulo>
            <div id="notaLogin">
              En esta sección podrás listar, editar, importar y exportar medicos.
            </div>
            <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={3}>

                  <Autocomplete
                    value={convenioSelected}
                    onChange={(event, newValue) => {
                      handleChangeConvenio(event, newValue);
                    }}
                    id="controllable-states-demo"
                    options={convenios}
                    renderInput={(params) => <TextField {...params} label="Convenio" />}
                  />
                </Grid>
                <Grid xs={3}>
                  <FormControl fullWidth disabled={isListaDisabled}>
                    <InputLabel id="demo-simple-select-label">Listas</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Listas"
                      value={listaSelected}
                      onChange={handleChangeLista}
                    >
                      {listas.map((lista) => (
                        <MenuItem key={lista.codigoLista} value={lista.codigoLista}>
                          {lista.codigoLista}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={2}>
                  <Button size="large" variant="contained" onClick={showData} style={{ marginTop: 5 }}>
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {
              (dataTable === undefined)
                ?
                null
                : <DataTableMedicos data={dataTable} user={usuario.correo} codigoLista={listaSelected} showData={showData2} updateData={showData} isButtonDisabled={isButtonDisabled} />
            }

            <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
          </div>
        </div>
      </main>
    </>
  );
};
export default ListarMedicos;