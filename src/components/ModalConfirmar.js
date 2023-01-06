import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ModalConfirmar = ({ show, handleClose, handleYes, msj, title }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleYes}>
                    Confirmar
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalConfirmar;