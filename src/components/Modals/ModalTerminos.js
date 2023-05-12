import React from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';


const ModalTerminos = ({ show, handleClose, msj, title }) => {
    return (
        <Modal show={show} onHide={handleClose} size='xl'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto', textAlign: 'justify' }}>
                <p>
                    <h6>1. ASPECTOS GENERALES</h6> 
                    Estos Términos y Condiciones aplican y se entenderán incorporados en todas consultas realizadas a través del Sitio desarrollado para Convenios ABF (en adelante indistintamente el “Sitio” o la “Página Web”), www.farmaciasahumada.cl. El acceso, uso y todas las transacciones realizadas en el Sitio, implica la aceptación de estos Términos y Condiciones.

                </p>
                <p>
                    <h6>2. REQUISITOS PARA EL USO DEL SITIO PORTAL CONVENIOS</h6>
                    El servicio se encuentra disponible para Clientes que realizan sus compras en Farmacias Ahumada haciendo uso de los Beneficios que se ponen a su disposición y para aquellas empresas que otorgan beneficios a sus afiliados (en adelante también “Usuarios”).
                    La información proporcionada por el Usuario para el registro debe ser correcta y corresponder a la realidad.
                    El Usuario, al hacer uso del Sitio Portal Convenios, acepta y es de su responsabilidad cumplir con estos Términos y Condiciones.
                </p>
                <p>
                    <h6>3. USUARIOS</h6>
                    El Usuario podrá realizar consultas en el Sitio de Portal Convenios como Cliente/Beneficiario o como Empresa.

                </p>
                <p>
                    <h6>3.1 CLIENTE/BENEFICIARIO</h6>
                    Los Usuarios podrán crear una cuenta en el Sitio de Farmacias Ahumada, registrando los datos requeridos en la Plataforma para ello.
                    Al momento de registrarse el usuario deberá establecer una clave secreta que le permitirá el acceso a su cuenta. La clave secreta es personal e intransferible y su administración es de responsabilidad absoluta del Usuario. Farmacias Ahumada no se hace responsable por su mala administración o por su utilización por parte de terceras personas.
                    Con el registro en el Portal Convenios , el Usuario tendrá la opción de registrarse de forma automática como Beneficiario del programa de beneficios Familia Ahumada, otorgándosele acceso a todos sus beneficios y aceptando por tanto sus términos y condiciones disponibles en farmaciasahumada.cl.
                    Al ingresar a la plataforma, el Cliente tendrá acceso a ver el historial de todas las compras realizadas en Farmacias Ahumada, tanto virtuales como presenciales, en las que haya hecho uso de convenios que le otorgaran algún descuento y/o beneficio en la compra.

                </p>
                <p>
                    <h6>3.2 EMPRESA</h6>
                    Las empresas con Convenio con Farmacias Ahumada y que otorguen beneficios a Clientes en sus compras realizadas en Farmacia, tendrán acceso a la plataforma, la que otorgará herramientas de autoservicio, en la que podrán tener acceso al historial de compras en las que han sido utilizado sus beneficios, carga de grupos de beneficios y características, entre otros. Los recursos disponibles en la plataforma variarán dependiendo del Convenio lo que podrá ser consultado con el ejecutivo de Farmacias Ahumada.
                    La empresa podrá administrar sus beneficios de manera autónoma, como asimismo tendrá acceso a una nube colaborativa que permitirá almacenar todos los documentos que forman parte del convenio entre esta y Farmacias Ahumada.
                    Para acceder a la Plataforma la empresa deberá contar con un usuario y contraseña el que será otorgado por el departamento de Negocios Corporativos Farmacias Ahumada.
                </p>
                <p>
                    <h6>4.PRECIO</h6>
                    El uso de la plataforma es gratuito tanto para Cliente como para Empresas.
                </p>
                <p>
                    <h6>5. COMUNICACIONES</h6>
                </p>
                <p>
                    <h6>5.1 COMUNICACIONES PROMOCIONALES</h6>
                    Toda comunicación promocional o publicitaria que Farmacias Ahumada envíe a sus Usuarios mediante correo electrónico tendrá claramente identificado como remitente a Farmacias Ahumada y en el asunto se detallará a qué se refiere. Los Usuarios podrán solicitar la suspensión de los envíos de estas comunicaciones, mediante el link que se incluye en cada uno de sus correos publicitarios.
                </p>
                <p>
                    <h6>5.2 COMUNICACIONES RECIPROCAS</h6>

                    Todas las notificaciones y comunicaciones por parte de Farmacias Ahumada a los Usuarios del Sitio de ABF podrán realizarse a través de los siguientes medios:<br></br>
                    a.	Correo electrónico a la casilla que el Usuario haya indicado al momento de registrarse en el Sitio de ABF.<br></br>
                    b.	Teléfono, mediante llamados, SMS y/o Whatsapp al número que el Usuario haya informado a Farmacias Ahumada.
                   <br></br>
                   <br></br>
                    Todas las comunicaciones por parte de los Usuarios de Farmacias Ahumada podrán efectuarse a través de los siguientes medios: <br></br>
                    a.	OK <br></br>
                    b.	Cuestionario web disponible en la página.
                </p>
                <p>
                    <h6>6. PRIVACIDAD</h6>
                    Toda la información recopilada producto de las transacciones realizadas a través del Sitio de Farmacias Ahumada será acorde a lo dispuesto por la Ley 19.496, sobre Protección de los Derechos de los Consumidores y de la Ley 19.628 sobre Protección de la Vida Privada, en lo que sea pertinente.

                    Para mayor información respecto a la privacidad y uso de la información, puedes acceder a nuestras Políticas de Privacidad disponibles en farmaciasahumada.cl, las que para todos los efectos legales forman parte integrante de estos Términos y Condiciones.

                </p>
                <p>
                    <h6>7. DISPONIBILIDAD DEL SERVICIO</h6>
                    Farmacias Ahumada no se hace responsable por cualquier daño, perjuicio o pérdida a los Usuarios por fallas en el sistema, en el servido o en internet que impida o restringa la prestación de los servicios aquí detallados.
                    Los usuarios en este acto de responsabilidad alguna a estos efectos, y por tanto de exigir pago por daños o perjuicios de cualquier especie resultantes de dificultades técnicas o fallas en los sistemas o en internet.
                    Farmacias Ahumada no garantiza el acceso y uso ininterrumpido de los servicios de telemedicina.
                </p>
                <p>
                    <h6>8. MODIFICACIONES</h6>
                    Farmacias Ahumada podrá modificar los presentes términos y condiciones en cualquier momento, estableciendo disposiciones adicionales sobre el Servicio. Dichas modificaciones o adiciones entrarán en vigencia inmediatamente y se incorporarán a los presentes términos y condiciones. El uso continuado del servicio se considerará como aceptación de dichas modificaciones o adiciones.
                </p>
                <p>
                    <h6>9. TÉRMINO Y VIGENCIA DEL SERVICIO</h6>
                    Farmacias Ahumada se reserva el derecho a modificar, suspender o descontinuar el Portal Convenios  (o cualquier parte o contenido) en caso de incumplimiento de los presentes Términos y Condiciones, en cualquier momento con o sin mediar notificación.

                </p>

                <p>
                    <h6>10. LEY APLICABLE, JURISDICCIÓN Y NOTIFICACIONES</h6>
                    Para todos los efectos legales de los presentes términos y condiciones, la ley aplicable será la ley chilena, fijándose como domicilio la ciudad de Santiago de Chile y sometiéndose las partes, esto es, Farmacias Ahumada y los Usuarios, a la Jurisdicción de sus Tribunales Ordinarios de Justicia.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='contained' onClick={handleClose}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};



export default ModalTerminos;