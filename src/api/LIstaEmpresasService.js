const axios = require('axios');

export const LIstaEmpresasService = async () => {
    const user = (JSON.parse(localStorage.getItem("user")));
    var config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/listaEmpresa/services/listarConvenios',
        headers: {
            'token': user.token,
        }
    };

    const response = axios(config)
        .then(({ data: response }) => {
            return response;
        })
        .catch(function (error) {
            return error;

        });
    return response;
}