import React, { useState, useEffect, useCallback } from "react";
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import ModalConfirmar from "../Modals/ModalConfirmar";
import ModalAlert from "../Modals/ModalAlert";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import "../../styles/PolizasGrupos.css";
import { PolizaServiceUpdate } from "../../api/PolizaService";
import ModalUploadFile from "../Modals/ModalUploadFile";
import * as XLSX from 'xlsx/xlsx.mjs';


const DataTablePoliza = props => {
  //Modal Variables
  const [title, setTitle] = useState();
  const [msj, setMsj] = useState();
  //Modal Alert
  const [titleAlert, setTitleAlert] = useState();
  const [msjAlert, setMsjAlert] = useState();
  const [showModalAlert, setShowModalAlert] = useState(false);
  //Modal Upload File
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  //Validaciones de campos editar
  const [validationErrors, setValidationErrors] = useState({});
  const [hasValidationError, setHasValidationError] = useState(false);

  //Edit table variables
  const [values, setValues] = useState();
  const [row, setRow] = useState();

  const handleCloseConfirmar = () => {
    setShowModalConfirmar(false);
  }

  const handleCloseUpload = () => {
    props.updateData();
    setShowModalUpload(false);
  }

  const handleCloseAlert = () => {
    setShowModalAlert(false);
  }
  //Confirma la accion del modal y ejecuta update de la informacion de la tabla 
  const handleConfirmar = async () => {

    if ((values.grupoAhumada === "" || values.grupoAhumada === null) ||
      (values.nombrePoliza === "" || values.nombrePoliza === null) ||
      (values.codigoPoliza === "" || values.codigoPoliza === null) ||
      (values.rutEmpresa === "" || values.rutEmpresa === null) ||
      (values.terminoBeneficio === "" || values.terminoBeneficio === null) ||
      (values.polizaAceptaBioequivalente === "" || values.polizaAceptaBioequivalente === null)) {
      setTitleAlert("Error")
      setMsjAlert("Todos los campos deben contener datos")
      setShowModalAlert(true);
      setShowModalConfirmar(false);

    } else {
      const resp = await PolizaServiceUpdate(
        values.grupoAhumada,
        values.nombrePoliza,
        values.codigoPoliza,
        values.rutEmpresa,
        values.terminoBeneficio,
        values.polizaAceptaBioequivalente,
        props.user.correo
      )
      setShowModalConfirmar(false);

      if (resp.response1[0].codigoRespuesta === 0) {
        setTitleAlert("Exito")
        setMsjAlert(resp.response1[0].detalleRespuest)
        tableData[row.index] = values;
        setTableData([...tableData]);
        setShowModalAlert(true);
      } else {
        setTitleAlert("Error")
        setMsjAlert("Ha ocurrido un error en la actualizacion de los datos")
        setShowModalAlert(true);
      };

    }


  }

  const validateRequired = (value) => !!value.length;
  const validateEmail = (email) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );

  //Validacion de fecha dd-mm-yyyy
  const validateDate = (date) => {
    var dateRegex = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
    if (dateRegex.test(date)) {
      var parts = date.split("-");
      var day = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var year = parseInt(parts[2], 10);
      if (year < 1000 || year > 3000 || month === 0 || month > 12) {
        return false;
      }
      var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29;
      }
      return day > 0 && day <= monthLength[month - 1];
    } else {
      return false;
    }
  }

  //validar bioequivalente 0 o 1
  const validateBioequivalente = (bioequivalente) => {
    if (bioequivalente === "0" || bioequivalente === "1") {
      return true;
    } else {
      return false;
    }
  }

  //validate that rut has at least 8 digits

  const validateRut = (rut) => {
    if (rut.length >= 8) {
      return true;
    } else {
      return false;
    }
  }

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'terminoBeneficio'
                ? validateDate(event.target.value)
                : cell.column.id === 'rutEmpresa'
                  ? validateRut(event.target.value)
                  : cell.column.id === 'polizaAceptaBioequivalente'
                    ? validateBioequivalente(event.target.value)
                    : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid depending on column if bioequivalente must say 0 or 1

            setValidationErrors({
              ...validationErrors,
              [cell.id]: cell.column.id === 'terminoBeneficio' ? `${cell.column.columnDef.header} debe ser dd-mm-yyyy` :
                cell.column.id === 'polizaAceptaBioequivalente' ? `${cell.column.columnDef.header} debe ser 0 o 1` :
                  cell.column.id === 'rutEmpresa' ? `${cell.column.columnDef.header} el rut debe contener al menos 8 caracteres` :
                    `${cell.column.columnDef.header} es requerido`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = [
    {
      accessorKey: 'codigoPoliza',
      header: 'Poliza',
      size: 20,

      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        inputProps: { maxLength: 20 },
      }),
    },
    {
      accessorKey: 'estadoPolizaAhumada',
      header: 'Estado',
      enableEditing: false,
      size: 100,

      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'grupoAhumada',
      header: 'Grupo*',
      enableEditing: false,
      size: 100,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
    },
    {
      accessorKey: 'nombrePoliza',
      header: 'Nombre',
      size: 200,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        inputProps: { maxLength: 50 },
      }),
    },
    {
      accessorKey: 'polizaAceptaBioequivalente',
      header: 'Bioequivalente (0 o 1)',
      size: 10,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        inputProps: { maxLength: 1, pattern: '[0-1]' },
      }),

    },
    {
      accessorKey: 'rutEmpresa',
      header: 'RUT',
      size: 120,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        inputProps: { maxLength: 9, pattern: '[0-9kK]*' },
      }),
    },
    {
      accessorKey: 'terminoBeneficio',
      header: 'Fecha Termino Beneficio',
      size: 120,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        inputProps: { maxLength: 10 },
      }),

    },
    {
      accessorKey: 'cuentaLiquidador',
      header: 'Cuenta Liquidador*',
      enableEditing: false,
      size: 120,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
    },
  ];
  //Se crea la vairable con informacion de la data table
  const [tableData, setTableData] = useState(() => props.data)

  //Ingresar la informacion a la variable table apenas se incia el modulo
  useEffect(() => {
    setTableData(props.data);
  }, [])

  //Metodo para handle la edicion de informacion de la table
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    setValues(values);
    setRow(row);
    if (!Object.keys(validationErrors).length) {
      setTitle("¿Desea continuar?")
      setMsj("Seleccione confirmar si desea editar el campo")
      setShowModalConfirmar(true)
      exitEditingMode();
    }

  };

  //Metodo para handle la cancelacion de la edicion de informacion de la table
  const handleCancelRowEdits = () => {

  };

  const downloadExcel = (rows) => {
    const newData = rows.map(row => {
      return getRows(row);
    })
    const workSheet = XLSX.utils.json_to_sheet(newData)
    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, workSheet, "polizas")
    //Buffer
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
    //Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
    //Download
    XLSX.writeFile(workBook, "Polizas.xlsx")
  }


  const getRows = (row) => {
    delete row.tableData
    if (row.original.codigoPoliza === undefined) {
      row.original.codigoPoliza = " ";
    }
    if (row.original.estadoPolizaAhumada === undefined) {
      row.original.estadoPolizaAhumada = " ";

    }
    if (row.original.grupoAhumada === undefined) {
      row.original.grupoAhumada = " ";

    }
    if (row.original.nombrePoliza === undefined) {
      row.original.nombrePoliza = " ";

    }
    if (row.original.polizaAceptaBioequivalente === undefined) {
      row.original.polizaAceptaBioequivalente = " ";

    }
    if (row.original.rutEmpresa === undefined) {
      row.original.rutEmpresa = " ";

    }
    if (row.original.terminoBeneficio === undefined) {
      row.original.terminoBeneficio = " ";

    }
    if (row.original.cuentaLiquidador === undefined) {
      row.original.cuentaLiquidador = " ";
    }
    console.log(row.original);
    return row.original;
  };


  return (
    <>
      <div className="boxTable">
        <MaterialReactTable
          columns={columns}
          data={tableData}
          positionToolbarAlertBanner="bottom"
          editingMode="modal"
          enableEditing
          onEditingRowCancel={handleCancelRowEdits}
          onEditingRowSave={handleSaveRowEdits}
          localization={MRT_Localization_ES}
          renderBottomToolbarCustomActions={({ table }) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>

              <Button
                variant="contained"
                onClick={() => { downloadExcel(table.getPrePaginationRowModel().rows) }}
                disabled={props.isButtonDisabled}
              >
                Exportar
              </Button>
              <Button
                variant="contained"
                onClick={() => { setShowModalUpload(true) }}
                disabled={props.isButtonDisabled}
              >
                Importar
              </Button>
            </div>

          )}
        />
      </div>
      <ModalConfirmar
        title={title}
        msj={msj}
        show={showModalConfirmar}
        handleClose={handleCloseConfirmar}
        handleYes={handleConfirmar}
      />
      <ModalAlert title={titleAlert} show={showModalAlert} handleClose={handleCloseAlert} msj={msjAlert} />

      <ModalUploadFile
        title={"Cargar datos masivos"}
        msj={"Cargue el archivo .csv con el cual desea actualizar los registros"}
        show={showModalUpload}
        handleClose={handleCloseUpload}
        convenio={props.convenio}
      />

    </>
  );
};
export default DataTablePoliza;
