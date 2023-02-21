const axios = require('axios');
var FormData = require('form-data');

export const UploadExcelBeneficiarios = async (data, convenio) => {

    var formData = new FormData();
    formData.append('csv', data);
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    formData.append('userRep', user);
    formData.append('convenio', convenio);

    var config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/beneUpmasivo/services/csv/beneficiarios',
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