const axios = require('axios');
var FormData = require('form-data');

export const UploadPolizas = async (data) => {
    var formData = new FormData();
    formData.append('csv', data);
    var config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/carga/services/csv',
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