const axios = require('axios');

export const ReporteAuditoriaService = async (data) => {
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/reportar/services/reportar/auditoria',
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


export const getUsuarios = async () => {
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listandoRep/services/listar/rep',
        headers: {}
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

