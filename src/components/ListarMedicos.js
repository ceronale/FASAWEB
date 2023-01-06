import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from 'material-react-table';
import { ContenedorTitulo, Titulo } from './Formularios';
import { getLista, getMedicos } from "../api/Medicos";

//import { MRT_Localization_ES } from 'material-react-table/locales/es';
//import { PolizaServiceUpdate } from "../../api/PolizaService";

import * as XLSX from 'xlsx/xlsx.mjs';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import ModalTest from './ModalTest';
import { CircularProgress } from '@material-ui/core';
import DataTableMedicos from "./DataTable/DataTableMedicos";

const ListarMedicos = (user) => {

  const [servicioSelected, setServicioSelected] = useState('');
  const [isListaDisabled, setIsListaDisabled] = useState(true);
  const [usuario, setUsuario] = useState(JSON.parse(user.user))
  const [convenios, setConvenios] = useState([]);
  const [convenioSelected, setConvenioSelected] = useState('')
  const [listas, setListas] = useState([])
  const [listaSelected, setListaSelected] = useState('')

  const [dataTable, setDataTable] = useState()

  //Modal Variables
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();

  //Modal Upload File

  const [showModal, setShowModal] = useState(false);





  const handleClose = () => {
    setShowModal(false);
  }

  const columns = useMemo(

    () => [
      {
        accessorKey: 'rutMedico',
        header: 'Rut Medico',
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
      },
      {
        accessorKey: 'fechaDesde',
        header: 'fechaDesde',
      },
      {
        accessorKey: 'exc_Inc', //normal accessorKey
        header: 'Inclusión / Exclusión',
      }
    ],
    [],
  );

  const operations = {

  };

  const handleChangeConvenio = async (event) => {
    const value = event.target.value;
    setConvenioSelected(value);
    setListaSelected('');
    const response = await getLista(value);

    setListas([...response.codigolista]);

    setIsListaDisabled(false);
  };

  const showData = async () => {
    //Validate all inputs are filled  before sending the request
    if (!convenioSelected || !listaSelected) {
      //Show modal with error message
      setTitle("Error");
      setMsj("Debe seleccionar un convenio y una lista");
      setShowModal(true);
    } else {
      //Send request to get medicos
      const response = await getMedicos(listaSelected);
      setDataTable(undefined);
      setDataTable(response.medicos);
    }

  }

  const handleChangeLista = (event) => {
    setListaSelected(event.target.value);
  };
  //Get the values from usuario.convenios that are limited by comman and put them in an array when the component is mounted using useEffect
  useEffect(() => {
    const convenios = usuario.convenio.split(",");
    const conveniosJson = convenios.map((convenio, index) => ({ label: convenio, value: convenio }));
    setConvenios(conveniosJson);
  }, []);

  return (
    <>
      <div className="boxTabla">
        <ContenedorTitulo>
          <Titulo>Visualizacion de Medicos</Titulo>
        </ContenedorTitulo>
        <div id="notaLogin">
          En esta sección se muestran todos los medicos asociados a un convenio.
        </div>
        <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={3}>
              <FormControl fullWidth  >
                <InputLabel id="demo-simple-select-label">Convenio</InputLabel>
                <Select
                  labelId="accion-label"
                  id="accion-id"
                  label="Convenio"
                  value={convenioSelected}
                  onChange={handleChangeConvenio}
                >
                  {convenios.map((convenio) => (
                    <MenuItem key={convenio.value} value={convenio.value}>
                      {convenio.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            <Grid xs={3}>
              <FormControl fullWidth disabled={isListaDisabled}>
                <InputLabel id="demo-simple-select-label">Servicio</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Servicio"
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
            :
            <DataTableMedicos data={dataTable} columns={columns} user={usuario.correo} codigoLista={listaSelected} />
        }

        <ModalTest title={title} show={showModal} handleClose={handleClose} msj={msj} />

      </div>
    </>
  );
};
export default ListarMedicos;