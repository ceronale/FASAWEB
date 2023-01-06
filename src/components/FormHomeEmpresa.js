import React, { useEffect, useState } from "react";
import { Label, GrupoInput, InputH, ContenedorTitulo, Titulo } from "./Formularios";
import { useLocation } from "react-router-dom";
import { HomeServiceEmpresa } from "../api/HomeEmpresaService";
//import { LoginService } from "../api/LoginService";

const FormHome = () => {
	const [initialState, setInitialState] = useState({
		rut: '',
		nombre: '',
		apellido: '',
		apellido2: '',
		correo: '',
		kamConvenios: '',
		kamCorreo: '',
		cargo: '',
	})
	const location = useLocation();
	const emailparam = location.pathname.split("/")
	const home = async (email) => {
		const response = await HomeServiceEmpresa(email)
		const { rut, nombre, apellido, apellido2, correo, kamConvenios, kamCorreo, cargo } = response.usuarioEmpresa[0];
		setInitialState({
			rut: rut,
			nombre: nombre,
			apellido: apellido,
			apellido2: apellido2,
			correo: correo,
			kamConvenios: kamConvenios,
			kamCorreo: kamCorreo,
			cargo: cargo,
		})
	}
	useEffect(() => {
		home(emailparam[2])
	}, [])

	return (
		<main>
			<div className="row align-items-center">
				<div>
					<div class="container text-center">
						<div class="row">
							<div class="col-6">
								<ContenedorTitulo>
									<Titulo>Informacion Personal</Titulo>
								</ContenedorTitulo>
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
							</div>
							<div class="col-6">
								<ContenedorTitulo>
									<Titulo>Informacion de Cuenta</Titulo>
								</ContenedorTitulo>
								<GrupoInput>
									<Label>Correo Electronico</Label>
									<InputH
										className="inputForm"
										type="text"
										value={initialState.correo}
										readOnly
									/>
								</GrupoInput>
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<ContenedorTitulo>
									<Titulo>Informacion KAM</Titulo>
								</ContenedorTitulo>
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
							<div class="col-6">
								<ContenedorTitulo>
									<Titulo>Informacion Empresa</Titulo>
								</ContenedorTitulo>
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
					</div>
				</div>
			</div>
		</main>
	);
};

export default FormHome;