const axios = require('axios');

export const getLista = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listarCodigos/services/listar/listaCodigos',
        headers: {
            'codigoConvenio': data,
            'token': user.token
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
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listarMedicos/services/listar/listaMedicos',
        headers: {
            'codigoLista': data,
            'token': user.token
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

export const updateMedico = async (data, user) => {
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/actualizarMedic/services/act/actualizarListaMedic',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'fecha': data.fecha,
            'exc_inc': data.exc_Inc,
            'userRep': user,
            'token': userx.token

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
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/drlm/services/del/eliminarRut',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'userRep': user,
            'token': userx.token
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
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/agregar/services/Ins/agregarRut',
        headers: {
            'codigoLista': data.codigoLista,
            'rut': data.rut,
            'fecha': data.fecha,
            'exc_inc': data.exc_inc,
            'userRep': user,
            'token': userx.token
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