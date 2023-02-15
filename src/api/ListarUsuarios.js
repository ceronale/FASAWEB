const axios = require('axios');

export const ListarUsuarios = async () => {
	const user = (JSON.parse(localStorage.getItem('user'))).correo;
	var config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/listando/services/listar',
		headers: {
			user: user
		}
	};

	const response = axios(config)
		.then(({ data: outListar }) => {
			return outListar;
		})
		.catch((error) => {
			throw new error(error);
		});

	return response;
}