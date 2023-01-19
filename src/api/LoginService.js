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
