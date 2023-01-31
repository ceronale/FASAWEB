
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as XLSX from 'xlsx/xlsx.mjs';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { UploadExcelBeneficiarios } from '../../api/UploadExcelBeneficiarios';
import moment from 'moment';


class UploadFileBeneficiarios extends Component {

    state = {
        // Initially, no file is selected
        selectedFile: null,
        msj: " "
    };

    formatDate(date) {
        if (!date) return null;

        if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(date)) {
            return null;
        }

        let dateArray = date.split(/[\/-]/);
        let year = dateArray[2];
        let month = dateArray[1];
        let day = dateArray[0];

        return year + month.padStart(2, '0') + day.padStart(2, '0');
    }

    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        const files = event.target.files[0];
        const file = files;
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = XLSX.read(event.target.result, { type: 'binary', dateNF: 'dd/mm/yyyy;@', cellDates: true });
            const sheets = wb.SheetNames;
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheets[0]], { raw: false });
            var json_object = JSON.stringify(XL_row_object);

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
                        if (row.genero === 'masculino') {
                            row.genero = 1;
                        } else if (row.genero === 'femenino') {
                            row.genero = 2;
                        }
                    }

                    dateVariables.forEach(dateVariable => {
                        if (row[dateVariable] !== undefined) {
                            row[dateVariable] = this.formatDate(row[dateVariable]);
                        }
                    });
                });

                const out = this.jsonToCsv(justJson, properties);
                console.log(out);
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
    onFileUpload = async (e) => {
        e.preventDefault();
        if (this.state.selectedFile !== null) {
            const blob = new Blob([this.state.selectedFile], { type: 'text/csv' });
            var resp = await UploadExcelBeneficiarios(blob);
            this.setState({ msj: resp.actualizaResponse[0].detalle });;
        }
    };
    handleClick = event => {
        const { target = {} } = event || {};
        target.value = "";
    };

    render() {
        return (
            <>
                <Form onSubmit={this.onFileUpload}>
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
