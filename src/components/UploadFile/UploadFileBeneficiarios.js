/* eslint-disable */
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as XLSX from 'xlsx/xlsx.mjs';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { UploadExcelBeneficiarios } from '../../api/UploadExcelBeneficiarios';
import { replace } from 'formik';


class UploadFileBeneficiarios extends Component {

    state = {
        // Initially, no file is selected
        selectedFile: null,
        msj: " "
    };


    formatDate(date) {
        if (!date) return null;

        if (date.length === 7) {
            date = "0" + date;
        }

        // Get the day, month, and year from the input string
        const day = date.slice(0, 2);
        const month = date.slice(2, 4);
        const year = date.slice(4);

        // Create a new date object with the given year, month, and day
        const dateObject = new Date(`${year}-${month}-${day}`);

        // Get the timezone offset in minutes and convert to milliseconds
        const timezoneOffset = dateObject.getTimezoneOffset() * 60000;

        // Adjust the date by adding the timezone offset
        const adjustedDate = new Date(dateObject.getTime() + timezoneOffset);

        // Format the date as a string
        let formattedDate = adjustedDate.toISOString().substr(0, 10);
        //replace - in formattedData wiht /
        formattedDate = formattedDate.replace(/-/g, '');

        return formattedDate;
    }

    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        const files = event.target.files[0];
        const file = files;
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = XLSX.read(event.target.result, { type: 'binary', dateNF: 'mm/dd/yyyy;@', cellText: true });
            const sheets = wb.SheetNames;
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheets[0]], { raw: false });


            if (sheets.length) {
                const properties = ['apellido1', 'apellido2', 'ciudad', 'codigoCarga', 'codigoConvenio', 'codigoRelacion', 'comuna', 'credenciales', 'direccion', 'fechaNacimiento', 'genero', 'grupo', 'id', 'mail', 'nombre', 'poliza', 'rutBeneficiario', 'rutTitular', 'termino', 'vigencia'];
                const dateVariables = ['fechaNacimiento', 'termino', 'vigencia'];
                let justJson = XL_row_object;

                justJson.forEach(row => {
                    if (row.rutTitular !== undefined) {
                        row.rutTitular = row.rutTitular.replace(/[^0-9kK]/g, '');
                    }

                    if (row.rutBeneficiario !== undefined) {
                        row.rutBeneficiario = row.rutBeneficiario.replace(/[^0-9kK]/g, '');
                    }

                    if (row.genero !== undefined) {
                        if (row.genero) {
                            row.genero = row.genero.toLowerCase(); // convert to lowercase
                            if (row.genero === 'masculino') {
                                row.genero = 1;
                            } else if (row.genero === 'femenino') {
                                row.genero = 2;
                            }
                        }
                    }

                    dateVariables.forEach(dateVariable => {
                        if (row[dateVariable] !== undefined) {

                            row[dateVariable] = this.formatDate(row[dateVariable]);
                        }
                    });
                });

                const out = this.jsonToCsv(justJson, properties);

                this.setState({ selectedFile: out });;
            }
        }
        reader.readAsArrayBuffer(file);
    };


    jsonToCsv(json, keys) {
        const rows = json.map(obj => keys.map(key => obj[key]));
        const csvContent = rows.reduce((acc, row) => `${acc}${row.join(',')}\n`, `${keys.join(',')}\n`);
        return csvContent;
    }


    // On file upload (click the upload button)
    onFileUpload = async (e, convenioValue) => {
        try {
            e.preventDefault();
            if (this.state.selectedFile !== null) {
                const blob = new Blob([this.state.selectedFile], { type: 'text/csv' });
                var resp = await UploadExcelBeneficiarios(blob, convenioValue);
                if (resp?.response?.status === 403
                ) {
                    alert("Su sesión ha expirado, por favor vuelva a ingresar");
                    //set time out to logout of 5 seconds
                    setTimeout(() => {
                        localStorage.removeItem("user");
                        location.reload();
                    }, 3000);
                    return;
                }
                if (resp.name === 'AxiosError' && resp.code === 'ERR_NETWORK') {
                    this.setState({ msj: "Ha ocurrido un error, por favor vuelva a intentarlo" });;
                    return;
                }
                this.setState({ msj: resp.actualizaResponse[0].detalle });;
            }

        } catch (error) {
            this.setState({ msj: "Ha ocurrido un error, por favor vuelva a intentarlo" });;
        }
    };
    handleClick = event => {
        const { target = {} } = event || {};
        target.value = "";
    };

    render() {
        const { convenio } = this.props;
        const convenioValue = convenio.value;
        return (
            <>
                <Form onSubmit={(e) => this.onFileUpload(e, convenioValue)}>
                    <Row>
                        <Col xs={7}>
                            <Form.Control required onChange={this.onFileChange} onClick={this.handleClick} type="file" />
                        </Col>
                        <Col>
                            <Button type="submit" variant='contained' style={{ marginTop: 5 }}>
                                Subir archivo
                            </Button>
                        </Col>
                    </Row>

                </Form>
                <TextareaAutosize
                    maxRows={4}
                    disabled
                    aria-label="maximum height"
                    value={this.state.msj}
                    style={{ width: "100%", height: 300, overflow: 'auto', marginTop: 20 }}
                />
            </>
        );
    }
}

export default UploadFileBeneficiarios;
