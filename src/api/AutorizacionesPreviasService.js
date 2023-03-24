const axios = require('axios');

export const setAutorizaciones = async (data, user) => {
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/aut/services/insertar/autorizaciones',
        headers: {
            'credenciales': data.cardHolder,
            'codigoPersona': data.personCode,
            'campo': data.Campo,
            'valorCampo': data.valorCampo,
            'incluir_exc': data.inEx,
            'fecha_inicio': data.desde,
            'fecha_termino': data.hasta,
            'planId': data.Protocolo,
            'idMedico': data.rutMedico,
            'medicoIncExc': data.inExMedico,
            'envases': data.maxEnvases,
            'userRep': user,
            'token': userx.token,
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


export const getAutorizaciones = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/list/services/listar/autorizaciones',
        headers: {
            'rut': data.rut,
            'convenio': data.convenio,
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

export const descripcionProductos = async (valorCampo, valor) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/descripcion/services/listar/producto',
        headers: {
            'valor': valor,
            'valorCampo': valorCampo,
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

export const getBeneficiarioCarga = async (convenio, rut) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listAut/services/list/beneAut',
        headers: {
            'codigoCliente': "CSCB",
            'activos': 1,
            'rut': rut,
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