const axios = require('axios');

export const EmpresaService = async (data, user) => {
	const userx = (JSON.parse(localStorage.getItem("user")));
	const config = {
		method: 'put',
		url: 'http://150.100.253.61:8181/cxf/actualizarEmpresa/services/actualizarEmpresa',
		headers: {
			'Content-Type': 'application/json',
			rut: data.rut,
			nombre: data.nombre,
			apellido: data.apellido,
			apellido2: data.apellido2,
			user: data.user,
			passwd: data.passwd,
			kamConvenios: data.kamConvenios,
			kamCorreo: data.kamCorreo,
			cargo: data.cargo,
			userRep: user,
			token: userx.token
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

export const ConvenioService = async (user, codigo, correo) => {
	const userx = (JSON.parse(localStorage.getItem("user")));
	const config = {
		method: 'put',
		url: 'http://150.100.253.61:8181/cxf/convenios/services/actualizarConvenio',
		headers: {
			'user': user,
			'codigo': codigo,
			'userRep': correo,
			'token': userx.token
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


