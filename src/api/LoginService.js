const axios = require('axios');

export const LoginService = async (data) => {
	const config = {
		method: 'post',
		url: 'http://150.100.253.61:8181/cxf/web/services/login',
		headers: {
			'Content-Type': 'application/json',
			user: data.email,
			passwd: data.password
		},

	};
	const response = axios(config)
		.then(({ data: outLogin }) => {
			return JSON.stringify(outLogin);
		})
		.catch((error) => {
			return error;
		});

	return response;
}

export const getTokenAuth = async () => {

	const config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/security/webConvenios/generacion/token',
		headers: {
			'usuario': 'wsconvenios',
			'password': 'wsconvenios2023 '
		}
	};

	const response = axios(config)
		.then(({ data: out }) => {
			return out;
		})
		.catch(function (error) {
			return error;
		});
	return response;
}
