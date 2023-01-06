import React, { useState, useEffect } from "react";
import "../styles/PolizasGrupos.css";
import { ContenedorTitulo, Titulo } from "./Formularios";
import { PolizaService } from "../api/PolizaService";
import DataTableEditAndExport from "./DataTable/DataTablePoliza";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

const FormPolizas = (user) => {
    const [filtrarValue, setFiltrarValue] = useState('')
    const [usuario, setUsuario] = useState(JSON.parse(user.user))
    const [convenios, setConvenios] = useState([]);

    // 1.-Configurar Hooks
    const [dataTable, setDataTable] = useState()

    // 2.-Funcion para mostrar los datos
    const showData = async () => {
        setDataTable(undefined)

        const response = await PolizaService(filtrarValue)

        setDataTable(response.response)
    }

    const onChange = (e) => {
        setFiltrarValue(e.target.value);
    };

    //Get the values from usuario.convenios that are limited by comman and put them in an array when the component is mounted using useEffect
    useEffect(() => {
        console.log(usuario);
        const convenios = usuario.convenio.split(",");
        const conveniosJson = convenios.map((convenio, index) => ({ label: convenio, value: convenio }));
        console.log(conveniosJson);
        setConvenios(conveniosJson);
    }, []);


    return (
        <main>
            <div>
                <ContenedorTitulo>
                    <Titulo>Visualización de Pólizas y Grupos</Titulo>
                </ContenedorTitulo>
                <div id="notaLogin">
                    En esta seccion podras editar, descargar y cargar masivamente.
                </div>
                <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
                    <Grid container spacing={2}>
                        <Grid xs={6}>
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Convenios</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Convenios"
                                    value={filtrarValue}
                                    onChange={onChange}
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
                        : <DataTableEditAndExport
                            data={dataTable}
                        />
                }

            </div>
        </main>
    );
}

export default FormPolizas;