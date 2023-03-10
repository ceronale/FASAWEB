import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import { Paper } from '@material-ui/core';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { UploadDocumentos, getDocumento, deleteDocumento } from '../../api/DocumentoService';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ModalAlert from '../Modals/ModalAlert';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ModalPdf from '../Modals/ModalPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalConfirmar from "../Modals/ModalConfirmar";
import { useNavigate, } from 'react-router-dom';


const Lista = props => {
    const paperRef = useRef(null);
    const inputRef = useRef(null);
    const [secondary] = useState(false);
    const [dense] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [pdfSrc, setPdfSrc] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [item, setItem] = useState();
    const navigate = useNavigate();

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
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

    const handleCloseModal = () => {
        setShowModal(false);
    }

    //Handle close modal pdf
    const handleCloseModalPdf = () => {
        setModalOpen(false);
    }

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const response = await UploadDocumentos(file, props.convenio);

            if (response === 403) {
                setShowModal(true)
                setTitle("Sesi??n expirada")
                setMsj("Su sesi??n ha expirado, por favor vuelva a ingresar")
                //set time out to logout of 5 seconds
                setTimeout(() => {
                    localStorage.removeItem("user");
                    navigate(`/`);
                }, 3000);
                return;
            }

            if (response.documentResponse[0].status !== 0) {
                setTitle('Error');
                setMsj("No se pudo subir el documento");
                setShowModal(true);
                return;
            } else {
                setTitle('Informaci??n');
                setMsj("Documento subido correctamente");
                setShowModal(true);
                props.fetchData();
                return;
            }

        }
    };

    const handleDownload = async (item) => {
        const archivo = item.nombreDocumento;
        const data = await getDocumentData(archivo);
        const b64 = data[0].b64;
        const element = document.createElement("a");
        element.setAttribute("href", `data:application/octet-stream;base64,${b64}`);
        element.setAttribute("download", archivo);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

    }

    const handleConfirmar = async () => {
        setShowModalConfirmar(false)
        const response = await deleteDocumento(item);

        if (response === 403) {
            setShowModal(true)
            setTitle("Sesi??n expirada")
            setMsj("Su sesi??n ha expirado, por favor vuelva a ingresar")
            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }
        //If response.response[0].codigo is 0 
        if (response.response1[0].codigo === 0) {
            setTitle('Informaci??n');
            setMsj("Documento eliminado correctamente");
            setShowModal(true);
            props.fetchData();
            return;
        } else {
            setTitle('Error');
            setMsj("No se pudo eliminar el documento");
            setShowModal(true);
            return;
        }
    }

    //Handle delete document
    const handleDelete = async (docu) => {
        setItem(docu.codigoDocumento);
        setTitle("??Desea continuar?")
        setMsj("Seleccione confirmar si desea eliminar el documento")
        setShowModalConfirmar(true)

    }

    const handleOpenPdf = async (item) => {
        const archivo = item.nombreDocumento;
        const data = await getDocumentData(archivo);
        if (data === 403) {
            setShowModal(true)
            setTitle("Sesi??n expirada")
            setMsj("Su sesi??n ha expirado, por favor vuelva a ingresar")
            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }
        const b64 = data[0].b64;
        setPdfSrc(`data:application/pdf;base64,${b64}`);
        setModalOpen(true);
    };

    const getDocumentData = async (archivo) => {
        const data = {
            archivo,
            convenio: props.convenio,
        }
        const response = await getDocumento(data);
        if (response === 403) {
            setShowModal(true)
            setTitle("Sesi??n expirada")
            setMsj("Su sesi??n ha expirado, por favor vuelva a ingresar")
            //set time out to logout of 5 seconds
            setTimeout(() => {
                localStorage.removeItem("user");
                navigate(`/`);
            }, 3000);
            return;
        }
        return response.documentResponse;
    }
    function generate(data) {
        const dataChunks = [];
        try {

            if (data) {
                // Filter the data array based on the search term
                const filteredData = data.filter(item =>
                    item.nombreDocumento.toLowerCase().includes(searchTerm.toLowerCase())
                );
                // Split the filtered data array into chunks
                for (let i = 0; i < filteredData.length; i += rowsPerPage) {
                    dataChunks.push(filteredData.slice(i, i + rowsPerPage));
                }
            }

        } catch (error) {

        }



        if (page >= 0 && page < dataChunks.length) {
            return dataChunks[page].map(item => (
                <ListItem
                    key={item.codigoDocumento}
                    secondaryAction={
                        <>

                            <IconButton edge="end" aria-label="delete" onClick={() => { handleDownload(item); }}>
                                <FileDownloadIcon />
                            </IconButton>
                            {
                                item.nombreDocumento.includes('.pdf') &&
                                <IconButton edge="end" aria-label="open pdf" onClick={() => { handleOpenPdf(item); }}>
                                    <PictureAsPdfIcon />
                                </IconButton>
                            }
                            <IconButton color="error" edge="end" aria-label="delete" onClick={() => { handleDelete(item); }}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.nombreDocumento}
                        secondary={secondary ? item.secondary : null}
                    />
                </ListItem>
            ));
        } else {
            return <p>No hay documentos con ese nombre</p>;
        }
    }
    return (
        <>

            <ModalConfirmar
                title={title}
                msj={msj}
                show={showModalConfirmar}
                handleClose={handleCloseConfirmar}
                handleYes={handleConfirmar} />
            <Paper
                ref={paperRef}
                style={{ maxHeight: 600, overflow: 'auto' }}>
                <Box p={3} display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Documentos {props.convenio}</Typography>
                    <div>
                        <TextField
                            label="Buscar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            size="small" />
                        <label htmlFor="file-input">
                            <Button sx={{ marginLeft: 3 }} variant="contained" color="primary" component="span">
                                +
                            </Button>
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={handleUpload} />
                    </div>

                </Box>
                <List dense={dense}>{generate(props.data)}</List>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>
            <ModalPdf show={modalOpen} handleClose={handleCloseModalPdf} Pdf={pdfSrc} />
            <ModalAlert title={title} show={showModal} handleClose={handleCloseModal} msj={msj} />
        </>
    );
};
export default Lista;
