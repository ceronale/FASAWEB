import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { ContenedorTitulo, Titulo } from './Formularios';
import "../styles/CartolaVentas.css";
import Button from 'react-bootstrap/Button';

const data = [

    {
      name: {
        firstName: '',
        lastName: '',
      },
      address: '  ',
      city: ' ',
      state: '',
    },
  
    {
      name: {
        firstName: '',
        lastName: '',
      },
      address: ' ',
      city: '',
      state: '',
    },
  
    {
      name: {
        firstName: '',
        lastName: '',
      },
      address: '  ',
      city: ' ',
      state: ' ',
    },
  
    {
      name: {
        firstName: '',
        lastName: '',
      },
      address: '',
      city: '',
      state: '',
    },
  
    {
      name: {
        firstName: '',
        lastName: '',
      },
      address: '',
      city: '',
      state: '',
    },
  
  ];

const ListarBeneficiarios = props => {

    const columns = useMemo(

        () => [
          {
            accessorKey: 'name.firstName',
            header: 'Convenio',
          },
          {
            accessorKey: 'name.lastName',
            header: 'Rut',
          },
          {
            accessorKey: 'address', //normal accessorKey
            header: 'Nombre',
          },
          {
            accessorKey: 'city',
            header: 'Apellido',
          },
          {
            accessorKey: 'city',
            header: 'Direccion',
          },
        ],
        [],
    );

    return (
        <>
            <div className="boxTabla">
                <ContenedorTitulo>
					<Titulo>Visualización de Beneficiarios</Titulo>
				</ContenedorTitulo>
                <div id="notaLogin">
                    En esta sección se mostraran los beneficiarios pertenecientes a un convenio.
                </div>
                <MaterialReactTable columns={columns} data={data} 
                    renderBottomToolbarCustomActions={({ table }) => (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                               //onClick={() => { setShowModalUpload(true) }}
                            >
                                Cargar
                            </Button>
                        </div>
            
                      )}                
                />
            </div>
        </>
    );
};
export default ListarBeneficiarios;