import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ModalTest = ({show,handleClose,msj,title}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalTest;