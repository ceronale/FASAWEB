import React, { useState, useRef, useEffect } from 'react';
import { LoginService } from '../../api/LoginService';
import { useNavigate, } from 'react-router-dom';
import styles from './styles.module.css';
import ReCAPTCHA from "react-google-recaptcha";
import { NavLink } from "react-router-dom";
import "../../styles/Login.css";
import {
	Label,
	LabelReq,
	Inputs,
	GrupoInput,
	Inputp,
	Titulo,
	DivTitulos
} from "../Formularios";

import ModalTest from '../ModalTest';
import { HomeServiceEmpresa } from "../../api/HomeEmpresaService";


const FormLogin = () => {


	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			console.log(foundUser);
		}
	}, []);

	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);
	const [msj, setMsj] = useState();
	const [title, setTitle] = useState();

	//const handleClose = () => {
	//	setShowModal(false);
	//}
	const [btnValid, setBtnValid] = useState(false);

	const navigate = useNavigate();

	const captcha = useRef(null);

	const validCaptcha = () => {
		if (captcha.current.getValue().length > 0) {
			setBtnValid(true)
		}
		else {
			setBtnValid(false)
		}
	}

	const [registerData, setRegisterData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = registerData;

	const onchange = (event) => {
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	// La función onSubmit se ejecuta cuando se envía el formulario de inicio de sesión
	const onSubmit = async (e) => {
		// Previene la recarga de la página al enviar el formulario
		e.preventDefault();

		try {
			// Realiza una llamada a la API de inicio de sesión y obtiene la respuesta
			const resp = await LoginService(registerData);
			// Extrae la información relevante de la respuesta
			const { login } = JSON.parse(resp);
			const [{ codigoResultadoLogin }] = login;

			// Si el código de resultado es 0 (ok), se procede a obtener los datos del usuario y a almacenarlos en el almacenamiento local
			if (codigoResultadoLogin === 0) {
				const user = await HomeServiceEmpresa(registerData.email);
				const [usuario] = user.usuarioEmpresa;
				usuario.rol = login[0].tipo;

				// Crea un objeto para almacenar los convenios del usuario
				const convenios = {};
				// Recorre el array de usuarioEmpresa y agrega cada convenio al objeto convenios
				user.usuarioEmpresa.forEach(obj => {
					if (obj.convenio) {
						if (convenios.convenio) {
							convenios.convenio += `,${obj.convenio}`;
						} else {
							convenios.convenio = obj.convenio;
						}
					}
				});

				// Combina los datos del usuario y los convenios en un nuevo objeto
				const userFormated = { ...usuario, ...convenios };
				// Almacena el objeto en el almacenamiento local
				localStorage.setItem("user", JSON.stringify(userFormated));
				// Redirige al usuario a la página principal
				navigate(`/Home`);
			}
			// Si el código de resultado es 1 (No Existe), se muestra un modal con un mensaje de error
			else if (codigoResultadoLogin === 1) {
				setShowModal(true);
				setTitle("Error al iniciar sesión");
				setMsj("El usuario ingresado no existe.");
			}
			// Si el código de resultado es 2 (Usuario Invalido), se muestra un modal con un mensaje de error
			else if (codigoResultadoLogin === 2) {
				setShowModal(true);
				setTitle("Error al iniciar sesión");
				setMsj("El usuario ingresado es invalido.");

			}
			// Si el código de resultado es 3 (Pass Expirada), se muestra un modal con un mensaje de error
			else if (codigoResultadoLogin === 3) {
				setShowModal(true)
				setTitle("Error al iniciar sesión")
				setMsj("La contraseña ingresada se encuentra expirada.")
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="row align-items-center">
			<div className="col-md-8">
				<div>
					<DivTitulos>
						<Titulo>Usuarios Registrados</Titulo>
					</DivTitulos>
					<div id="notaLogin">
						Si tiene una cuenta, inicie sesión con su dirección de correo
						electrónico.
					</div>
					<form className={styles.form} onSubmit={onSubmit}>
						<GrupoInput>
							<Label>Correo Electronico <LabelReq> *</LabelReq></Label>
							<Inputs
								type="email"
								placeholder=""
								name="email"
								value={email}
								onChange={onchange}
								required
							/>
						</GrupoInput>
						<GrupoInput>
							<Label>Contraseña <LabelReq> *</LabelReq></Label>
							<Inputp
								type="password"
								name="password"
								placeholder=""
								min="7"
								max="20"
								value={password}
								onChange={onchange}
								required
							/>
						</GrupoInput>
						<div className="recaptcha">
							<ReCAPTCHA
								ref={captcha}
								sitekey="6Lek9tsiAAAAAOUyn_NBrROccYIf_-w38fsocNlN"
								onChange={validCaptcha}
							/>
						</div>
						<div className='accionLogin'>
							<div className='botonLogin'>
								{btnValid === !false && (
									<button type="submit">Inicio Sesion</button>
								)}
							</div>
							<div className="olvidasteContraseña">
								<li id="li-contraseña">
									<NavLink to="/OlvidasteContraseña">
										¿Olvidaste tu contraseña?
									</NavLink>
								</li>
							</div>
							<div id="requerido">
								<span>* Campos requeridos</span>
							</div>
						</div>
					</form>
					<ModalTest title={title} show={showModal} handleClose={handleClose} msj={msj} />
				</div>
			</div>
		</div>
	);
};

export default FormLogin