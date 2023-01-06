const axios = require('axios');

export const LIstaEmpresasService = async () => {

    var config = {
        method: 'get',
        url: 'http://localhost:8181/cxf/listaEmpresa/services/listarEmpresa',
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