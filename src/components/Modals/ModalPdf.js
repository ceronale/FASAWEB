import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';




import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const ModalPdf = ({ Pdf, show, handleClose }) => {
    const newplugin = defaultLayoutPlugin()
    return (
        <Modal show={show} onHide={handleClose} dialogClassName="modal-90w" size="xl">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                    <div style={{ height: '650px', width: '100%', overflow: 'scroll' }}>
                        <Viewer fileUrl={Pdf} plugins={[newplugin]} />
                    </div>
                </Worker>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="contained" onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalPdf;