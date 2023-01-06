// Archivo en el cual se encuentran los componentes y sus 
// caracteristicas que conforman los formularios.

import styled from "styled-components";

//Constante de colores a utilizar
const colores = {
    borde: "#2192FF",
    error: "#bb2929",
    exito: "#2B7A0B"
}

//Estructura de formulario
const Formulario = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px 70px;

    @media (max-width: 800px){
        grid-template-columns: 1fr;
    }
`;

//Estructura de formulario Paciente Cliente
const FormPaciente = styled.div`
    padding-top: 35px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px 10px;

    @media (max-width: 800px){
        grid-template-columns: 1fr;
    }
`;

//Div Titulos
const DivTitulos = styled.div`
    display: block;
    border-bottom-style:solid;
    border-bottom-width: 1px;
    border-bottom-color: rgb(198, 198, 198);
    text-align: left;

`;

//Titulos
const Titulo = styled.label`
    font-size: 19px;
    font-style: normal;
    font-weight: 500;
    font-family: Arial, Helvetica, sans-serif;
    padding-bottom: 10px;
`;

//Label de los formularios
const Label = styled.label`
    font-family: Arial, Helvetica, sans-serif;
    color: rgb(77, 76, 83);
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 600;
    min-height: 25px;
    padding-top: 5px
    padding-bottom: 5px;s
`;

//Aviso de restricciones de contraseña
//Largo - C.Especial - Numero
const RestriccionPass = styled.div`
    font-family: Arial, Helvetica, sans-serif;
    padding-top: 10px;
    font-size: 12px;
    color: #73777B;
`;

//Grupos de input de los formularios
const GrupoInput = styled.div`
    position: relative;
    z.index: 90;
    padding-top: 6px;
    padding-bottom: 10px;
    text-align: left;
`;

//Input passwd validacion
const Inputp = styled.input.attrs(props => ({
    maxLength: props.max,
    minLength: props.min
}))`
    text-size: 12px
    font-family: Arial, Helvetica, sans-serif
    letter-spacing: 0.8px
    color: red;
    width: 100%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 45px;
    line-height: 45px;
    padding 0 15px 0 15px;
    border: 0.5px solid rgb(194, 194, 194);

    &:focus {
        border: 2px solid ${colores.borde};
        outline: none;
        box-shadow: 3px 0px 15px rgba(163, 163, 163, 0.4);
    }
`;
//Input de los formularios
const Inputs = styled.input`
    text-size: 12px
    font-family: Arial, Helvetica, sans-serif
    letter-spacing: 0.8px
    color: red;
    width: 100%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 45px;
    line-height: 45px;
    padding 0 15px 0 15px;
    border: 0.5px solid rgb(194, 194, 194);

    &:focus {
        border: 2px solid ${colores.borde};
        outline: none;
        box-shadow: 3px 0px 15px rgba(163, 163, 163, 0.4);
    }
`;

//Input de los formularios Polizas y Grupos
const Inputu = styled.input`
    text-size: 12px
    font-family: Arial, Helvetica, sans-serif
    letter-spacing: 0.8px
    color: red;
    width: 40%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 40px;
    line-height: 45px;
    padding 0 15px 0 15px;
    border: 0.5px solid rgb(194, 194, 194);

    &:focus {
        border: 2px solid ${colores.borde};
        outline: none;
        box-shadow: 3px 0px 15px rgba(163, 163, 163, 0.4);
    }
`;

//Input Administrar Usuario (Eliminar)
const InputB = styled.input`
    text-size: 12px
    font-family: Arial, Helvetica, sans-serif
    letter-spacing: 0.8px
    color: red;
    width: 55%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 45px;
    line-height: 45px;
    border: 0.5px solid rgb(194, 194, 194);
`;

//Input para formulario de lectura HOME
const InputH = styled.input`
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 0.8px;
    color: #73777B;
    width: 100%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 37  px;
    line-height: 45px;
    padding 0 40px 0 10px;
    border: 0.5px solid rgb(194, 194, 194);
`;
const Inputc = styled.input`
    text-size: 12px
    font-family: Arial, Helvetica, sans-serif
    letter-spacing: 0.8px
    color: red;
    width: 70%;
    background: #FFFFFF;
    border-radius: 3px;
    height: 45px;
    line-height: 45px;
    padding 0 15px 0 15px;
    border: 0.5px solid rgb(194, 194, 194);

    &:focus {
        border: 2px solid ${colores.borde};
        outline: none;
        box-shadow: 3px 0px 15px rgba(163, 163, 163, 0.4);
    }
`;
//Mensaje de exito - formulario completado
const MensajeExito = styled.p`
    font-family: Arial, Helvetica, sans-serif;
    color: ${colores.exito};
    font-size: 13px;
    font-weight: 500;
    display: none;
`;

//Campos requeridos
const LabelReq = styled.label`
    color: red;
`;

//Formularios de una sola columna
const FormularioUnic = styled.form`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px 75px;
`;

//Mensaje de error bajo los input
const LeyendaError = styled.p`
    margin-top: 5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    margin-bottom: 0;
    color: ${colores.error};
    display: none;
`;

//Contendor de titulos
const ContenedorTitulo = styled.div`
    color: rgb(33, 37, 41);
    width: 100%;
    font-size: 18px;
    font-style: normal;
    font-weight: 300;
    line-height: 27px;
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgb(232, 232, 232);
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    padding-top: 30px;
    padding-bottom: 10px;
`;

//Exportaciones
export {
    Formulario,
    Label,
    GrupoInput,
    Inputs,
    InputH,
    InputB,
    Inputp,
    Inputu,
    Inputc,
    LabelReq,
    FormularioUnic,
    LeyendaError,
    MensajeExito,
    FormPaciente,
    RestriccionPass,
    ContenedorTitulo,
    Titulo,
    DivTitulos,
};