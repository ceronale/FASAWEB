import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
const ModalPdf = ({ Pdf, show, handleClose }) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w" size="xl">
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>
                    <iframe src={Pdf} frameborder="0" width="100%" height="600px"></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" onClick={handleClose}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalPdf;