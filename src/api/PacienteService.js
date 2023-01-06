const axios = require('axios');

export const PacienteService = async (data) => {

	const config = {
		method: 'put',
		url: 'http://localhost:8181/cxf/actualizar/services/actualizarPaciente',
		headers: {
			'Content-Type': 'application/json',
			rut: data.rut,
			ndocumento: data.ndocumento,
			nombre: data.nombre,
			apellido: data.apellido,
			apellido2: data.apellido2,
			celular: data.celular,
			user: data.user,
			passwd: data.passwd,
		},
	};
	const response = axios(config)
		.then(({ data: outActualizar }) => {

			return outActualizar;
		})
		.catch((error) => {
			return error;
		});

	return response;
}

// Validar RUT y N° Documento
export const Validate = async (rut, serie) => {
	var data = JSON.stringify({
		"rut": rut,
		"serie": serie,
	});
	const config = {
		method: 'POST',
		url: 'http://localhost:8181/cxf/rut/services/validaRut',
		headers: {
			'Content-Type': 'application/json',
		},
		data: data
	};
	const response = axios(config)
		.then(({ data: outActualizar }) => {

			return outActualizar;
		})
		.catch((error) => {
			return error;
		});
	return response;
}

// Generar token de verificacion
export const GenerarToken = async (data) => {
	const config = {
		method: 'post',
		url: 'http://localhost:8181/cxf/generatoken/services/generatoken',
		headers: {
			'user': data,
		}
	};
	const response = axios(config)
		.then(({ data: outActualizar }) => {
			return outActualizar;
		})
		.catch((error) => {
			return error;
		});

	return response;
}

export const ValidarToken = async (token, user) => {
	const config = {
		method: 'post',
		url: 'http://localhost:8181/cxf/validaToken/services/validartoken',
		headers: {
			'user': user,
			'token': token
		}
	};

	const response = axios(config)
		.then(({ data: outActualizar }) => {

			return outActualizar;
		})
		.catch(function (error) {
			return error;
		});
	return response;
}