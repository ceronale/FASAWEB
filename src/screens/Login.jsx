//Importaciones//
import React from "react";
import { LoginService } from "../api/LoginService";
import "../styles/Login.css";
import { Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import { DivTitulos, FormPaciente, Titulo } from "../components/Formularios";
import FormLogin from "../components/FormLogin";


const Login = () => {
  const history = useNavigate();

  LoginService("user@email.com", "password");

  const onSubmit = async (e) => {
    history("/NuevoPacienteCliente");
  };

  return (
    <main>
      <Formik action="" >
        <FormPaciente>
          <FormLogin />
          <div>
            <DivTitulos>
              <Titulo>Nuevo Paciente Cliente</Titulo>
            </DivTitulos>
            <div id="notaRegistro">
              Si no te encuentras registrado, puedes crear una cuenta a
              continuacion.
            </div>
            <div id="accionRegistro">
              <div id="botonRegistro">
                <button onClick={onSubmit}>Crear Cuenta</button>
              </div>
            </div>
          </div>
        </FormPaciente>
      </Formik>

    </main>
  );
};

export default Login;
