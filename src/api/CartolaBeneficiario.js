const axios = require('axios');

export const getCartola = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/cartola/services/ver/cartola',
        headers: {
            'Tipo': data.tipo,
            'codigoConvenio': data.codigoConvenio,
            'rut': data.rut,
            'fechaIni': data.fechaIni,
            'fechaFin': data.fechaFin,
            'token': user.token,
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