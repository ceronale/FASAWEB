const axios = require('axios');

export const ListarUsuarios = async () => {
	
	var config = {
        method: 'get',
        url: 'http://localhost:8181/cxf/listando/services/listar',
        headers: { 
          user: 'prueba5@nuevamasvida.cl'
        }
    };
    
	const response = axios(config)
		.then(({ data: outListar}) => {
			return outListar;
		})
		.catch((error) => {
			throw new error(error);
		});

	return response;
}