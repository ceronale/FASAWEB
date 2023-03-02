const axios = require('axios');

export const ReporteAuditoriaService = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));

    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/reportar/services/reportar/auditoria',
        headers: {
            'user': data.user,
            'servicio': data.servicio,
            'accion': data.accion,
            'fechaDesde': data.fechaDesde,
            'fechaHasta': data.fechaHasta,
            'token': user.token
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            return error.response.status;
        });

    return response;
}


export const getUsuarios = async () => {
    const user = (JSON.parse(localStorage.getItem("user")));

    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listandoRep/services/listar/rep',
        headers: {
            'token': user.token
        }
    };

    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            return error.response.status;
        });

    return response;
}

