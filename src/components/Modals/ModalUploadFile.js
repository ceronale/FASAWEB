import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UploadFilePolizas from "../UploadFile/UploadFilePolizas";




const ModalUploadFile = ({ show, handleClose, msj, title }) => {




    return (
        <Modal show={show} onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}

                <UploadFilePolizas>

                </UploadFilePolizas>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUploadFile;