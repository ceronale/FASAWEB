const axios = require('axios');
var FormData = require('form-data');

export const UploadDocumentos = async (data, convenio) => {
    var formData = new FormData();
    formData.append('file', data);
    formData.append('convenio', convenio);
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    formData.append('userRep', user);
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
    var config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/up/services/upload/file',
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


export const deleteDocumento = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    var config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/delDocument/services/del/document',
        headers: {
            'idDocumento': data,
            'userRep': user
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

    var config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getDocument/services/get/document',
        headers: {
            'convenio': data
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




