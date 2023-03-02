const axios = require('axios');
var FormData = require('form-data');

export const UploadMedicos = async (data, codigoLista) => {
    var formData = new FormData();
    formData.append('csv', data);
    formData.append('codigoLista', codigoLista);
    const user = (JSON.parse(localStorage.getItem("user")));
    formData.append('userRep', user.correo);
    formData.append('token', user.token);

    var config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/cargaMedico/services/csv/medicos',
        data: formData
    };
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {

            return error.response.status;

        });

    return response;
}