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
import { getAutorizaciones } from '../api/AutorizacionesPreviasService';
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
    const [dataTable, setDataTable] = useState({});
    const [convenioSelected, setConvenioSelected] = useState('')
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listaSelected, setListaSelected] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
    const handleShowData = async () => {
        try {
            //Check if the convenio

            if (!convenioSelected) {
                handleModal("Error", "Debe seleccionar un convenio");
                return;
            }
            //Check if the rut is empty
            if (rut === '') {
                handleModal("Error", "Debe ingresar un rut");
                return;
            }

            const data = {
                convenio: convenioSelected.value,
                rut: rut.replace(/\./g, '').replace(/\-/g, ''),
            }

            //call the service to get the data
            setLoading(true);
            const response = await getAutorizaciones(data);

            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {

                setLoading(false);

                handleModal("Error", "No se pudo obtener la información de los beneficiarios");
            } else {
                //response.autorizacionPrevia[0].codigo === 1 is the error code

                if (response.autorizacionPrevia[0].codigo === 1) {
                    handleModal("Error", response.autorizacionPrevia[0].detalle);
                    setLoading(false);
                    return;
                } else if (response.autorizacionPrevia[0].codigo === 0) {
                    setLoading(false);
                    setDataTable(undefined)
                    setDataTable(response.autorizacionPrevia);
                    setIsButtonDisabled(false)
                }
            }
        } catch (error) {
            setLoading(false);
            handleModal("Error", "No se pudo obtener la información de los beneficiarios");
        }
    }
    //create function to handle the modal
    const handleModal = (title, msj) => {
        setTitle(title);
        setMsj(msj);
        setShowModal(true);
    };
    const columns = useMemo(
        () => [{ accessorKey: 'LAPB_416_ID_AP', header: 'ID', enableEditing: false }, { accessorKey: 'LAPB_ACUMULADO_ENVASES_MENSUAL', header: 'Acumulados', enableEditing: false }, { accessorKey: 'LAPB_FECHA_INICIO', header: 'Fecha Inicio' }, { accessorKey: 'LAPB_FECHA_TERMINO', header: 'Fecha Término' }, { accessorKey: 'LAPB_INCLUIR_EXCLUIR', header: 'Exclusión/Inclusión' }, { accessorKey: 'LAPB_MEDICO_INCEXC', header: 'Exclusión/Inclusión Medico' }, { accessorKey: 'LAPB_Q_ENVASES_MENSUAL', header: 'Max Envases' }, { accessorKey: 'LAPB_VALOR_CAMPO', header: 'Valor Campo' }, { accessorKey: 'LMA_ID_MEDICO', header: 'Rut Medico' }, { accessorKey: 'campo', header: 'Nombre Campo' }, { accessorKey: 'codigo', header: 'Código Carga' }, { accessorKey: 'codigoPersona', header: 'Código Persona' }, { accessorKey: 'credencial', header: 'Credencial' }],
        []
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
                        : <DataTableAutorizacionPrevia data={dataTable} columns={columns} user={usuario.correo} codigoLista={listaSelected} showData={handleShowData} isButtonDisabled={isButtonDisabled} />
                }
            </div>

            <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
        </main >
    );
};
export default AutorizacionPrevia;