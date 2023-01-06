import React, { useState, useEffect } from "react";
import { Label, LabelReq, RestriccionPass, Inputc, ContenedorTitulo, Titulo } from "./Formularios";
import ModalTest from "./ModalTest";
import { useNavigate, useLocation } from 'react-router-dom';
import { ActualizarPass } from "../api/ActualizarPass";
import { LoginService } from "../api/LoginService";
import "../styles/ModificarPass.css";

const initialForm = {
    passwdActual: '',
    passwd: '',
    passwd2: '',
};

const FormModificarPass = (user) => {

    //Variables
    const navigate = useNavigate();
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [usuario, setUsuario] = useState(JSON.parse(user.user))
    const [IsValid, setIsValid] = useState(false);
    //const handleClose = () => setShowModal(false);

    const handleClose = () => {
        setShowModal(false);
        if (IsValid) {
            //Redireccionar al home
            navigate(`/home`);
            handleClear();
        }
    }

    //Register Data
    const [registerData, setRegisterData] = useState({
        passwdActual: '',
        passwd: '',
        passwd2: '',
    });

    const { passwdActual, passwd, passwd2 } = registerData;

    //User
    const location = useLocation();


    //Validaciones
    const onSubmit = async (e) => {
        e.preventDefault();
        var isPassValid = contraseñaValidar();
        if (isPassValid) {
            //var aux = respActualizar['respuesta'][0]['codigoRespuesta'];
            //var mensaje = respActualizar['respuesta'][0]['detalleResultado'];

            const registerUsuario = {
                email: usuario.correo,
                password: registerData.passwdActual,
            };

            //Login Service
            const resp = await LoginService(registerUsuario);
            const r = JSON.parse(resp);

            if (r.login[0].codigoResultadoLogin === 0) {
                const respActualizar = await ActualizarPass(usuario.correo, registerData.passwd);
                console.log(respActualizar);
                if (respActualizar['respuesta'].length === 1) {
                    setIsValid(true);
                    setShowModal(true)
                    setTitle("Restaurar Contraseña ")
                    setMsj("Contraseña modificada correctamente.")
                } else if (respActualizar['respuesta'].length === 0) {
                    setShowModal(true)
                    setTitle("Error en la restauración")
                    setMsj("La nueva contraseña ya fue utilizada anteriormente.")
                }
            } else {
                setShowModal(true)
                setTitle("Error de contraseña")
                setMsj("La contraseña actual es incorrecta.")
            }
        }
    };

    //On Change
    const onchange = (event) => {
        setRegisterData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    // Validacion de contraseña (Caracteres)
    function contraseñaValidar() {
        const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        var contains_number = /\d/.test(registerData.passwd);
        var contains_special_character = format.test(registerData.passwd);
        var contains_letter = /[a-zA-Z]/.test(registerData.passwd);
        var contains_upperletter = /[A-Z]/.test(registerData.passwd);
        if (!contains_letter) {
            setShowModal(true)
            setTitle("Error en la contraseña")
            setMsj("La contraseña debe contener al menos una letra.")
            return false;
        } else if (!contains_upperletter) {
            setShowModal(true)
            setTitle("Error en la contraseña")
            setMsj("La contraseña debe contener al menos una letra mayuscula.")
        } else if (!contains_number) {
            setShowModal(true)
            setTitle("Error en la contraseña")
            setMsj("La contraseña debe contener al menos un numero.")
            return false;
        } else if (!contains_special_character) {
            setShowModal(true)
            setTitle("Error en la contraseña")
            setMsj("La contraseña debe contener al menos un caracter especial.")
            return false;
        } else if (registerData.passwd !== registerData.passwd2) {
            setShowModal(true)
            setTitle("Error en la contraseña")
            setMsj("Las contraseñas ingresadas no coinciden.")
            return false;
        } else {
            return true;
        }
        return false;
    };

    const handleClear = () => {
        setRegisterData(initialForm);
    };

    return (
        <main>
            <form onSubmit={onSubmit}>
                <div className="boxCentral">
                    <ContenedorTitulo>
						<Titulo>Modificar Contraseña</Titulo>
					</ContenedorTitulo>
                    <div className="leyenda">
                        <label>
                            Para poder modificar su contraseña ingrese la clave anterior
                            y una nueva clave.
                        </label>
                    </div>
                    <div className="boxEmail">
                        <Label htmlFor="">Contraseña Actual <LabelReq htmlFor=""> *</LabelReq></Label>
                        <Inputc
                            type="password"
                            placeholder=""
                            name="passwdActual"
                            value={passwdActual}
                            onChange={onchange}
                            min="7"
                            max="20"
                            required
                        />
                        <RestriccionPass>
                            Ingresar su contraseña que posee actualmente.
                        </RestriccionPass>
                    </div>
                    <div className="boxEmail">
                        <Label htmlFor="">Nueva Contraseña <LabelReq htmlFor=""> *</LabelReq></Label>
                        <Inputc
                            type="password"
                            placeholder=""
                            name="passwd"
                            value={passwd}
                            onChange={onchange}
                            min="7"
                            max="20"
                            required
                        />
                        <RestriccionPass>
                            La contraseña debe contener desde 7 a 20 caracteres,
                            se exige una letra minuscula y una mayuscula, un numero y un caracter especial.
                        </RestriccionPass>
                    </div>
                    <div className="boxEmail">
                        <Label htmlFor="">Confirmar Contraseña <LabelReq htmlFor=""> *</LabelReq></Label>
                        <Inputc
                            type="password"
                            placeholder=""
                            name="passwd2"
                            value={passwd2}
                            onChange={onchange}
                            min="7"
                            max="20"
                            required
                        />
                    </div>
                    <div className="blockFinal">
                        <div className="campoRequerido">
                            <span className="obligatorio">* Campos requeridos</span>
                        </div>
                        <div className="blockCrearCuenta">
                            <button className="buttomActualizar" onClick={handleClose} >Actualizar</button>
                        </div>
                    </div>
                </div>
            </form>
            <ModalTest
                title={title}
                show={showModal}
                handleClose={handleClose}
                msj={msj}
            />
        </main>
    );
}

export default FormModificarPass;