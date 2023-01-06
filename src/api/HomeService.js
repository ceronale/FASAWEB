const axios = require('axios');

export const HomeService = async (data) => {
	
	// const data = JSON.stringify({
	// 	//"user":"user@email.com",
	// 	//"password":"password"
	// 	user,
	// 	passwd
	// });

	//localhost:8181

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
			return JSON.stringify(outLoginModel);
		})
		.catch((error) => {
			throw new error(error);
		});

	return response;
}