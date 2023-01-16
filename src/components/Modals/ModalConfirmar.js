import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import Grid from '@mui/material/Unstable_Grid2';

const ModalConfirmar = ({ show, handleClose, handleYes, msj, title }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}</Modal.Body>
            <Modal.Footer>
                <Grid xs={2} sm={4} md={4}>
                    <Button variant="contained" onClick={handleYes}>
                        Confirmar
                    </Button>
                </Grid>
                <Grid xs={2} sm={4} md={4}>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Grid>

            </Modal.Footer>
        </Modal >
    );
};

export default ModalConfirmar;