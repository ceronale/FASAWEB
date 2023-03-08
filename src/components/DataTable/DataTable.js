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
        XLSX.utils.book_append_sheet(workBook, workSheet, props.nombreArchivo)
        //Buffer
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, props.nombreArchivo + ".xlsx")
    }

    const getRows = (row) => {
        delete row.tableData;
        Object.entries(row.original).forEach(([key, value]) => {
            if (value === undefined) {
                row.original[key] = " ";
            }
        });
        //if props.nombreArchivo is "CartolaBeneficiarios" then reorder the columns
        if (props.nombreArchivo === "CartolaBeneficiario") {
            const reorderedRow = {
                estado: row.original.estado,
                fecha: row.original.fecha,
                farmacia: row.original.farmacia,
                id_receta: row.original.id_receta,
                direccion: row.original.direccion,
                comuna: row.original.comuna,
                boleta: row.original.boleta,
                guia: row.original.guia,
                SAP: row.original.SAP,
                decripcion_producto: row.original.decripcion_producto,
                cantidad: row.original.cantidad,
                precio: row.original.precio,
                descto: row.original.descto,
                bonificado: row.original.bonificado,
                copago: row.original.copago,
                total: row.original.total,

            }
            return reorderedRow;
        }
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
