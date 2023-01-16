const axios = require('axios');
var FormData = require('form-data');

export const UploadDocumentos = async (data, convenio) => {
    var formData = new FormData();
    formData.append('file', data);
    formData.append('convenio', convenio);
    var config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/mk/services/visualizar/documento',
        data: formData
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

export const getDocumento = async (data) => {

    var config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/up/services/upload/file',
        headers: {
            'archivo': data.archivo,
            'convenio': data.convenio
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


