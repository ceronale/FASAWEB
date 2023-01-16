import { useState, useEffect } from 'react';
import { ContenedorTitulo, Titulo } from './Formularios';
import "../styles/ListarDocumentos.css";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Lista from './Listas/ListaDocumentos';
import { Typography } from '@mui/material';
const ListaDocumentos = (user) => {
    const usuario = (JSON.parse(user.user));
    const [convenios, setConvenios] = useState(usuario.convenio.split(",").map((convenio, index) => ({ label: convenio, value: convenio })));

    function getDataForConvenio(convenioValue) {
        console.log(convenioValue)
        var data = [
            { id: 0, primary: 'Item 1', secondary: 'Secondary text 1' },
            { id: 1, primary: 'Item 2', secondary: 'Secondary text 2' },
            { id: 2, primary: 'Item 3', secondary: 'Secondary text 3' },
            { id: 3, primary: 'Item 4', secondary: 'Secondary text 4' },
            { id: 4, primary: 'Item 5', secondary: 'Secondary text 5' },
            { id: 5, primary: 'Item 6', secondary: 'Secondary text 6' },
            { id: 6, primary: 'Item 7', secondary: 'Secondary text 7' },
            { id: 7, primary: 'Item 8', secondary: 'Secondary text 8' },
            { id: 8, primary: 'Item 9', secondary: 'Secondary text 9' },
            { id: 9, primary: 'Item 10', secondary: 'Secondary text 10' },
            { id: 10, primary: 'Item 11', secondary: 'Secondary text 11' },
            { id: 11, primary: 'Item 12', secondary: 'Secondary text 12' },
            { id: 12, primary: 'Item 13', secondary: 'Secondary text 13' },
            { id: 13, primary: 'Item 14', secondary: 'Secondary text 14' },
            { id: 14, primary: 'Item 15', secondary: 'Secondary text 15' },
            // ...
        ];

        //create different array depending of the value of convenioValue
        if (convenioValue === 'VALP') {
            return data = data.filter(item => item.primary.includes('1'));
        }
        if (convenioValue === 'INNA') {
            return data = data.filter(item => item.primary.includes('2'));
        }
        if (convenioValue === 'GERV') {
            return data = data.filter(item => item.primary.includes('3'));
        }
    }

    function CreateTabs(convenios) {
        const [tab, setTab] = useState(0);
        const [data, setData] = useState([]);

        useEffect(() => {
            async function fetchData() {

                setData(getDataForConvenio(convenios[tab].value));
                console.log()
            }
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
                    <Lista data={data} convenio={convenios[tab].label} />
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