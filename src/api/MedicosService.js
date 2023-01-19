const axios = require('axios');

export const getLista = async (data) => {
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listarCodigos/services/listar/listaCodigos',
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
        url: 'http://150.100.253.61:8181/cxf/listarMedicos/services/listar/listaMedicos',
        headers: {
            'codigoLista': data
        }
    };
    const response = axios(config)
        .then(({ data: out }) => {

            return out;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });

    return response;
}

export const updateMedico = async (data, user) => {
    console.log(data, user)
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/actualizarMedic/services/act/actualizarListaMedic',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'fecha': data.fecha,
            'exc_inc': data.exc_Inc,
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

export const deleteMedico = async (data, user) => {

    const config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/drlm/services/del/eliminarRut',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
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

export const addMedico = async (data, user) => {
    console.log(data, user)
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/agregar/services/Ins/agregarRut',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'fecha': data.fecha,
            'exc_inc': data.exc_inc,
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