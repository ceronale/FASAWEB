import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';


const ModalAlert = ({ show, handleClose, msj, title }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}</Modal.Body>
            <Modal.Footer>
                <Button variant='contained' onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};



export default ModalAlert;