const axios = require('axios');

export const getRoles = async () => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/leerRoles/services/leer/roles',
        headers: {
            "token": user.token
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

export const getRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/reportar/services/reportar/auditoria',
        headers: {
            'user': data.user,
            'servicio': data.servicio,
            'accion': data.accion,
            'fechaDesde': data.fechaDesde,
            'fechaHasta': data.fechaHasta,
            "token": user.token
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

export const deleteRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'delete',
        url: 'http://150.100.253.61:8181/cxf/delRol/services/del/roles',
        headers: {
            'id_rol': data,
            'userRep': user.correo,
            "token": user.token
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

export const getComponentes = async () => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getAllrecursos/services/listar/recurso',
        headers: {
            "token": user.token
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

export const getComponentesByRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getAllRecursosRol/services/listar/recurso/rol',
        headers: {
            'id_rol': data,
            "token": user.token
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

export const addRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'put',
        url: 'http://150.100.253.61:8181/cxf/ins/services/ins/roles',
        headers: {
            'nombre': data.nombre,
            'vigencia': 'S',
            'recursos': data.recursos,
            'userRep': user.correo,
            "token": user.token
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

export const updateRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));

    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/actRol/services/act/roles',
        headers: {
            'userRep': user.correo,
            'nombre': data.nombre,
            'id_rol': data.id_rol,
            'recursos': data.recursos,
            'nuevoRecurso': data.nuevoRecurso,
            'vigencia': 'S',
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

export const getComponentesAndRolByUser = async (data) => {

    const config = {
        method: 'get',
        url: 'http://150.100.253.61:8181/cxf/getUsuarioRol/services/listar/usuario/rol',
        headers: {
            'id_usuario': data
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

export const setUserAndRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'put',
        url: 'http://150.100.253.61:8181/cxf/asociarUsuario/services/asociar/rol/usuario',
        headers: {
            'id_usuario': data.id_usuario,
            'id_rol': data.id_rol,
            'userRep': user.correo,
            'vigencia': 'S',
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

export const updateUserAndRol = async (data) => {
    const user = (JSON.parse(localStorage.getItem("user")));
    const config = {
        method: 'post',
        url: 'http://150.100.253.61:8181/cxf/actUsuarioRol/services/act/usuario/rol',
        headers: {
            'id_rol': data.id_rol,
            'id_rolNuevo': data.id_rolNuevo,
            'id_usuario': data.id_usuario,
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









