const axios = require('axios');

export const getLista = async (data) => {
    const config = {
        method: 'get',
        url: 'http://localhost:8181/cxf/listarCodigos/services/listar/listaCodigos',
        headers: {
            'codigoConvenio': data
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {

            return out;
        })
        .catch(function (error) {
            return error;
        });
    return response;
}

export const getMedicos = async (data) => {
    const config = {
        method: 'get',
        url: 'http://localhost:8181/cxf/listarMedicos/services/listar/listaMedicos',
        headers: {
            'codigoLista': data
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {

            return out;
        })
        .catch(function (error) {
            return error;
        });
    return response;
}

export const updateMedico = async (data, user) => {

    const config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/actualizarMedic/services/act/actualizarListaMedic',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'fecha': data.fecha,
            'exc_inc': data.exc_inc,
            'operacion': data.operacion,
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