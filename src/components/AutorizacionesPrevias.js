import React, { useState, useMemo } from "react";
import { ContenedorTitulo, Titulo } from './Formularios';
import ModalAlert from './Modals/ModalAlert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { setAutorizaciones } from '../api/AutorizacionesPreviasService';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import DataTableAutorizacionPrevia from "./DataTable/DataTableAutorizacionPrevia";;


const AutorizacionPrevia = (user) => {

    //State to handle the user data
    const [usuario] = useState(JSON.parse(user.user));
    //State to handle the convenios of the user
    const [convenios, setConvenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
    const [rut, setRut] = useState('');
    const [formattedRut, setFormattedRut] = useState('');
    const [dataTable, setDataTable] = useState({})
    const [convenioSelected, setConvenioSelected] = useState('')
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listaSelected, setListaSelected] = useState('')
    //Function to handle the close of the modal
    const handleClose = () => {
        setShowModal(false);
    }

    const formatRut = (rut) => {
        // Eliminar caracteres no numéricos
        rut = rut.replace(/[^\dkK]/g, '');
        if (rut.length < 2) return rut;
        // Agregar puntos entre el quinto y sexto dígito
        rut = rut.replace(/^([\d]{1,2})([\d]{3})([\d]{3})([\dkK])$/, '$1.$2.$3-$4');
        return rut;
    }

    //Handle show modal
    const handleShowModal = (title, msj) => {
        setTitle(title);
        setMsj(msj);
        setShowModal(true);
    }
    //show data
    const handleShowData = () => {
        // console.log(formattedRut, convenioSelected);
    }

    const columns = useMemo(
        () => [{ accessorKey: 'ID', header: 'ID', enableEditing: false, }, { accessorKey: 'codigoCarga', header: 'Código Carga', enableEditing: false, }, { accessorKey: 'nombreCampo', header: 'Nombre Campo', }, { accessorKey: 'valorCampo', header: 'Valor Campo', }, { accessorKey: 'exc_Inc', header: 'Exclusión/Inclusión', }, { accessorKey: 'fechaInicio', header: 'Fecha Inicio', }, { accessorKey: 'fechaTermino', header: 'Fecha Término', }, { accessorKey: 'maxEnvases', header: 'Max Envases', }, { accessorKey: 'acumulados', header: 'Acumulados', }],
        [],
    );

    return (
        <main>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}

                <ContenedorTitulo>
                    <Titulo>Autorizaciones Previas</Titulo>
                </ContenedorTitulo>
                <div id="notaLogin">
                    En esta seccion podra visualizar y crear autorizaciones previas.
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
                                    onChange={(event) => {
                                        setConvenioSelected(event.target.value);
                                    }}
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
                            <Button size="large" variant="contained" onClick={handleShowData} style={{ marginTop: 5 }}>
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {
                    (dataTable === undefined)
                        ?
                        null
                        : <DataTableAutorizacionPrevia data={dataTable} columns={columns} user={usuario.correo} codigoLista={listaSelected} showData={handleShowData} isButtonDisabled={false} />
                }
            </div>

            <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
        </main >
    );
};
export default AutorizacionPrevia;