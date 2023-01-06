import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { ContenedorTitulo, Titulo } from './Formularios';
import "../styles/CartolaVentas.css";

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

const CartolaVentas = props => {

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
            header: 'Fecha',
          },
          {
            accessorKey: 'city',
            header: 'Ventas',
          }
        ],
        [],
    );

    return (
        <>
            <div className="boxTabla">
                <ContenedorTitulo>
					<Titulo>Visualización Cartolas de Ventas</Titulo>
				</ContenedorTitulo>
                <div id="notaLogin">
                    En esta sección se mostraran las ventas realizadas.
                </div>
                <MaterialReactTable columns={columns} data={data} />
            </div>
        </>
    );
};
export default CartolaVentas;