const axios = require('axios');

export const getCartola = async (data) => {
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/cartola/services/ver/cartola',
        headers: {
            'Tipo': data.tipo,
            'codigoConvenio': data.codigoConvenio,
            'rut': data.rut,
            'fechaIni': data.fechaIni,
            'fechaFin': data.fechaFin,
            'tipo': data.tipo,
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            return error;
        });

    return response;
}