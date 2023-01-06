import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Label, LabelReq, RestriccionPass, Inputc, ContenedorTitulo, Titulo } from "./Formularios";
import "../styles/OlvidasteContraseña.css";
import { GenerarToken, ValidarToken } from "../api/PacienteService";
import { HomeServiceEmpresa } from "../api/HomeEmpresaService";
import ModalTest from "./ModalTest";


const initialForm = {
	user: '',
};

const FormOlvidasteContraseña = () => {

	const navigate = useNavigate();
	const [title, setTitle] = useState();
	const [msj, setMsj] = useState();
	const [registerData, setRegisterData] = useState({
		user: '',
	});

	const [tokenIsValid, setTokenIsValid] = useState(false);
	const [showModal, setShowModal] = useState(false);


	const handleCloseToken = async () => {
		setShowModal(false);
		if (tokenIsValid) {
			//Redireccionar a restaurar contraseña.
			localStorage.setItem("user", JSON.stringify(registerData.user));
			navigate(`/RestaurarPass`);
			handleClear();
		}
	}

	const [checkToken, setcheckToken] = useState(false);
	const [token, setToken] = useState("");

	const { user } = registerData;

	const onchange = (event) => {
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleClickConfirmarToken = async (e) => {
		e.preventDefault();
		const respValidToken = await ValidarToken(token, registerData.user);

		setShowModal(true)
		setTitle("Error de token")
		setMsj("El token ingresado no es correcto.")
		if (respValidToken['validaToken'][0]['codigoResultado'] === 0) {
			setTokenIsValid(true);
			setTitle("Verificacion de token")
			setMsj("Token ingresado correctamente.")
		}
	};

	const onChangeToken = (event) => {
		setToken(event.target.value);
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		//Envio de token 
		const respToken = await GenerarToken(registerData.user);
		console.log(respToken);
		setcheckToken(true);
	};

	const handleClear = () => {
		setRegisterData(initialForm);
		setToken("");
	};

	return (
		<main>
			<form onSubmit={onSubmit}>
				<div className="central">
					<ContenedorTitulo>
						<Titulo>¿Olvidaste tu contraseña?</Titulo>
					</ContenedorTitulo>
					<div className="leyenda">
						<label>
							Introduzca su dirección de correo electrónico
							a continuación para recibir un enlace
							de restablecimiento de contraseña.
						</label>
					</div>
					<div className="boxEmail">
						<Label>Correo Electronico <LabelReq> *</LabelReq></Label>
						<Inputc
							type="email"
							placeholder=""
							name="user"
							value={user}
							onChange={onchange}
							required
						/>
					</div>
					{checkToken === false && (
						<div className="blockRequ">
							<div className="campoRequerido">
								<span className="obligatorio">* Campos requeridos</span>
							</div>
							<div className="blockCrearCuenta">
								<button className="buttomRestablecerContraseña">Generar Token</button>
							</div>
						</div>
					)}
					{checkToken === !false && (
						<div>
							<div className="boxEmail">
								<Label>Confirmar Token <LabelReq> *</LabelReq></Label>
								<Inputc
									type="text"
									placeholder=""
									name="token"
									value={token}
									onChange={onChangeToken}
									required
								/>
								<RestriccionPass>
									Se ha enviado un token de verificación a tu correo.
								</RestriccionPass>
							</div>
							<div className="CrearPaciente">
								<button className="buttomRestablecerContraseña" onClick={handleClickConfirmarToken} >Confirmar Token</button>
							</div>
						</div>
					)}
				</div>
			</form>
			<ModalTest title={title} show={showModal} handleClose={handleCloseToken} msj={msj} />
		</main>
	);
}

export default FormOlvidasteContraseña;