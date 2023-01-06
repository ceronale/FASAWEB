import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as XLSX from 'xlsx/xlsx.mjs';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { UploadMedicos } from "../../api/UploadExcelMedicos";

class UploadFileMedicos extends Component {

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
                for (let i = 0; i < jsonRows.length; i++) {
                    //replace , with empty space in jsonRows[i].nombre
                    jsonRows[i].nombre = jsonRows[i].nombre.replaceAll(',', '');
                    if (jsonRows[i].fechaDesde.includes("/")) {
                        var dateString = jsonRows[i].fechaDesde.replaceAll('-', '/')
                        var dateObject = new Date(dateString);
                        var day = dateObject.getDate();
                        var month = dateObject.getMonth();
                        var year = dateObject.getFullYear();
                        dateObject = `${day}-${month}-${year}`;
                        jsonRows[i].terminoBeneficio = dateObject;
                    }
                }
                const rows = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(jsonRows));
                console.log(rows)
                this.setState({ selectedFile: rows });;
            }
        }
        reader.readAsArrayBuffer(file);
    };

    // On file upload (click the upload button)
    onFileUpload = async (e) => {
        e.preventDefault();
        if (this.state.selectedFile !== null) {
            const blob = new Blob([this.state.selectedFile], { type: 'text/csv' });
            var resp = await UploadMedicos(blob);
            this.setState({ msj: resp });;
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
                            <Button type="submit" variant="contained" style={{ marginTop: 5 }}>
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

export default UploadFileMedicos;
