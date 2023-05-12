
/* eslint-disable */
import React, { useState } from "react";
import { PacienteService, GenerarToken, ValidarToken, Validate } from "../../api/PacienteService";
import { useNavigate } from 'react-router-dom';
import { Label, LabelReq, Inputs, Inputp, GrupoInput, RestriccionPass, DivTitulos, Titulo, } from "../Formularios";
import { NavLink } from "react-router-dom";
import ModalAlert from '../Modals/ModalAlert';
import ModalTerminos from "../Modals/ModalTerminos";
import "../../styles/FormPacienteCliente.css";
import { HomeService, familiaAhumadaService } from "../../api/HomeService";
import CircularProgress from '@mui/material/CircularProgress';



const initialForm = {
	rut: '',
	ndocumento: '',
	nombre: '',
	apellido: '',
	apellido2: '',
	celular: '',
	user: '',
	passwd: '',
	passwd2: '',
};




const FormPacienteCliente = () => {

	const navigate = useNavigate();
	const [title, setTitle] = useState();
	const [msj, setMsj] = useState();
	const [checkBox, setCheckbox] = useState(false);
	const [checkBox2, setCheckbox2] = useState(false);
	const [registerData, setRegisterData] = useState({
		rut: '',
		ndocumento: '',
		nombre: '',
		apellido: '',
		apellido2: '',
		celular: '',
		user: '',
		passwd: '',
		passwd2: '',
		terminos: 'false'
	});
	const [loading, setLoading] = useState(false);

	const [tokenIsValid, setTokenIsValid] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [showModalTerminos, setShowModalTerminos] = useState(false);
	const [titleTerminos, setTitleTerminos] = useState();
	const [msjTerminos, setMsjTerminos] = useState();
	



	const handleCloseToken = () => {
		setShowModal(false);
		if (tokenIsValid) {
			navigate(`/`);
			handleClear();
		}
	}

	const handleCloseTerminos = () => {
		setShowModalTerminos(false);
		
	}

	const [checkToken, setcheckToken] = useState(false);
	const [token, setToken] = useState("");

	const { rut, ndocumento, nombre, apellido, apellido2, celular, user, passwd, passwd2 } = registerData;

	const onchange = (event) => {
		var aux;
		//Validacion de campos de formulario solo letras
		if (event.target.name === "nombre" || event.target.name === "apellido" || event.target.name === "apellido2") {
			aux = event.target.value
			aux = aux.replace(/[^A-Za-z-Ñ-ñ\s]+/g, '');
			updateStateOnchange(event, aux);
		}
		//Validacion de campos de formulario solo numeros
		else if (event.target.name === "ndocumento" || event.target.name === "celular") {
			aux = event.target.value
			aux = aux.replace(/[^0-9]+/g, '');
			updateStateOnchange(event, aux);
		}
		//Validacion rut
		else if (event.target.name === "rut") {
			aux = event.target.value
			aux = aux.replace(/[^0-9 k K]+/g, '');
			updateStateOnchange(event, aux);
		} else {
			setRegisterData((prev) => ({
				...prev,
				[event.target.name]: event.target.value,
			}));
		}
	};

	function updateStateOnchange(event, aux) {
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: aux,
		}));
	}

	const handleClickRemember = (event) => {
		setCheckbox(!checkBox);
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: !checkBox,
		}));
	};

	const handleClickRemember2 = (event) => {
		setCheckbox2(!checkBox2);
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: !checkBox2,
		}));
	};
	const handleClickConfirmarToken = async (e) => {
		try {
			e.preventDefault();
			const respValidToken = await ValidarToken(token, registerData.user);
			setShowModal(true)
			setTitle("Error de token")
			setMsj("El token ingresado no es correcto.")
			if (respValidToken['validaToken'][0]['codigoResultado'] === 0) {
				setTokenIsValid(true);
				setTitle("Verificacion de token")
				setMsj("Token ingresado correctamente.")
				const resp = await PacienteService(registerData)

				var aux = resp.outActualizar[0].codigoResultado;
				if (aux !== 0) {
					setShowModal(true)
					setTitle("Error al crear usuario")
					setMsj("El usuario ingresado ya existe.")
				} else {
					setShowModal(true)
					//crete an array data
					const data = {
						"rut": registerData.rut,
						"mail": registerData.user,
						"celular": registerData.celular,
					}
					if (checkBox2) {
						await familiaAhumadaService(data);
					}

					setTitle("Creación de usuario")
					setMsj("Usuario creado de manera exitosa.")
				}

			}
		} catch (error) {
			setLoading(false);
			setTitle("Error")
			setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
			setShowModal(true)
		}

	};

	const handleClickTerminos = async (e) => {
		setShowModalTerminos(true);
		setTitleTerminos("Términos y condiciones");
		setMsjTerminos(`
		  1. ASPECTOS GENERALES
		  Estos Términos y Condiciones aplican y se entenderán incorporados en todas las consultas realizadas a través del Sitio desarrollado para Convenios ABF (en adelante indistintamente el “Sitio” o la “Página Web”), www.farmaciasahumada.cl. El acceso, uso y todas las transacciones realizadas en el Sitio implican la aceptación de estos Términos y Condiciones.<br><br>
		  2. REQUISITOS PARA EL USO DEL SITIO PORTAL CONVENIOS<br>
		  El servicio se encuentra disponible para Clientes que realizan sus compras en Farmacias Ahumada haciendo uso de los Beneficios que se ponen a su disposición y para aquellas empresas que otorgan beneficios a sus afiliados (en adelante también “Usuarios”).
		  La información proporcionada por el Usuario para el registro debe ser correcta y corresponder a la realidad.
		  El Usuario, al hacer uso del Sitio Portal Convenios, acepta y es de su responsabilidad cumplir con estos Términos y Condiciones.
		`);
	  };
	  

	const onChangeToken = (event) => {
		setToken(event.target.value);
	}



	const onSubmit = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const respValidar = await Validate(registerData.rut, registerData.ndocumento);
			var isValidarRut = false;
			var isPassValid = false;
			var isUserValid = false;

			isValidarRut = await validarRut(respValidar);

			if (isValidarRut) {
				isPassValid = await contraseñaValidar();
				if (isPassValid) {
					isUserValid = await validateUser(registerData.user);
					if (isUserValid) {
						setShowModal(true)
						setTitle("Codigo de confirmación")
						setMsj("Se ha enviado un token de verificación a tu correo.")
						await GenerarToken(registerData.user);
						setcheckToken(true);
						setLoading(false);
					} else {
						setLoading(false);
					}
				} else {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			setTitle("Error")
			setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
			setShowModal(true)
		}

	};


	// Validar RUT y N° Documento
	function validarRut(respValidar) {
		var aux = respValidar['success'];
		if (aux === true) {
			return true;
		} else if (aux === false) {
			setShowModal(true)
			setTitle("Error de verificacion")
			setMsj("El RUT o N° Documento es invalido.")
			return false;
		}
		return false;
	};

	//function to call the api home service and check if the user exist 
	const validateUser = async (userData) => {
		try {
			const resp = await HomeService(userData);
			//Check is the resp.usuario[0].codigo is the resp

			if (resp.usuario[0].codigo === 1) {
				return true;
			} else {
				setShowModal(true)
				setTitle("Error de usuario")
				setMsj("El usuario ingresado ya existe.")
				return false;
			}
		} catch (error) {
			setLoading(false);
			setTitle("Error")
			setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
			setShowModal(true)
		}


	}


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
		setToken("");
	};


	return (
		<div style={{ position: 'relative' }}>
			{loading && (
				<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
					<CircularProgress />
				</div>
			)}
			<main>
				<form onSubmit={onSubmit}>
					<div className="container text-center">
						<div className="row">
							<div className="col">
								<DivTitulos>
									<Titulo>Informacion Personal</Titulo>
								</DivTitulos>
								<GrupoInput>
									<Label>RUT <LabelReq> *</LabelReq></Label>
									<Inputp
										type="text"
										placeholder="Sin punto ni guión"
										name="rut"
										value={rut}
										min="8"
										max="9"
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>N° Documento <LabelReq> *</LabelReq></Label>
									<Inputp
										type="text"
										placeholder=""
										name="ndocumento"
										min="8"
										max="9"
										value={ndocumento}
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Nombre <LabelReq> *</LabelReq></Label>
									<Inputs
										type="text"
										name="nombre"
										placeholder=""
										value={nombre}
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>1° Apellido <LabelReq> *</LabelReq></Label>
									<Inputs
										type="text"
										name="apellido"
										placeholder=""
										value={apellido}
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>2° Apellido <LabelReq> *</LabelReq></Label>
									<Inputs
										type="text"
										placeholder=""
										name="apellido2"
										value={apellido2}
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Celular <LabelReq> *</LabelReq></Label>
									<Inputp
										type="text"
										placeholder=""
										name="celular"
										min="8"
										max="8"
										value={celular}
										onChange={onchange}
										required
									/>
								</GrupoInput>
							</div>
							<div className="col">
								<DivTitulos>
									<Titulo>Informacion de la cuenta</Titulo>
								</DivTitulos>
								<GrupoInput>
									<Label>Correo Electronico <LabelReq> *</LabelReq></Label>
									<Inputs
										type="email"
										placeholder=""
										name="user"
										value={user}
										onChange={onchange}
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Contraseña <LabelReq> *</LabelReq></Label>
									<Inputp
										type="password"
										placeholder=""
										name="passwd"
										value={passwd}
										onChange={onchange}
										min="7"
										max="20"
										required
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Confirmar Contraseña <LabelReq> *</LabelReq></Label>
									<Inputp
										type="password"
										placeholder=""
										name="passwd2"
										value={passwd2}
										onChange={onchange}
										min="7"
										max="20"
										required
									/>
									{checkToken === false && (
										<RestriccionPass>
											La contraseña debe contener desde 7 a 20 caracteres,
											se exige una letra minuscula y una mayuscula, un numero y un caracter especial.
										</RestriccionPass>
									)}

									<div>
										<div className="boxTerminos">
											<input
												type="checkbox"
												name="opcional"
												id="opcional"
												value={checkBox2}
												onChange={handleClickRemember2}
												checked={checkBox2}
											/>
											<div className="aceptoTerminos">
												<p> Afiliarse a familia ahumada </p>
											</div>
										</div>

									</div>
								</GrupoInput>
								{checkToken === false && (
									<div>
										<div className="boxTerminos">
											<input
												type="checkbox"
												name="terminos"
												value={checkBox}
												checked={checkBox}
												onChange={handleClickRemember}
												required
											/>
											<div className="aceptoTerminos">
												<p> Acepto los <NavLink className="navTerminos" to="" onClick={handleClickTerminos}>Terminos y condiciones</NavLink></p>
											</div>
										</div>
										<div className="CrearPaciente">
											<button className="buttomCrearCuenta" type="submit" >Crear Cuenta</button>

											<div className="CampoRequerido">
												<span>* Campos requeridos</span>
											</div>
										</div>
									</div>
								)}
								{checkToken === !false && (
									<div>
										<GrupoInput>
											<RestriccionPass>
												Se ha enviado un token de verificación a tu correo
											</RestriccionPass>
											<Label>Confirmar Token <LabelReq> *</LabelReq></Label>
											<Inputs
												type="text"
												placeholder=""
												name="token"
												value={token}
												onChange={onChangeToken}
												required />
										</GrupoInput>
										<div className="CrearPaciente">
											<button className="buttomCrearCuenta" onClick={handleClickConfirmarToken} >Confirmar Token</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</form>
				<ModalAlert title={title} show={showModal} handleClose={handleCloseToken} msj={msj} />
				<ModalTerminos title={titleTerminos} msj={msjTerminos} show={showModalTerminos} handleClose={handleCloseTerminos} />
			</main >
		</div>
	);
}

export default FormPacienteCliente;