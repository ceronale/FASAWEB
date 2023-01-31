import React, { useState, useMemo } from "react";
import { ContenedorTitulo, Titulo } from './Formularios';
import ModalAlert from './Modals/ModalAlert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { RadioGroup } from "@mui/material";
import { Radio } from "@mui/material";
import { FormControlLabel, FormLabel } from "@mui/material";
import { setAutorizaciones } from '../api/AutorizacionesPreviasService';


const AutorizacionPreviaAdd = (user) => {

    //State to handle the user data
    const [usuario] = useState(JSON.parse(user.user));
    //State to handle the convenios of the user
    const [convenios, setConvenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));
    const [grupoInput, setGrupoInput] = useState([
        { label: 'ASAP', value: 'S' },
        { label: 'UPC', value: 'U' },
    ]);

    const [valuesForm, setValuesForm] = useState({
        cardHolder: '',
        Protocolo: '',
        Campo: '',
        valorCampo: '',
        rutMedico: '',
        personCode: '',
        inEx: '',
        inExMedico: '',
        desde: null,
        hasta: null,
        maxEnvases: '',
    })

    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    //Function to handle the close of the modal
    const handleClose = () => {
        setShowModal(false);
    }

    const [desde, setDesde] = useState(new Date());
    const [hasta, setHasta] = useState(new Date());


    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        //check all the values of the form
        const fieldsToCheck = [
            { name: 'maxEnvases', error: 'Debe ingresar el maximo de envases' },
            { name: 'inEx', error: 'Debe ingresar Inclusión/Exclusión' },
            { name: 'hasta', error: 'Debe ingresar la fecha hasta' },
            { name: 'desde', error: 'Debe ingresar la fecha desde' },
            { name: 'personCode', error: 'Debe ingresar el codigo de carga' },
            { name: 'valorCampo', error: 'Debe ingresar el valor campo ASAP/UPC' },
            { name: 'Campo', error: 'Debe ingresar el campo ASAP/UPC' },
            { name: 'Protocolo', error: 'Debe ingresar el protocolo' },
            { name: 'cardHolder', error: 'Debe ingresar las credenciales' }
        ];

        let canContinue = true;

        if (valuesForm["rutMedico"] && !valuesForm["inExMedico"]) {
            handleShowModal('Error', 'Debe ingresar el Inclusión/Exclusión medico');
            setLoading(false);
            canContinue = false;
        } else if (!valuesForm["rutMedico"] && valuesForm["inExMedico"]) {
            handleShowModal('Error', 'Debe ingresar el rut del medico');
            setLoading(false);
            canContinue = false;
        }

        if (canContinue) {
            fieldsToCheck.forEach((field) => {
                if (valuesForm[field.name] === '' || valuesForm[field.name] === null) {
                    handleShowModal('Error', field.error);
                    setLoading(false);
                    canContinue = false;
                }
            });
        }

        if (valuesForm.desde > valuesForm.hasta) {
            handleShowModal('Error', 'La fecha desde no puede ser mayor a la fecha hasta');
            setLoading(false);
            canContinue = false;
        }

        if (canContinue) {
            valuesForm.rutMedico = valuesForm.rutMedico.replace(/\./g, '').replace(/\-/g, '');
            //set a variable exactly like valuesForm but with the date in the correct format call data
            const data = {
                ...valuesForm,
                desde: `${valuesForm.desde.$D}-${valuesForm.desde.$M + 1}-${valuesForm.desde.$y}`,
                hasta: `${valuesForm.hasta.$D}-${valuesForm.hasta.$M + 1}-${valuesForm.hasta.$y}`,
            }

            const response = await setAutorizaciones(data, usuario.correo);

            if (response.response[0].codigo === 0) {
                handleShowModal('Éxito', 'Autorización previa creada correctamente');
                //set all valuesForm to empty


            } else {
                handleShowModal('Error', 'Error al crear la autorización previa');
            }
            setLoading(false);
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

    //Handle show modal
    const handleShowModal = (title, msj) => {
        setTitle(title);
        setMsj(msj);
        setShowModal(true);
    }

    return (
        <main>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}
                <div className="row">
                    <div className="col">
                        <form onSubmit={handleSubmit}>
                            <Grid xs={12}>
                                <Grid xs={4}>
                                    <ContenedorTitulo>
                                        <Titulo>Informacion Personal</Titulo>
                                    </ContenedorTitulo>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid xs={4}>
                                    <FormLabel >Credenciales</FormLabel>
                                    <TextField

                                        id="cardHolder"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 60 }}
                                        value={valuesForm.cardHolder}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, cardHolder: event.target.value });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={4}>
                                    <FormLabel >Protocolo</FormLabel>
                                    <TextField

                                        id="Protocolo"
                                        variant="outlined"
                                        sx={{ width: '100%' }}

                                        inputProps={{ maxLength: 60 }}
                                        value={valuesForm.Protocolo}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, Protocolo: event.target.value });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={4}>
                                    <FormControl fullWidth >
                                        <FormLabel >Campo ASAP/UPC</FormLabel>

                                        <Select

                                            labelId="Campo"
                                            id="campo"
                                            value={valuesForm.Campo}
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, Campo: event.target.value });
                                            }}
                                        >
                                            {grupoInput.map((u) => (
                                                <MenuItem key={u.value} value={u.value}>
                                                    {u.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={4}>
                                    <FormLabel >Valor campo ASAP/UPC</FormLabel>
                                    <TextField
                                        id="valorCampo"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 60 }}
                                        value={valuesForm.valorCampo}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, valorCampo: event.target.value });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={4}>
                                    <FormLabel >Rut Medico</FormLabel>
                                    <TextField

                                        id="rutMedico"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 12 }}
                                        value={valuesForm.rutMedico}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, rutMedico: formatRut(event.target.value) });
                                        }}
                                    />

                                </Grid>
                                <Grid xs={4}>
                                    <FormLabel >Codigo de carga</FormLabel>
                                    <TextField
                                        id="personCode"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 60 }}
                                        value={valuesForm.personCode}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, personCode: event.target.value });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={4}>
                                    <FormLabel >Fecha Inicio</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker
                                            value={valuesForm.desde}
                                            sx={{ width: '100%' }}
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, desde: event });
                                            }}
                                            renderInput={(params) => <TextField fullWidth  {...params} />}
                                        />
                                    </LocalizationProvider>

                                </Grid>

                                <Grid xs={4}>
                                    <FormControl>
                                        <FormLabel >Inclusión/Exclusión</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={valuesForm.inEx}
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, inEx: event.target.value });
                                            }}
                                        >
                                            <FormControlLabel value="I" control={<Radio />} label="Inclusión" />
                                            <FormControlLabel value="E" control={<Radio />} label="Exclusión" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid xs={4}>
                                    <ContenedorTitulo>
                                        <Titulo>Cantidad Envases</Titulo>
                                    </ContenedorTitulo>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} >
                                <Grid xs={4}>
                                    <FormLabel >Fecha Termino</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker
                                            value={valuesForm.hasta}
                                            sx={{ width: '100%' }}
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, hasta: event });
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid xs={4}>
                                    <FormControl>
                                        <FormLabel >Inclusión/Exclusión Medico</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={valuesForm.inExMedico}
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, inExMedico: event.target.value });
                                            }}
                                        >
                                            <FormControlLabel value="I" control={<Radio />} label="Inclusión" />
                                            <FormControlLabel value="E" control={<Radio />} label="Exclusión" />
                                        </RadioGroup>
                                    </FormControl>

                                </Grid>
                                <Grid xs={2}>
                                    <FormLabel>Max Envases</FormLabel>
                                    <TextField
                                        id="maxEnvases"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 12, pattern: "[0-9]*", onKeyPress: e => e.key === ' ' && e.preventDefault() }}
                                        value={valuesForm.maxEnvases}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, maxEnvases: event.target.value });
                                        }}
                                    />


                                </Grid>
                                <Grid xs={2} style={{ marginTop: '30px' }}>
                                    <Button type="submit" variant="contained" size="large" sx={{ width: '100%' }}>Agregar</Button>
                                </Grid>
                            </Grid>

                        </form>
                    </div>
                </div>
            </div>
            <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
        </main >
    );
};
export default AutorizacionPreviaAdd;