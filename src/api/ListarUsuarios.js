const axios = require('axios');

export const ListarUsuarios = async () => {
	const user = (JSON.parse(localStorage.getItem('user')));

	var config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/listando/services/listar',
		headers: {
			'user': user.correo,
			'token': user.token
		}
	};

	const response = axios(config)
		.then(({ data: outListar }) => {
			return outListar;
		})
		.catch((error) => {

			return error;

		});

	return response;
}