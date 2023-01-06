const axios = require('axios');
var FormData = require('form-data');

export const UploadMedicos = async (data) => {
    var formData = new FormData();
    formData.append('csv', data);
    var config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/cargaMedico/services/csv/medicos',
        data: formData
    };
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            throw new error(error);
        });

    return response;
}