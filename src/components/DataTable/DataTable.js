import React from "react";
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';


const DataTable = props => {
    return (
        <>
            <MaterialReactTable
                columns={props.columns}
                data={props.data}
                localization={MRT_Localization_ES}
            />

        </>
    );
};
export default DataTable;
