const axios = require('axios');
var FormData = require('form-data');

export const UploadDocumentos = async (data, convenio) => {
    var formData = new FormData();
    formData.append('file', data);
    formData.append('convenio', convenio);
    const user = (JSON.parse(localStorage.getItem("user")));
    formData.append('userRep', user.correo);
    formData.append('token', user.token);
    var config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/mk/services/visualizar/documento',
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
    const user = (JSON.parse(localStorage.getItem("user")));
    var config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/up/services/upload/file',
        headers: {
            'archivo': data.archivo,
            'convenio': data.convenio,
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


export const deleteDocumento = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    var config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/delDocument/services/del/document',
        headers: {
            'idDocumento': data,
            'userRep': user.correo,
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

export const getDocumentos = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    var config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getDocument/services/get/document',
        headers: {
            'convenio': data,
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




