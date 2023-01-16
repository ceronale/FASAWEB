const axios = require('axios');

export const HomeService = async (data) => {

	const config = {
		method: 'get',
		url: 'http://localhost:8181/cxf/usuario/services/leer',
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