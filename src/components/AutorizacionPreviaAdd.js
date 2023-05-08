import React, { useState } from "react";
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
import { Radio, Autocomplete } from "@mui/material";
import { FormControlLabel, FormLabel } from "@mui/material";
import { setAutorizaciones, descripcionProductos, getBeneficiarioCarga } from '../api/AutorizacionesPreviasService';
import 'dayjs/locale/es';
import { useNavigate, } from 'react-router-dom';



const AutorizacionPreviaAdd = (user) => {

    //State to handle the user data
    const [usuario] = useState(JSON.parse(user.user));
    //State to handle the convenios of the user
    const [convenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));

    const [grupoInput] = useState([
        { label: 'SAP', value: 'S' },
        { label: 'UPC', value: 'U' },
    ]);
    const navigate = useNavigate();

    const [valuesForm, setValuesForm] = useState({
        cardHolder: '',
        convenio: '',
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
    const [cargas, setCargas] = useState([]);
    const [carga, setCarga] = useState();
    const [nombreTitular, setNombreTitular] = useState([]);
    const [codigoDeCarga, setCodigoDeCarga] = useState();

    //Values of not editable fields
    const [detalleProducto, setDetalleProducto] = useState();

    //Function to handle the close of the modal
    const handleClose = () => {
        setShowModal(false);
    }

    const handleSubmit = async (event) => {
        try {

            event.preventDefault();
            setLoading(true);
            //create a copy of the valuesForm
            const copyValuesForm = { ...valuesForm };

            //check all the values of the form
            const fieldsToCheck = [
                { name: 'maxEnvases', error: 'Debe ingresar el maximo de envases' },
                { name: 'hasta', error: 'Debe ingresar la fecha termino' },
                { name: 'desde', error: 'Debe ingresar la fecha de inicio' },
                { name: 'personCode', error: 'Debe ingresar el codigo de carga' },
                { name: 'valorCampo', error: 'Debe ingresar el valor campo SAP/UPC' },
                { name: 'Campo', error: 'Debe ingresar el campo SAP/UPC' },
                { name: 'convenio', error: 'Debe ingresar el convenio' },
                { name: 'cardHolder', error: 'Debe ingresar el rut' }
            ];

            let canContinue = true;
            if (copyValuesForm["rutMedico"] && !copyValuesForm["inExMedico"]) {
                handleShowModal('Error', 'Debe ingresar el Inclusión/Exclusión medico');
                setLoading(false);
                canContinue = false;
            } else if (!copyValuesForm["rutMedico"] && copyValuesForm["inExMedico"]) {
                handleShowModal('Error', 'Debe ingresar el rut del medico');
                setLoading(false);
                canContinue = false;
            }

            //check if detalleProducto is empty
            if (detalleProducto === '') {
                handleShowModal('Error', 'El producto ingresado no existe');
                setLoading(false);
                canContinue = false;
            }



            if (canContinue) {
                fieldsToCheck.forEach((field) => {
                    if (copyValuesForm[field.name] === '' || copyValuesForm[field.name] === null) {
                        handleShowModal('Error', field.error);
                        setLoading(false);
                        canContinue = false;
                    }
                });
            }


            if (copyValuesForm.desde > copyValuesForm.hasta) {
                handleShowModal('Error', 'La fecha desde no puede ser mayor a la fecha hasta');
                setLoading(false);
                canContinue = false;
            }

            if (canContinue) {
                //eslint-disable-next-line
                copyValuesForm.cardHolder = copyValuesForm.convenio.value + copyValuesForm.cardHolder.replace(/\./g, '').replace(/\-/g, '');

                //eslint-disable-next-line
                copyValuesForm.rutMedico = copyValuesForm.rutMedico.replace(/\./g, '').replace(/\-/g, '');
                copyValuesForm.convenio = copyValuesForm.convenio.value;

                //set a variable exactly like valuesForm but with the date in the correct format call data
                const data = {
                    ...copyValuesForm,
                    desde: `${copyValuesForm.desde.$D}-${copyValuesForm.desde.$M + 1}-${copyValuesForm.desde.$y}`,
                    hasta: `${copyValuesForm.hasta.$D}-${copyValuesForm.hasta.$M + 1}-${copyValuesForm.hasta.$y}`,
                }

                const response = await setAutorizaciones(data, usuario.correo);
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

                if (response.response[0].codigo === 0) {
                    handleShowModal('Éxito', 'Autorización previa creada correctamente');
                    //set all valuesForm to empty
                    setValuesForm({
                        cardHolder: '',
                        convenio: '',
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

                    //setCargas, setCarga, setNombreTitular, setCodigoDeCarga to empty
                    setCargas([]);
                    setCarga('');
                    setNombreTitular([]);
                    setCodigoDeCarga('');
                    setDetalleProducto('');


                } else {
                    handleShowModal('Error', 'Error al crear la autorización previa');
                }
                setLoading(false);
            }
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

    //Handle show modal
    const handleShowModal = (title, msj) => {
        setTitle(title);
        setMsj(msj);
        setShowModal(true);
    }



    //Fill the value of Detalle Producto
    const generarDetalleProducto = async () => {
        if (valuesForm.Campo && valuesForm.valorCampo) {
            let aux;

            if (valuesForm.Campo.toUpperCase() === 'S') {
                aux = 'SAP'
            } else {
                aux = 'UPC'
            }

            const response = await descripcionProductos(aux, valuesForm.valorCampo);
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
            if (response.descripcion[0].codigo_resultado === 0) {

                setDetalleProducto(response.descripcion[0].nombre_producto);

            } else if (response.descripcion[0].codigo_resultado === 1) {
                setShowModal(true)
                setTitle("Información")
                setMsj("No se encontraron resultados");
                setDetalleProducto("");
            } else {
                setShowModal(true)
                setTitle("Error")
                setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
                setDetalleProducto("");
            }



        }
    }

    //Fill the value of Detalle Producto
    const generarBenficiarioAndCargas = async () => {
        setNombreTitular('');
        setCargas([]);
        setCarga(null);
        setCodigoDeCarga('');
        if (valuesForm.cardHolder && valuesForm.convenio) {

            //replace valuesForm.cardHolder - and . with nothing
            let aux = valuesForm.cardHolder.replace(/\./g, '').replace(/\-/g, '');

            const response = await getBeneficiarioCarga(valuesForm.convenio.label, aux);
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

            //if response.response array is larger than 0 splice it get the first elemente in a variable and the other ones in another variable 
            if (response.response.length > 0) {

                if (response.response.length === 1) {
                    setNombreTitular(response.response[0].apellido1 + ' ' + response.response[0].apellido2 + ' ' + response.response[0].nombre);
                    setValuesForm({ ...valuesForm, personCode: response.response[0].codigoCarga });
                    setCargas([]);
                } else {
                    const [first, ...rest] = response.response;
                    setNombreTitular(first.apellido1 + ' ' + first.apellido2 + ' ' + first.nombre);
                    //cargas must be array of objects value and label the value must the object rest and the label must be the concatenation of apellido1, apellido2 and nombre

                    console.log(response.response)
                    console.log(first)
                    console.log(rest)
                    setCargas(response.response.map((item) => {
                        return {
                            value: item,
                            label: item.apellido1 + ' ' + item.apellido2 + ' ' + item.nombre
                        }
                    }));
                }

            } else if (response.response.length === 0) {
                setShowModal(true)
                setTitle("Información")
                setMsj("No se encontraron resultados");

            } else {
                setNombreTitular(response.response[0]);
                setCargas([]);
            }



        } else {
            setNombreTitular('');
            setCargas([]);
        }
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
                                        <Titulo>Agregar autorización</Titulo>
                                    </ContenedorTitulo>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid xs={4}>
                                    <FormLabel >Convenios</FormLabel>
                                    <Autocomplete
                                        value={valuesForm.convenio}
                                        variant="outlined"
                                        onChange={(event, newValue) => {
                                            setValuesForm({ ...valuesForm, convenio: newValue });
                                            generarBenficiarioAndCargas();
                                        }}
                                        id="controllable-states-demo"
                                        options={convenios}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid xs={2}>
                                    <FormLabel >Rut titular</FormLabel>
                                    <TextField
                                        id="cardHolder"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 12 }}
                                        onBlur={generarBenficiarioAndCargas}
                                        value={valuesForm.cardHolder}
                                        onChange={(event) => {
                                            setValuesForm({ ...valuesForm, cardHolder: formatRut(event.target.value) });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={6}>
                                    <FormLabel >Nombre titular</FormLabel>
                                    <TextField
                                        id="cardHolder"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 12 }}
                                        disabled
                                        value={nombreTitular}

                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{ marginTop: '5px' }}>
                                <Grid xs={4}>
                                    <FormLabel >Seleccione carga</FormLabel>
                                    <Autocomplete
                                        value={carga}
                                        variant="outlined"
                                        onChange={(event, newValue) => {
                                            setCarga(newValue);
                                            setValuesForm({ ...valuesForm, personCode: newValue?.value?.codigoCarga });
                                        }}


                                        id="controllable-states-demo"
                                        options={cargas}
                                        renderInput={(params) => <TextField {...params} />}
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
                                        disabled
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
                            </Grid>
                            <Grid container spacing={2} style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <Grid xs={2}>
                                    <FormControl fullWidth>
                                        <FormLabel>Campo SAP/UPC</FormLabel>
                                        <Select
                                            labelId="Campo"
                                            id="campo"
                                            value={valuesForm.Campo}
                                            onBlur={generarDetalleProducto}
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
                                <Grid xs={3}>
                                    <FormLabel>Valor campo SAP/UPC</FormLabel>
                                    <TextField
                                        id="valorCampo"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 60 }}
                                        type="number"
                                        onBlur={generarDetalleProducto} // Agrega el evento onBlur
                                        onChange={(event) => {
                                            const value = event.target.value.replace(/\D/g, '');
                                            setValuesForm({ ...valuesForm, valorCampo: value });
                                        }}
                                    />
                                </Grid>
                                <Grid xs={7}>
                                    <FormLabel>Detalle de producto</FormLabel>
                                    <TextField
                                        id="cardHolder"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        inputProps={{ maxLength: 12 }}
                                        disabled
                                        value={detalleProducto}
                                    />
                                </Grid>
                                <Grid xs={4} style={{ marginTop: '5px' }}>
                                    <FormControl>
                                        <FormLabel>Inclusión/Exclusión</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={valuesForm.inEx || "I"} // set the default value to "I" if it's undefined or null
                                            onChange={(event) => {
                                                setValuesForm({ ...valuesForm, inEx: event.target.value });
                                            }}
                                        >
                                            <FormControlLabel value="I" control={<Radio />} label="Inclusión" />
                                            <FormControlLabel value="E" control={<Radio />} label="Exclusión" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <hr></hr>
                            <Grid container spacing={2} style={{ marginTop: '10px' }}>
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


                                <Grid xs={4} style={{ marginTop: '5px' }}>
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
                                            <FormControlLabel value={null} control={<Radio />} label="Ninguno" />

                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{ marginTop: '10px' }}>
                                <Grid xs={4}>
                                    <FormLabel >Fecha Inicio</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
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
                                    <FormLabel >Fecha Termino</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
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
                            </Grid>

                            <Grid container spacing={2} style={{ marginTop: '10px' }}>
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

