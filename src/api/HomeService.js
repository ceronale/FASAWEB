const axios = require('axios');

export const HomeService = async (data) => {
	const user = (JSON.parse(localStorage.getItem("user")));
	const config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/usuario/services/leer',
		headers: {
			'Content-Type': 'application/json',
			user: data,
		},
	};
	const response = axios(config)
		.then(({ data: outLoginModel }) => {
			return outLoginModel;
		})
		.catch((error) => {
			return error;


		});

	return response;
}

export const familiaAhumadaService = async (data) => {

	const dataSend = JSON.stringify({
		"rut": data.rut,
		"mail": data.mail,
		"celular": data.celular
	});

	const config = {
		method: 'post',
		url: 'http://150.100.253.61:8181/cxf/enrolar/services/Enrolar',
		headers: {
			'Authorization': 'Basic dmVudGFzOmZhc2EyMDE4',
			'Content-Type': 'application/json'
		},
		data: dataSend
	};
	const response = axios(config)
		.then(({ data: outLoginModel }) => {
			return outLoginModel;
		})
		.catch((error) => {
			return error;
		});

	return response;
}
