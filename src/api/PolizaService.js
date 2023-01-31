const axios = require('axios');

export const PolizaService = async (data) => {

    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/buscarpolizas/services/buscarPoliza',
        headers: {
            'codigo': data
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

export const PolizaServiceUpdate = async (grupo, nombre, codigo, rut, fecha, bio, user) => {

    const config = {
        method: 'put',
        url: 'http://150.100.253.61:8181/cxf/act/services/actualizarP',
        headers: {
            'grupo': grupo,
            'nombre': nombre,
            'codigo': codigo,
            'rut': rut,
            'fecha': fecha,
            'bio': bio,
            'userRep': user
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