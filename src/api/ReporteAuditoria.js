const axios = require('axios');

export const ReporteAuditoria = async () => {

	var config = {
		method: 'get',
		url: 'http://150.100.253.61:8181/cxf/reportar/services/reportar/auditoria',
		headers: {
		}
	};

	const response = axios(config)
		.then(({ data: outAuditoria }) => {
			return outAuditoria;
		})
		.catch((error) => {
			throw new error(error);
		});

	return response;
}