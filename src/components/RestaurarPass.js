import React, { useState, useEffect } from "react";
import { Label, LabelReq, RestriccionPass, Inputc, ContenedorTitulo, Titulo } from "./Formularios";
import ModalTest from "./ModalTest";
import { useNavigate, useLocation } from 'react-router-dom';
import { ActualizarPass } from "../api/ActualizarPass";
import "../styles/RestaurarPass.css";

const initialForm = {
    passwd: '',
    passwd2: '',
};

const FormRestaurarPass = (user) => {

    const navigate = useNavigate();
    const [title, setTitle] = useState();
    const [msj, setMsj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [usuario, setUsuario] = useState(JSON.parse(user.user))
    const [isValid, setIsValid] = useState(false);

    const handleClose = () => {
        setShowModal(false);
        if (isValid) {
            //Redireccionar al home usuario cliente recien creado
            localStorage.removeItem("user");
            navigate(`/`);
            handleClear();
        }
    }

    const [registerData, setRegisterData] = useState({
        passwd: '',
        passwd2: '',
    });

    const { passwd, passwd2 } = registerData;

    const location = useLocation();
    const emailparam = location.pathname.split("/")

    //Validaciones
    const onSubmit = async (e) => {
        e.preventDefault();
        var isPassValid = contraseñaValidar();
        if (isPassValid) {
            console.log(usuario);
            const respActualizar = await ActualizarPass(usuario, registerData.passwd);
            console.log(respActualizar);
            //var mensaje = respActualizar['respuesta'][0]['detalleResultado'];
            if (respActualizar['respuesta'].length === 1) {
                setIsValid(true);
                setShowModal(true)
                setTitle("Restaurar Contraseña")
                setMsj("Su contraseña ha sido modificada correctamente.")
            } else {
                setShowModal(true)
                setTitle("Error de restauración")
                setMsj("La nueva contraseña ya fue utilizada anteriormente.")
            }
        }
    };

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
                <div className="central">
                    <ContenedorTitulo>
                        <Titulo>Restaurar Contraseña</Titulo>
                    </ContenedorTitulo>
                    <div className="leyenda">
                        <label>
                            Ingrese una nueva contraseña.
                        </label>
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
                            se exige una letra minuscula y una mayuscula,
                            un numero y un caracter especial.

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
                            <button className="buttomRestablecerPass">Restablecer Contraseña</button>
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

export default FormRestaurarPass;