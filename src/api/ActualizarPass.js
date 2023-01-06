const axios = require('axios');
export const ActualizarPass = async (user, passwd) => {
	const config = {
		method: 'put',
		url: 'http://localhost:8181/cxf/recuperar/services/actualizarPwd',
		headers: {
			'Content-Type': 'application/json',
			user: user,
			passwd: passwd,
		},
	};
	const response = axios(config)
		.then(({ data: outActualizarPass }) => {
			return outActualizarPass;
		})
		.catch((error) => {
			return error;
		});

	return response;
}

