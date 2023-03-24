import React, { useState, useEffect } from "react";
import "../../styles/FormClienteEmpresa.css";
import { EmpresaService, ConvenioService } from "../../api/EmpresaService";
import { HomeService } from "../../api/HomeService";
import { LIstaEmpresasService, } from "../../api/LIstaEmpresasService";
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
import ModalAlert from '../Modals/ModalAlert';
import BaseSelect from "react-select";
import FixRequiredSelect from "../../FixRequiredSelect";
import { Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, } from 'react-router-dom';

const initialForm = {
	rut: '',
	nombre: '',
	apellido: '',
	apellido2: '',
	user: '',
	passwd: '',
	kamConvenios: '',
	kamCorreo: '',
	cargo: '',
	passwd2: '',
};

const FormClienteEmpresa = (usuario) => {
	const [options, setOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const correoUsuario = JSON.parse(usuario.usuario).correo;

	useEffect(() => {
		fetchDataSelect();
	}, []);
	const navigate = useNavigate();
	const [msj, setMsj] = useState();
	const [title, setTitle] = useState();
	const [registerData, setRegisterData] = useState({
		rut: '',
		nombre: '',
		apellido: '',
		apellido2: '',
		user: '',
		passwd: '',
		passwd2: '',
		kamConvenios: '',
		kamCorreo: '',
		cargo: '',
	});
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleClose = () => {
		setShowModal(false);
	}

	const { rut, nombre, apellido, apellido2, user, passwd, kamConvenios, kamCorreo, cargo, passwd2 } = registerData;

	const onchange = (event) => {
		var aux;
		//Validacion de campos de formulario solo letras
		if (event.target.name === "nombre" || event.target.name === "apellido" || event.target.name === "apellido2" || event.target.name === "kamConvenios" || event.target.name === "cargo") {
			aux = event.target.value.replace(/ [^A-Za-z-Ñ-ñ]+/g, '');
			updateStateOnchange(event, aux);
		}
		//Validacion rut
		else if (event.target.name === "rut") {
			aux = event.target.value.replace(/[^0-9 k K]+/g, '');
			updateStateOnchange(event, aux);
		} else {
			setRegisterData((prev) => ({
				...prev,
				[event.target.name]: event.target.value,
			}));
		}
	};

	const onChangeSelect = (e) => {
		setSelectedOptions(Array.isArray(e) ? e.map(x => x.value) : []);
	};

	function updateStateOnchange(event, aux) {
		setRegisterData((prev) => ({
			...prev,
			[event.target.name]: aux,
		}));
	}

	//function to call the api home service and check if the user exist 
	const validateUser = async (userData) => {
		try {
			const resp = await HomeService(userData);
			if (resp?.response?.status === 403
			) {
				setShowModal(true)
				setTitle("Sesión expirada")
				setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
				//set time out to logout of 5 seconds
				setTimeout(() => {
					localStorage.removeItem("user");
					navigate(`/`);
				}, 5000);
				return;
			}

			if (resp.name === 'AxiosError' && resp.code === 'ERR_NETWORK') {
				setTitle("Error");
				setMsj("Error de conexión");
				setShowModal(true);
				setLoading(false);
				return;
			}


			//Check is the resp.usuario[0].codigo is the resp
			if (resp.usuario[0].codigo === 1) {
				return true;
			} else {
				setShowModal(true)
				setTitle("Error")
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

	const onSubmit = async (e) => {
		try {
			setLoading(true);
			e.preventDefault();
			var isPassValid = contraseñaValidar();
			var isUserValid = await validateUser(registerData.user);

			if (isPassValid) {
				if (isUserValid) {
					const resp = await EmpresaService(registerData, correoUsuario)
					if (resp?.response?.status === 403
					) {
						setTitle("Sesión expirada")
						setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
						setShowModal(true)
						//set time out to logout of 5 seconds
						setTimeout(() => {
							localStorage.removeItem("user");
							navigate(`/`);
						}, 5000);
						return;
					}

					if (resp.name === 'AxiosError' && resp.code === 'ERR_NETWORK') {
						setTitle("Error");
						setMsj("Error de conexión");
						setShowModal(true);
						setLoading(false);
						return;
					}

					var aux = resp['outActualizar'][0]['outSeq'];
					if (aux === 0) {
						setShowModal(true)
						setTitle("Error")
						setMsj("Error al crear usuario")
					} else {
						setShowModal(true)
						setTitle("Exito")
						setMsj("Usuario creado de manera exitosa.")
						const resp = await ConvenioService(registerData.user, selectedOptions.toString(), correoUsuario);
						handleClear();
					}
				}
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setTitle("Error")
			setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
			setShowModal(true)
		}
	};

	function contraseñaValidar() {
		//eslint-disable-next-line
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


	async function fetchDataSelect() {
		try {

			const resp2 = await LIstaEmpresasService();
			if (resp2 === 403) {
				setShowModal(true)
				setTitle("Sesión expirada")
				setMsj("Su sesión ha expirado, por favor vuelva a ingresar")
				//set time out to logout of 5 seconds
				setTimeout(() => {
					localStorage.removeItem("user");
					navigate(`/`);
				}, 5000);
				return;
			}

			var aux = resp2['empresa'];
			let data = aux.map(function (element) {
				return { value: `${element.idEmpresa}`, label: `${element.nombreEmpresa}` };
			})
			setOptions(data);
		} catch (error) {
			setLoading(false);
			setTitle("Error")
			setMsj("Ha ocurrido un error, por favor vuelva a intentarlo");
			setShowModal(true)
		}

	};

	const handleClear = () => {
		setRegisterData(initialForm);
		setSelectedOptions([]);
	};



	//Select MultiOption
	const Select = props => (
		<FixRequiredSelect
			{...props}
			SelectComponent={BaseSelect}
			options={options}
		/>
	);


	return (
		<main>
			<div style={{ position: 'relative' }}>
				{loading && (
					<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
						<CircularProgress />
					</div>
				)}
				<form onSubmit={onSubmit}>
					<div className="row align-items-center">
						<div>
							<div className="container text-center">
								<div className="row">
									<div className="col-6">
										<ContenedorTitulo>
											<Titulo>Informacion Personal</Titulo>
										</ContenedorTitulo>
										<GrupoInput>
											<Label>RUT <LabelReq> *</LabelReq></Label>
											<Inputp
												type="text"
												placeholder="Sin punto ni guión"
												name="rut"
												value={rut}
												max="9"
												min="8"
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
												name="apellido2"
												placeholder=""
												value={apellido2}
												onChange={onchange}
												required
											/>
										</GrupoInput>
									</div>
									<div className="col-6">
										<ContenedorTitulo>
											<Titulo>Información de Cuenta</Titulo>
										</ContenedorTitulo>
										<GrupoInput>
											<Label>Correo Electronico <LabelReq> *</LabelReq></Label>
											<Inputs
												type="email"
												placeholder="example@example.com"
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
												name="passwd"
												placeholder=""
												value={passwd}
												min="7"
												max="20"
												onChange={onchange}
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
											<RestriccionPass>
												La contraseña debe contener desde 7 a 20 caracteres,
												se exige una letra minuscula y una mayuscula, un numero y un caracter especial.
											</RestriccionPass>
										</GrupoInput>
									</div>
								</div>
								<div className="row">
									<div className="col-6">
										<ContenedorTitulo>
											<Titulo>Informacion KAM</Titulo>
										</ContenedorTitulo>
										<GrupoInput>
											<Label>Nombre Kam <LabelReq> *</LabelReq></Label>
											<Inputs
												type="text"
												name="kamConvenios"
												placeholder=""
												value={kamConvenios}
												onChange={onchange}
												required
											/>
										</GrupoInput>
										<GrupoInput>
											<Label>Correo Electronico Kam <LabelReq> *</LabelReq></Label>
											<Inputs
												type="email"
												name="kamCorreo"
												placeholder=""
												value={kamCorreo}
												onChange={onchange}
												required
											/>
											<div>
												<Button variant="contained" color="error" type="submit" sx={{ marginTop: 2 }} >Crear Nuevo Usuario</Button>
												<div className="CampoRequerido">
													<span>* Campos requeridos</span>
												</div>
											</div>
										</GrupoInput>
									</div>
									<div className="col-6">
										<ContenedorTitulo>
											<Titulo>Información Empresa</Titulo>
										</ContenedorTitulo>
										<GrupoInput>
											<Label>Cargo <LabelReq> *</LabelReq></Label>
											<Inputs
												type="text"
												name="cargo"
												placeholder=""
												value={cargo}
												onChange={onchange}
												required
											/>
										</GrupoInput>
										<GrupoInput>
											<Label>Empresa (s) <LabelReq> *</LabelReq></Label>
											<Select options={options} value={options.filter(obj => selectedOptions.includes(obj.value))}
												onChange={onChangeSelect} isMulti required />
										</GrupoInput>
										{/* <select name="cars" id="cars">
									<option value="volvo">Volvo</option>
								</select> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
				<ModalAlert title={title} show={showModal} handleClose={handleClose} msj={msj} />
			</div>
		</main>
	);
}

export default FormClienteEmpresa;