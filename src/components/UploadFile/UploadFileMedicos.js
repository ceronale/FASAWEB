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
            const wb = XLSX.read(event.target.result, { type: 'binary', dateNF: 'mm/dd/yyyy;@', cellText: true });
            const sheets = wb.SheetNames;
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheets[0]], { raw: false });


            if (sheets.length) {
                const properties = ['codigoLista', 'exc_Inc', 'fechaDesde', 'nombre', 'rutMedico'];
                const dateVariables = ['fechaDesde'];
                let justJson = XL_row_object;

                justJson.forEach(row => {
                    if (row.rutMedico !== undefined) {
                        row.rutMedico = row.rutMedico.replace(/[^0-9kK]/g, '');
                    }
                    //if row.nombre has a comma remove it
                    if (row.nombre !== undefined) {
                        row.nombre = row.nombre.replace(/,/g, '');
                    }
                    console.log(row);

                    dateVariables.forEach(dateVariable => {
                        if (row[dateVariable] !== undefined) {
                            row[dateVariable] = formatDate(row[dateVariable]);
                        }
                    });
                });

                const out = jsonToCsv(justJson, properties);
                console.log(out)
                setState({ selectedFile: out });;
            }
        }
        reader.readAsArrayBuffer(file);
    };


    const formatDate = (date) => {
        console.log(date);
        if (!date) return null;

        if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(date)) {
            return null;
        }
        let dateArray = date.split(/[\/-]/);
        let year = dateArray[2];
        let month = dateArray[1];
        let day = dateArray[0];

        return year + "-" + month.padStart(2, '0') + "-" + day.padStart(2, '0');
    }

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
