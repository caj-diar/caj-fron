import { BackButton, CustomTable, Icons, StatusColorMap, toTitleCase, UI, useRedirect, useWhatsApp } from '../../../shared';
import { ClientsForm } from '../components';
import { useClients } from '../hooks';
import { LoanForm } from '../../loans';

export const ClientsPage = () => {

  const { allClients, isLoading } = useClients();
  const { generateWhatsAppLink } = useWhatsApp();
  const { redirectTo } = useRedirect();
  // const { deleteClient } = useClientDelete();

  // const handleDelete = ( clientId: string ) => {
  //   return () => deleteClient( clientId );
  // };

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( isLoading ) {
    return (
      <div className="flex items-center justify-center mt-11">
        <UI.Spinner />
      </div>
    );
  }

  if ( !allClients ) return null;

  const columns = [
    { name: "Número de cliente", uid: "number", sortable: true },
    { name: "Nombres", uid: "name", sortable: true },
    { name: "Apellidos", uid: "lastName", sortable: true },
    { name: "Teléfonos", uid: "phoneNumbers", sortable: true },
    { name: "D.N.I.", uid: "dni", sortable: true },
    { name: "Domicilios", uid: "addresses", sortable: true },
    { name: "Localidad", uid: "locality", sortable: true },
    // { name: "Zona", uid: "zone", sortable: true },
    { name: "Acciones", uid: "actions", sortable: false }
  ];

  const transformedClients = allClients.map( client => ( {
    number: client.number,
    name: toTitleCase( client.name ),
    lastName: toTitleCase( client.lastName ),
    phoneNumbers: (
      <div className="flex flex-col gap-1">
        { client.phoneNumbers.map( ( phone: string, index: number ) => (
          <div key={ index }>
            { generateWhatsAppLink( phone ) }
          </div>
        ) ) }
      </div>
    ),
    dni: client.dni,
    addresses: (
      <div className="flex flex-col gap-1">
        { client.addresses.map( ( address: string, index: number ) => (
          <div key={ index }>
            { toTitleCase( address ) }
          </div>
        ) ) }
      </div>
    ),
    locality: toTitleCase( client.locality.name ),
    zone: client.zone,
    actions: (
      <div className="flex items-center gap-4">
        {/* 
        <ConfirmDelete
          id={ client.id }
          title="Eliminar Cliente"
          description={ `¿Está seguro que desea eliminar al cliente ${ client.lastName }, ${ client.name }?` }
          successMessage="Cliente eliminado correctamente"
          errorMessage="No se pudo eliminar el cliente"
          onDelete={ handleDelete( client.id ) }
        /> */}

        <LoanForm customerId={ client.id } />

        <UI.Button
          variant="bordered"
          color="primary"
          startContent={ <Icons.IoIdCardOutline size={ 24 } /> }
          onPress={ () => redirectTo( `/cliente/${ client.id }` ) }
        >
          Ver ficha del cliente
        </UI.Button>
      </div>
    ),
  } ) );

  return (
    <UI.Card className="mt-6 p-2">
      <UI.CardHeader>
        <div className="absolute left-0 ml-2">
          <BackButton url='/home' />
        </div>

        <div className="flex items-center justify-center space-x-2 w-full">
          <Icons.IoPeopleOutline size={ 24 } />
          <h1 className="text-2xl font-bold">Clientes</h1>
        </div>
      </UI.CardHeader>
      <UI.CardBody>
        <div className="mt-4 p-8">
          <CustomTable
            data={ transformedClients }
            columns={ columns }
            statusColorMap={ statusColorMap }
            title="Clientes"
            initialVisibleColumns={ [ "number", "name", "lastName", "phoneNumbers", "dni", "addresses", "locality", "zone", "actions" ] }
            addButtonComponent={ <ClientsForm /> }
            defaultSortDescriptor={ {
              column: "number",
              direction: "descending"
            } }
          />
        </div>
      </UI.CardBody>
    </UI.Card>
  );
};