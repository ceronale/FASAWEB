const axios = require('axios');

export const getRoles = async () => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/leerRoles/services/leer/roles',
        headers: {
        }
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

export const getRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/reportar/services/reportar/auditoria',
        headers: {
            'user': data.user,
            'servicio': data.servicio,
            'accion': data.accion,
            'fechaDesde': data.fechaDesde,
            'fechaHasta': data.fechaHasta
        }
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

export const deleteRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/delRol/services/del/roles',
        headers: {
            'id_rol': data,
            'userRep': 'gerald'
        }
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

export const getComponentes = async () => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getAllrecursos/services/listar/recurso',
        headers: {}
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

export const getComponentesByRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getAllRecursosRol/services/listar/recurso/rol',
        headers: {
            'id_rol': data
        }
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

export const addRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'put',
        url: 'http://150.100.253.61:8181/cxf/ins/services/ins/roles',
        headers: {
            'nombre': data.nombre,
            'vigencia': 'S',
            'recursos': data.recursos,
            'userRep': user,
        }
    };
    console.log(config);

    const response = axios(config)
        .then(({ data: out }) => {
            return out;
        })
        .catch((error) => {
            throw new error(error);
        });

    return response;
}
export const updateRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user"))).correo;
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/actRol/services/act/roles',
        headers: {
            'userRep': user,
            'nombre': data.nombre,
            'id_rol': data.id_rol,
            'recursos': data.recursos,
            'vigencia': 'S'
        }
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







