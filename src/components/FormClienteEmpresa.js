import React, { useState, useEffect } from "react";
import "../styles/FormClienteEmpresa.css";
import { EmpresaService, ConvenioService } from "../api/EmpresaService";
import { LIstaEmpresasService, } from "../api/LIstaEmpresasService";
import {
	Label,
	LabelReq,
	Inputs,
	GrupoInput,
	RestriccionPass,
	Inputp,
	ContenedorTitulo,
	Titulo
} from "../components/Formularios";
import ModalTest from './ModalTest';
import BaseSelect from "react-select";
import FixRequiredSelect from "../FixRequiredSelect";


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

const FormClienteEmpresa = () => {
	const [options, setOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		fetchDataSelect();
	}, []);

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

	const onSubmit = async (e) => {
		e.preventDefault();
		var isPassValid = contraseñaValidar();
		if (isPassValid) {
			const resp = await EmpresaService(registerData)
			var aux = resp['outActualizar'][0]['outSeq'];
			if (aux === 0) {
				setShowModal(true)
				setTitle("Error al crear usuario")
				setMsj("El Cliente Empresa ya existe.")

			} else {
				setShowModal(true)
				setTitle("Creación de usuario")
				setMsj("Cliente Empresa creado de manera exitosa.")
				const respConvenio = await ConvenioService(registerData.user, selectedOptions.toString());
				console.log(respConvenio);
				handleClear();
			}
		}
	};

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


	async function fetchDataSelect() {
		const resp2 = await LIstaEmpresasService();
		var aux = resp2['empresa'];
		let data = aux.map(function (element) {
			return { value: `${element.idEmpresa}`, label: `${element.nombreEmpresa}` };
		})
		setOptions(data);
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
										<div className="CrearEmpresa">
											<button className="buttomCrearCuenta" type="submit" >Crear Nuevo Usuario</button>
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
			<ModalTest title={title} show={showModal} handleClose={handleClose} msj={msj} />
		</main>
	);
}

export default FormClienteEmpresa;