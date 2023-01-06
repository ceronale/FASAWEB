import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Switch from '@mui/material/Switch';
import {
    Label,
    LabelReq,
    Inputs,
    GrupoInput,
    RestriccionPass,
    Inputp,
    ContenedorTitulo,
    Titulo
} from "../Formularios";
import FormAdministrarRoles from '../Forms/FormAdministrarRoles';
import ModalConfirmar from "../ModalConfirmar";

const ModalRoles = ({ show, handleClose, msj, title, name, description, propLeft, propRight }) => {
    const [showModalConfirmar, setShowModalConfirmar] = useState(false);
    const [nombre, setNombre] = useState(name);
    const [descripcion, setDescripcion] = useState(description);

    const onSubmit = async (e) => {
        e.preventDefault();
    };

    const onchangeNombre = (event) => {
        setNombre(event.target.value);
    };
    const onchangeDescripcion = (event) => {
        setDescripcion(event.target.value);
    };

    //Modal Confirmar
    const handleConfirmar = async () => {
        console.log("Confirmo");
        setShowModalConfirmar(false);
    }

    const handleCloseConfirmar = () => {
        setShowModalConfirmar(false);
    }
    const handleShowConfirmar = () => {
        setShowModalConfirmar(true);
    }

    return (
        <>
            <ModalConfirmar
                title={title}
                msj={msj}
                show={showModalConfirmar}
                handleClose={handleCloseConfirmar}
                handleYes={handleConfirmar} />
            <Modal show={show} onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rol de un usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>{msj}
                    <form onSubmit={onSubmit}>
                        <div className="row align-items-center">
                            <div>
                                <div className="container text-center">
                                    <div className="row">
                                        <div className="col-12">
                                            <ContenedorTitulo>
                                                <Titulo>Rol de un usuario</Titulo>
                                            </ContenedorTitulo>

                                            <GrupoInput>
                                                <Label>Nombre del rol </Label>
                                                <Inputs
                                                    type="text"
                                                    name="Nombre del rol"
                                                    placeholder=""
                                                    onChange={onchangeNombre}
                                                    value={nombre}
                                                    required />
                                            </GrupoInput>
                                            <GrupoInput>
                                                <Label>Descripcion</Label>
                                                <Inputs
                                                    type="text"
                                                    name="descripcion"
                                                    placeholder=""
                                                    onChange={onchangeDescripcion}
                                                    value={descripcion}
                                                    required />
                                            </GrupoInput>
                                            <GrupoInput>
                                                <Label>Componentes </Label>
                                                <FormAdministrarRoles propLeft={propLeft} propRight={propRight} />
                                            </GrupoInput>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowConfirmar}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal></>

    );
};

export default ModalRoles;