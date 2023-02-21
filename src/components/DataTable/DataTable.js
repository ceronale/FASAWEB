import React from "react";
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import * as XLSX from 'xlsx/xlsx.mjs';
import Button from '@mui/material/Button';


const DataTable = props => {

    const downloadExcel = (rows) => {
        const newData = rows.map(row => {
            return getRows(row);
        })
        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "ReporteAuditoria")
        //Buffer
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "ReporteAuditoria.xlsx")
    }

    const getRows = (row) => {
        delete row.tableData;
        Object.entries(row.original).forEach(([key, value]) => {
            if (value === undefined) {
                row.original[key] = " ";
            }
        });
        console.log(row.original)
        return row.original;
    };
    return (
        <>
            <MaterialReactTable
                columns={props.columns}
                data={props.data}
                localization={MRT_Localization_ES}
                renderBottomToolbarCustomActions={({ table }) => (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>

                        {props.export &&
                            <   Button
                                variant="contained"
                                onClick={() => { downloadExcel(table.getPrePaginationRowModel().rows) }}
                                disabled={props.isButtonDisabled}
                            >
                                Exportar
                            </Button>
                        }
                    </div>
                )}
            />

        </>
    );
};
export default DataTable;
