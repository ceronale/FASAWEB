const axios = require('axios');

export const setAutorizaciones = async (data, user) => {
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
