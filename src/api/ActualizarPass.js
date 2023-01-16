const axios = require('axios');
export const ActualizarPass = async (user, passwd) => {
	const config = {
		method: 'put',
		url: 'http://150.100.253.61:8181/cxf/recuperar/services/actualizarPwd',
		headers: {
			'Content-Type': 'application/json',
			user: user,
			passwd: passwd,
			userRep: user,
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

