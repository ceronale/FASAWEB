import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as XLSX from 'xlsx/xlsx.mjs';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { UploadMedicos } from "../../api/UploadExcelMedicos";

const UploadFileMedicos = props => {

    const [state, setState] = useState({
        selectedFile: null,
        msj: " "
    });

    // On file select (from the pop up)
    const onFileChange = event => {
        // Update the state
        const files = event.target.files[0];
        const file = files;
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = XLSX.read(event.target.result);
            const sheets = wb.SheetNames;
            if (sheets.length) {

                const jsonRows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });

                const properties = ['codigoLista', 'exc_Inc', 'fechaDesde', 'nombre', 'rutMedico'];

                for (let i = 0; i < jsonRows.length; i++) {

                    for (let j = 0; j < properties.length; j++) {
                        jsonRows[i][properties[j]] = jsonRows[i][properties[j]] ?? '';
                        if (properties[j] !== 'nombre') {
                            jsonRows[i][properties[j]] = jsonRows[i][properties[j]].trim();
                        }
                        if (properties[j] === 'nombre') {
                            jsonRows[i][properties[j]] = jsonRows[i][properties[j]].replaceAll(',', '');
                        }
                    }

                    //Excute the if just if the fechaDesde is not empty
                    if (jsonRows[i].fechaDesde !== undefined) {
                        if (jsonRows[i].fechaDesde.includes("/")) {
                            var dateString = jsonRows[i].fechaDesde.replaceAll('-', '/')
                            var dateObject = new Date(dateString);
                            var day = dateObject.getDate();
                            var month = dateObject.getMonth();
                            var year = dateObject.getFullYear();
                            dateObject = `${day}-${month}-${year}`;
                            jsonRows[i].fechaDesde = dateObject;
                        }
                    }
                }
                const out = jsonToCsv(jsonRows, properties);

                setState({ selectedFile: out });;
            }
        }
        reader.readAsArrayBuffer(file);
    };

    function jsonToCsv(json, keys) {
        const rows = json.map(obj => keys.map(key => obj[key]));
        const csvContent = rows.reduce((acc, row) => `${acc}${row.join(',')}\n`, `${keys.join(',')}\n`);
        return csvContent;
    }

    // On file upload (click the upload button)
    const onFileUpload = async (e) => {
        e.preventDefault();
        if (state.selectedFile !== null) {
            const blob = new Blob([state.selectedFile], { type: 'text/csv' });
            var resp = await UploadMedicos(blob, props.codigoLista);
            setState({ msj: resp.response1[0].detalleRespuest });;
        }
    };
    const handleClick = event => {
        const { target = {} } = event || {};
        target.value = "";
    };

    return (

        <>
            <Form onSubmit={onFileUpload}>
                <Row>
                    <Col xs={7}>
                        <Form.Control required onChange={onFileChange} onClick={handleClick} type="file" />
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
                value={state.msj}
                style={{ width: "100%", height: 300, overflow: 'auto', marginTop: 20 }}
            />
        </>
    );

}

export default UploadFileMedicos;
