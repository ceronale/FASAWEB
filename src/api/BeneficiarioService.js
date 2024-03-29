const axios = require('axios');

export const getBeneficiarios = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/beneficiario/services/listar/beneficiario',
        headers: {
            'codigoCliente': data.codigoCliente,
            'activos': data.activos,
            'rut': data.rut,
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

export const updateBeneficiario = async (data, user) => {
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/beneUp/services/actualizar/beneficiario',
        headers: {
            'rutEmpresa': data.rutTitular,
            'codigoCliente': data.codigoConvenio,
            'RutTitular': data.rutTitular,
            'rutBeneficiario': data.rutBeneficiario,
            'codigoCarga': data.codigoCarga,
            'codigoGrupo': data.grupo,
            'codigoPlan': "a",
            'poliza': data.poliza,
            'codigoRelacion': data.codigoRelacion,
            'primeroNombre': data.nombre,
            'paterno': data.apellido1,
            'materno': data.apellido2,
            'nacimiento': data.fechaNacimiento,
            'vigencia': data.vigencia,
            'termino': data.termino,
            'bloqueo': "a",
            'sexo': data.genero,
            'mail': data.mail,
            'direccion': data.direccion,
            'codigoPostal': "a",
            'comuna': data.comuna,
            'ciudad': data.ciudad,
            'userRep': user,
            'token': userx.token
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




export const updateBeneficiarioTermino = async (data, user) => {
    const userx = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/beneUpTermino/services/actualizar/terminoBeneficiario',
        headers: {
            'rutEmpresa': data.rutTitular,
            'codigoCliente': data.codigoConvenio,
            'RutTitular': data.rutTitular,
            'rutBeneficiario': data.rutBeneficiario,
            'codigoCarga': data.codigoCarga,
            'codigoGrupo': data.grupo,
            'codigoPlan': "a",
            'poliza': data.poliza,
            'codigoRelacion': data.codigoRelacion,
            'primeroNombre': data.nombre,
            'paterno': data.apellido1,
            'materno': data.apellido2,
            'nacimiento': data.fechaNacimiento,
            'vigencia': data.vigencia,
            'termino': data.termino,
            'bloqueo': "a",
            'sexo': data.genero,
            'mail': data.mail,
            'direccion': data.direccion,
            'codigoPostal': "a",
            'comuna': data.comuna,
            'ciudad': data.ciudad,
            'userRep': user,
            'token': userx.token
        }
    };
    console.log(config)
    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            return error;

        });

    return response;
}
