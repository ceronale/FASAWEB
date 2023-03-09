import React, { useState } from "react";
import { useNavigate, } from 'react-router-dom';
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { PolizaService } from "../api/PolizaService";
import DataTableEditAndExport from "./DataTable/DataTablePoliza";
import { Box, FormControl, Button, TextField, Autocomplete } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ModalAlert from "./Modals/ModalAlert";
import CircularProgress from "@mui/material/CircularProgress";


const PolizasGrupos = ({ user }) => {
    // state to store the selected filter value
    const [filtrarValue, setFiltrarValue] = useState(null);
    // state to store the parsed user object
    const [usuario] = useState(JSON.parse(user));
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
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();


    const showData = async () => {
        try {
            //check if the user has selected a value
            if (filtrarValue === null) {
                handleModal("Error", "Debe seleccionar un convenio");
                return;
            }
            //call the service to get the data
            setLoading(true);
            const response = await PolizaService(filtrarValue.value);

            if (response === 403) {
                setTitle("Sesión expirada")
                setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
                setShowModal(true)
                //set time out to logout of 5 seconds
                setTimeout(() => {
                    localStorage.removeItem("user");
                    navigate(`/`);
                }, 3000);
                return;
            }




            if (response.name === 'AxiosError' && response.code === 'ERR_NETWORK') {
                setLoading(false);
                handleModal("Error", "No se pudo obtener la información de las pólizas y grupos");
            } else {
                setLoading(false);
                setDataTable(undefined)
                setDataTable(response.response);
                setIsButtonDisabled(false);
            }
        } catch (error) {
            setLoading(false);
            handleModal("Error", "No se pudo obtener la información de las pólizas y grupos");
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


    return (
        <main>
            <div style={{ position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
                        <CircularProgress />
                    </div>
                )}
                <div>
                    <ContenedorTitulo>
                        <Titulo>Visualización de Pólizas y Grupos</Titulo>
                    </ContenedorTitulo>
                    <div id="notaLogin">
                        En esta sección podrás listar, editar, importar y exportar pólizas y grupos.
                    </div>
                    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <FormControl fullWidth>
                                    <Autocomplete

                                        value={filtrarValue}
                                        onChange={(event, newValue) => {
                                            setFiltrarValue(newValue);
                                        }}
                                        id="select-convenio"
                                        options={convenios}
                                        renderInput={(params) => <TextField {...params} label="Convenio" />}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid xs={3}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={showData}
                                    style={{ marginTop: 5 }}
                                >
                                    Filtrar
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        (dataTable === undefined)
                            ?
                            null
                            : <DataTableEditAndExport data={dataTable} user={usuario} isButtonDisabled={isButtonDisabled} convenio={filtrarValue} updateData={showData} />
                    }
                </div>
                <ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
            </div>
        </main>

    );
};

export default PolizasGrupos;

