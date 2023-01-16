const axios = require('axios');

export const LIstaEmpresasService = async () => {

    var config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listaEmpresa/services/listarConvenios',
        headers: {}
    };

    const response = axios(config)
        .then(({ data: response }) => {

            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
    return response;
}