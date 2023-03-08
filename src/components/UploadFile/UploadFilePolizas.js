
/* eslint-disable */
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as XLSX from 'xlsx/xlsx.mjs';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { UploadPolizas } from "../../api/UploadExcelPolizas";

class UploadFilePolizas extends Component {

    state = {
        // Initially, no file is selected
        selectedFile: null,
        msj: " "
    };

    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        const files = event.target.files[0];
        const file = files;
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = XLSX.read(event.target.result, { type: 'binary', dateNF: 'mm/dd/yyyy;@', cellText: true });
            const sheets = wb.SheetNames;
            const XL_row_object = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheets[0]], { raw: false });

            if (sheets.length) {
                const properties = ['codigoPoliza', 'estadoPolizaAhumada', 'grupoAhumada', 'nombrePoliza', 'polizaAceptaBioequivalente', 'rutEmpresa', 'terminoBeneficio', 'cuentaLiquidador'];
                const dateVariables = ['terminoBeneficio'];
                let justJson = XL_row_object;

                justJson.forEach(row => {
                    if (row.rutEmpresa !== undefined) {
                        row.rutEmpresa = row.rutEmpresa.replace(/[^0-9kK]/g, '');
                    }
                    if (row.nombrePoliza !== undefined) {
                        row.nombrePoliza = row.nombrePoliza.replace(/,/g, '');
                    }


                    dateVariables.forEach(dateVariable => {
                        if (row[dateVariable] !== undefined) {
                            row[dateVariable] = this.formatDate(row[dateVariable]);
                        }
                    });
                });

                const out = this.jsonToCsv(justJson, properties);

                this.setState({ selectedFile: out });
            }
        }
        reader.readAsArrayBuffer(file);
    };


    jsonToCsv(json, keys) {
        const rows = json.map(obj => keys.map(key => obj[key]));
        const csvContent = rows.reduce((acc, row) => `${acc}${row.join(',')}\n`, `${keys.join(',')}\n`);
        return csvContent;
    }

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
        const formattedDate = adjustedDate.toISOString().substr(0, 10);

        return formattedDate;
    }

    // On file upload (click the upload button)
    onFileUpload = async (e, convenioValue) => {

        e.preventDefault();
        if (this.state.selectedFile !== null) {
            const blob = new Blob([this.state.selectedFile], { type: 'text/csv' });
            var resp = await UploadPolizas(blob, convenioValue);
            if (resp === 403) {
                alert("Su sesión ha expirado, por favor vuelva a ingresar");
                //set time out to logout of 5 seconds
                setTimeout(() => {
                    localStorage.removeItem("user");
                    location.reload();
                }, 3000);
                return;
            }

            this.setState({ msj: resp.response1[0].detalleRespuest });;
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

export default UploadFilePolizas;
