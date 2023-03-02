const axios = require('axios');

export const HomeServiceEmpresa = async (data) => {
	const config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/Empresa/services/leerEmpresa',
		headers: {
			'Content-Type': 'application/json',
			user: data,
		},
	};
	const response = axios(config)
		.then(({ data: usuarioEmpresa }) => {
			return usuarioEmpresa;
		})
		.catch((error) => {
			throw new error(error);
		});

	return response;
}