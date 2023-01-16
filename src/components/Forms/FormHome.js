import React, { useEffect, useState } from "react";
import { Label, GrupoInput, InputH } from "../Formularios";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import { Button } from "@mui/material";

// Function that returns the form for the home page
const FormHome = (user) => {

	// Initialize the state for the form fields
	const [formState, setFormState] = useState({
		firstName: '',
		id: '',
		lastName1: '',
		lastName2: '',
		email: '',
		phone: '',
		kamConvenios: '',
		kamEmail: '',
		position: '',
	})
	// Initialize the state for the current user
	const [currentUser, setCurrentUser] = useState(JSON.parse(user.user))

	// Initialize the navigate hook for navigation
	const navigate = useNavigate();

	// Function to handle a click event (not specified in the original code)
	const handleClick = () => {
		// Redirect to the ModificarPass page
		navigate('/ModificarPass');
	}

	// Async function to retrieve the user data from the backend
	const getUserData = () => {

		let userData = currentUser;

		// Destructure the user data from the response
		const { rut, nombre, apellido, apellido2, correo, celular, kamConvenios, kamCorreo, cargo } = userData;

		// Set the form state with the retrieved data
		setFormState({
			id: rut,
			firstName: nombre,
			lastName1: apellido,
			lastName2: apellido2,
			email: correo,
			phone: celular,
			kamConvenios: kamConvenios,
			kamEmail: kamCorreo,
			position: cargo,
		});
	};

	// Use the effect hook to retrieve the user data on component mount
	useEffect(() => {
		getUserData()
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
										value={formState.id}
										type="text"
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>Nombre</Label>
									<InputH
										className="inputForm"
										type="text"
										value={formState.firstName}
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>1° Apellido </Label>
									<InputH
										className="inputForm"
										type="text"
										value={formState.lastName1}
										readOnly
									/>
								</GrupoInput>
								<GrupoInput>
									<Label>2° Apellido </Label>
									<InputH
										className="inputForm"
										type="text"
										value={formState.lastName2}
										readOnly
									/>
								</GrupoInput>
								{
									(currentUser.rol === "Paciente")
										?
										<GrupoInput>
											<Label className="labelForm" htmlFor="">
												Numero de Telefono
											</Label>
											<InputH
												className="inputForm"
												type="text"
												value={formState.phone}
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
											value={formState.email}
											readOnly
										/>
									</GrupoInput>
									<div id="accionRegistro">

										<Button variant="contained" onClick={handleClick} >Modificar Contraseña</Button>


									</div>
								</GrupoInput>{" "}
							</div>

						</div>
						{
							(currentUser.rol === "Paciente")
								?
								null
								: <div className="row">
									<div className="col-6">
										<div className="contenedorTitulo">
											<label className="titulo">Informacion KAM</label>
										</div>
										<GrupoInput>
											<Label>KAM Correo</Label>
											<InputH
												className="inputForm"
												value={formState.kamEmail}
												type="text"
												readOnly
											/>
										</GrupoInput>
										<GrupoInput>
											<Label>KAM Correo</Label>
											<InputH
												className="inputForm"
												value={formState.kamEmail}
												type="text"
												readOnly
											/>
										</GrupoInput>
									</div>
									<div className="col-6">
										<div className="contenedorTitulo">
											<label className="titulo">Informacion Empresa</label>
										</div>
										<GrupoInput>
											<Label>Cargo</Label>
											<InputH
												className="inputForm"
												value={formState.position}
												type="text"
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