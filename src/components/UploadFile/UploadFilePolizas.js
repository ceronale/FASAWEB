
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
            const wb = XLSX.read(event.target.result);
            const sheets = wb.SheetNames;
            if (sheets.length) {
                const jsonRows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });
                const properties = ['codigoPoliza', 'estadoPolizaAhumada', 'grupoAhumada', 'nombrePoliza', 'polizaAceptaBioequivalente', 'rutEmpresa', 'terminoBeneficio', 'cuentaLiquidador'];
                for (let i = 0; i < jsonRows.length; i++) {

                    for (let j = 0; j < properties.length; j++) {
                        jsonRows[i][properties[j]] = jsonRows[i][properties[j]] ?? '';
                        if (properties[j] !== 'nombrePoliza') {
                            jsonRows[i][properties[j]] = jsonRows[i][properties[j]].trim();
                        }
                    }

                    if (jsonRows[i].terminoBeneficio !== undefined) {
                        if (jsonRows[i].terminoBeneficio.includes("/")) {
                            var dateString = jsonRows[i].terminoBeneficio.replaceAll('-', '/')
                            var dateObject = new Date(dateString);
                            var day = dateObject.getDate();
                            var month = dateObject.getMonth();
                            var year = dateObject.getFullYear();
                            dateObject = `${day}-${month}-${year}`;
                            jsonRows[i].terminoBeneficio = dateObject;
                        }
                    }
                }
                const out = this.jsonToCsv(jsonRows, properties);
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
        e.preventDefault();
        if (this.state.selectedFile !== null) {
            const blob = new Blob([this.state.selectedFile], { type: 'text/csv' });
            var resp = await UploadPolizas(blob, convenioValue);
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
