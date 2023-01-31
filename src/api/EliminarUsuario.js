const axios = require('axios');

export const EliminarUsuario = async (data, usuario) => {
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/eliminarUsuario/services/eliminar',
        headers: {
            'Content-Type': 'application/json',
            id: data,
            userRep: usuario,
        },
    };

    const response = axios(config)
        .then(({ data: outEliminar }) => {

            return outEliminar;
        })
        .catch((error) => {
            return error;
        });

    return response;
}