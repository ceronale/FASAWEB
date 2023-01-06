const axios = require('axios');

export const ReporteAuditoriaService = async (data) => {
    console.log(data)
    const config = {
        method: 'get',
        url: 'http://localhost:8181/cxf/reportar/services/reportar/auditoria',
        headers: {
            'user': data.user,
            'servicio': data.servicio,
            'accion': data.accion,
            'fechaDesde': data.fechaDesde,
            'fechaHasta': data.fechaHasta
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            throw new error(error);
        });

    return response;
}


