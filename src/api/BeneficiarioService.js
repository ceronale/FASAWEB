const axios = require('axios');

export const getBeneficiarios = async (data) => {

    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/beneficiario/services/listar/beneficiario',
        headers: {
            'codigoCliente': "EURA",
            'activos': data.activos,
            'rut': data.rut
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
    const config = {
        method: 'post',
        url: 'http://localhost:8181/cxf/beneUp/services/actualizar/beneficiario',
        headers: {
            'rutEmpresa': data.rutEmpresa,
            'codigoCliente': data.codigoConvenio,
            'RutTitular': data.RutTitular,
            'rutBeneficiario': data.rutBeneficiario,
            'codigoCarga': data.codigoCarga,
            'codigoGrupo': data.grupo,
            'codigoPlan': " data.codigoPlan",
            'poliza': data.poliza,
            'codigoRelacion': " data.codigoRelacion",
            'primeroNombre': data.nombre,
            'paterno': data.apellido1,
            'materno': data.apellido2,
            'nacimiento': data.fechaNacimiento,
            'vigencia': data.vigencia,
            'termino': data.termino,
            'bloqueo': "data.bloqueo",
            'sexo': data.genero,
            'mail': data.mail,
            'direccion': "data.direccion",
            'codigoPostal': " data.codigoPostal",
            'comuna': "data.comuna",
            'ciudad': "data.ciudad",
            'userRep': user,
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