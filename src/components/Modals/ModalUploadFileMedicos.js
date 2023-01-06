import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import UploadFileMedicos from "../UploadFile/UploadFileMedicos";




const ModalUploadFileMedicos = ({ show, handleClose, msj, title }) => {

    return (
        <Modal show={show} onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}

                <UploadFileMedicos>

                </UploadFileMedicos>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

export default ModalUploadFileMedicos;