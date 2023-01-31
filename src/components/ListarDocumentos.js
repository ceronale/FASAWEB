import { useState, useEffect } from 'react';
import { ContenedorTitulo, Titulo } from './Formularios';
import "../styles/ListarDocumentos.css";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Lista from './Listas/ListaDocumentos';
import { Typography } from '@mui/material';
import { getDocumentos } from '../api/DocumentoService';
const ListaDocumentos = (user) => {
    const usuario = (JSON.parse(user.user));
    const [convenios, setConvenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));


    const getDataForConvenio = async (convenioValue) => {
        //         const data = await getDocumentos(convenioValue);

    }

    function CreateTabs(convenios) {
        const [tab, setTab] = useState(0);
        const [data, setData] = useState([]);

        async function fetchData() {
            const data = await getDocumentos(convenios[tab].value);

            const arrayData = Object.values(data.response);
            if (arrayData.length > 0) {
                setData(arrayData);
            } else {
                setData([]);
            }
        }
        useEffect(() => {

            fetchData();
        }, [tab, convenios]);

        const handleTabChange = (event, newValue) => {
            setTab(newValue);
        };

        return (
            <div>
                <Tabs value={tab} onChange={handleTabChange} scrollButtons="auto" variant="scrollable" TabIndicatorProps={{ style: { background: 'red' } }} >
                    {convenios.map((convenio, index) => (
                        <Tab key={convenio.value} label={convenio.label} />
                    ))}
                </Tabs>
                <div>
                    <Lista data={data} convenio={convenios[tab].label} fetchData={fetchData} />
                </div>
            </div>
        );
    }




    return (
        <>
            <main>
                <ContenedorTitulo>
                    <Titulo>Visualización de documentos</Titulo>
                </ContenedorTitulo>
                <div className='textl'>
                    En esta sección, se presentarán los archivos relacionados. Puede seleccionar el convenio del cual desea ver los documentos en la parte inferior.
                </div>
                <div>
                    <Typography variant="subtitle1">Convenios</Typography>
                    {CreateTabs(convenios)}
                </div>
            </main >
        </>
    );
};

export default ListaDocumentos;