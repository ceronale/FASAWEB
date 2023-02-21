import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import UploadFileBeneficiarios from "../UploadFile/UploadFileBeneficiarios";




const ModalUploadFileBeneficiarios = ({ show, handleClose, msj, title, convenio }) => {
    return (
        <Modal show={show} onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msj}

                <UploadFileBeneficiarios convenio={convenio}>

                </UploadFileBeneficiarios>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUploadFileBeneficiarios;