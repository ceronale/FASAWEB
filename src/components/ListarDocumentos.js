import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { ContenedorTitulo, Titulo } from './Formularios';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper } from '@material-ui/core';
import TablePagination from '@mui/material/TablePagination';

import TextField from '@mui/material/TextField';

const ListaDocumentos = props => {
    const [secondary, setSecondary] = useState(false);
    const [dense, setDense] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const data = [
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

    function generate(data) {
        // Filter the data array based on the search term
        const filteredData = data.filter(item =>
            item.primary.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Split the filtered data array into chunks
        const dataChunks = [];
        for (let i = 0; i < filteredData.length; i += rowsPerPage) {
            dataChunks.push(filteredData.slice(i, i + rowsPerPage));
        }


        if (page >= 0 && page < dataChunks.length) {
            return dataChunks[page].map(item => (
                <ListItem
                    key={item.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <CloudUploadIcon />
                        </IconButton>
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.primary}
                        secondary={secondary ? item.secondary : null}
                    />
                </ListItem>
            ));
        } else {
            return <p>No hay documentos con ese nombre</p>;
        }

        // Return the appropriate chunk based on the current page

    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    return (
        <>
            <main>
                <ContenedorTitulo>
                    <Titulo>Visualización de documentos</Titulo>
                </ContenedorTitulo>
                <div id="notaLogin">
                    En esta sección se mostraran los archivos asociados.
                </div>

                <Paper style={{ maxHeight: 600, overflow: 'auto' }}>
                    <Box p={3} display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">Documentos</Typography>
                        <TextField
                            label="Buscar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            size="small"
                        />
                    </Box>
                    <List dense={dense}>{generate(data)}</List>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}

                    />
                </Paper>
            </main>
        </>
    );
};

export default ListaDocumentos;