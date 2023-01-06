import React, { useEffect, useState } from "react";
import { Label, GrupoInput, InputH } from "./Formularios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HomeService } from "../api/HomeService";
import { HomeServiceEmpresa } from "../api/HomeEmpresaService";
import "../styles/Home.css";
//import { LoginService } from "../api/LoginService";

const FormHome = (user) => {

	const [initialState, setInitialState] = useState({
		nombre: '',
		rut: '',
		apellido: '',
		apellido2: '',
		email: '',
		celular: '',
		kamConvenios: '',
		kamCorreo: '',
		cargo: '',

	})
	const [usuario, setUsuario] = useState(JSON.parse(user.user))
	const navigate = useNavigate();
	const location = useLocation();
	const emailparam = location.pathname.split("/")

	console.log(usuario);

	const handleClick = () => {
		//Redireccionar al home usuario cliente recien creado
		navigate(`/ModificarPass`);
	}

	const home = async (email) => {
		var datosUsuarios = "";
		//console.log(usuario.rol);
		if (usuario.rol === "Paciente") {
			const response = await HomeService(email)
			datosUsuarios = JSON.parse(response)
			datosUsuarios = datosUsuarios.usuario[0]
		} else if (usuario.rol === "Empresa") {
			const response2 = await HomeServiceEmpresa(email)
			datosUsuarios = response2.usuarioEmpresa[0];
		}

		const { rut, nombre, apellido, apellido2, correo, celular, kamConvenios, kamCorreo, cargo } = datosUsuarios;

		setInitialState({
			rut: rut,
			nombre: nombre,
			apellido: apellido,
			apellido2: apellido2,
			email: correo,
			celular: celular,
			kamConvenios: kamConvenios,
			kamCorreo: kamCorreo,
			cargo: cargo,
		})
	}

	useEffect(() => {
		home(usuario.correo)
	}, [])

	return (
		<main>
			<div className="row align-items-center">
				<div>
					<div className="container text-center">
						<div className="row">
							<div className="col-6">
								<div className="contenedorTitulo">
									<label className="titulo">Informacion Personal</label>
								</div>
								<GrupoInput>
									<Label>RUT</Label>
									<InputH
										className="inputForm"
										value={initialState.rut}
										type="text"
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Nombre</Label>
									<InputH
										className="inputForm"
										type="text"
										value={initialState.nombre}
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>1° Apellido </Label>
									<InputH
										className="inputForm"
										type="text"
										value={initialState.apellido}
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>2° Apellido </Label>
									<InputH
										className="inputForm"
										type="text"
										value={initialState.apellido2}
										readOnly
									/>
								</GrupoInput>
								{
									(usuario.rol === "Paciente")
										?
										<GrupoInput>
											<Label className="labelForm" htmlFor="">
												Numero de Telefono
											</Label>
											<InputH
												className="inputForm"
												type="text"
												value={initialState.celular}
												readOnly
											/>
										</GrupoInput>
										: null
								}

							</div>
							<div className="col">
								<GrupoInput>
									<div className="contenedorTitulo">
										<label className="titulo">Informacion de la Cuenta</label>
									</div>
									<GrupoInput>
										<Label className="labelForm" htmlFor="">
											Correo Electronico
										</Label>
										<InputH
											className="inputForm"
											type="text"
											value={initialState.email}
											readOnly
										/>
									</GrupoInput>
									<div id="accionRegistro">
										<div id="botonModificar">
											<button onClick={handleClick} >Modificar Contraseña</button>
										</div>
									</div>
								</GrupoInput>{" "}
							</div>

						</div>
						{
							(usuario.rol === "Paciente")
								?
								null
								: <div className="row">
									<div className="col-6">
										<div className="contenedorTitulo">
											<label className="titulo">Informacion KAM</label>
										</div>
										<GrupoInput>
											<Label>Nombre Kam </Label>
											<InputH
												className="inputForm"
												type="text"
												value={initialState.kamConvenios}
												readOnly
											/>
										</GrupoInput>
										<GrupoInput>
											<Label>Correo Electronico Kam </Label>
											<InputH
												className="inputForm"
												type="text"
												value={initialState.kamCorreo}
												readOnly
											/>
										</GrupoInput>
									</div>
									<div className="col-6">
										<div className="contenedorTitulo">
											<label className="titulo">Informacion Empresa</label>
										</div>
										<GrupoInput>
											<Label>Cargo </Label>
											<InputH
												className="inputForm"
												type="text"
												value={initialState.cargo}
												readOnly
											/>
										</GrupoInput>
									</div>
								</div>
						}

					</div>
				</div>
			</div>
		</main>
	);
};

export default FormHome;


// <NavLink to="/ModificarPass/" className="navlink" >Modificar Contraseña</NavLink>