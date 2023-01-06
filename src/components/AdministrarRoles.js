
import React, { useState } from "react";
import DataTableRoles from "./DataTable/DataTableRoles";
import DataTableUsuarioRoles from "./DataTable/DataTableUsuarioRoles";
import { ContenedorTitulo, Titulo } from "./Formularios";



const AdministrarRoles = (user) => {
    const data = [
        {
            rol: 'Administrador',
            descripcion: 'Administrador',
        },
        {
            rol: 'Paciente',
            descripcion: 'Paciente',
        },
        {
            rol: 'Paciente Empresa',
            descripcion: 'Paciente Empresa',
        },

    ];
    const columns = [
        {
            accessorKey: 'rol', //access nested data with dot notation
            header: 'Rol',
            maxSize: 5
        },
        {
            accessorKey: 'descripcion',
            header: 'Descripcion',
        },
    ];


    return (
        <main >
            <ContenedorTitulo>
                <Titulo>Administrar Roles</Titulo>
            </ContenedorTitulo>
            <div id="notaLogin">
                En esta seccion podras editar, crear y elimnar roles.
            </div>
            <DataTableRoles columns={columns} data={data} />

        </main >
    );
}

export default AdministrarRoles;