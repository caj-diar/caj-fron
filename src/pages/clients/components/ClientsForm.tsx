import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ClientInputs, clientSchema } from '../validators';
import { Icons, UI, useDisclosure } from '../../../shared';
import { useAddClient, useClientUpdate, useClientById } from '../hooks';
import { useLocalities } from '../../control-panel';

interface Props {
  id?: string;
}

export const ClientsForm = ( { id }: Props ) => {
  const { localities } = useLocalities();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addClient } = useAddClient();
  const { clientUpdate } = useClientUpdate();
  const { client } = useClientById( id );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClientInputs>( {
    resolver: zodResolver( clientSchema ),
    defaultValues: {
      addresses: [ '' ],
      description: '',
      documentation: [],
      phoneNumbers: [ '' ]
    }
  } );

  const phoneNumbers = watch( 'phoneNumbers' );
  const addresses = watch( 'addresses' );

  useEffect( () => {
    if ( client && id ) {
      reset( {
        addresses: client.addresses?.length > 0 ? client.addresses : [ '' ],
        description: client.description || '',
        dni: client.dni,
        documentation: client.documentation,
        lastName: client.lastName,
        localityId: client.locality.id,
        name: client.name,
        phoneNumbers: client.phoneNumbers.length > 0 ? client.phoneNumbers : [ '' ]
      } );
    }
  }, [ client, id, reset ] );

  const onSubmit = async ( data: ClientInputs ) => {
    if ( id ) {
      await clientUpdate( data, id );
    } else {
      await addClient( data );
      reset();
    }
    onClose();
  };

  const addPhoneNumber = () => {
    const currentPhoneNumbers = phoneNumbers || [];
    setValue( 'phoneNumbers', [ ...currentPhoneNumbers, '' ] );
  };

  const removePhoneNumber = ( index: number ) => {
    const currentPhoneNumbers = phoneNumbers || [];
    setValue(
      'phoneNumbers',
      currentPhoneNumbers.filter( ( _, i ) => i !== index )
    );
  };

  const addAddress = () => {
    const currentAddresses = addresses || [];
    setValue( 'addresses', [ ...currentAddresses, '' ] );
  };

  const removeAddress = ( index: number ) => {
    const currentAddresses = addresses || [];
    setValue(
      'addresses',
      currentAddresses.filter( ( _, i ) => i !== index )
    );
  };

  return (
    <div>
      { !id ? (
        <UI.Button
          startContent={ <Icons.IoAddOutline size={ 24 } /> }
          onPress={ onOpen }
          variant="light"
        >
          Nuevo Cliente
        </UI.Button>
      ) : (
        <UI.Button
          startContent={ <Icons.IoPencilOutline size={ 24 } /> }
          onPress={ onOpen }
          variant="light"
        >
          Editar
        </UI.Button>
      ) }

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        backdrop="blur"
        isDismissable={ false }
        motionProps={ {
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        } }
        scrollBehavior="inside"
        classNames={ {
          base: "bg-white dark:bg-gray-900",
          body: "bg-white dark:bg-gray-900"
        } }
      >
        <UI.ModalContent className="bg-white dark:bg-gray-900">
          { ( onClose ) => (
            <form onSubmit={ handleSubmit( onSubmit ) }>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-900 sticky top-0 z-50">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  <Icons.IoPeopleOutline size={ 24 } className="text-gray-500" />
                  <h2>{ id ? 'Editar cliente' : 'Nuevo cliente' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody className="bg-white dark:bg-gray-900">
                <UI.Input
                  label="Nombre"
                  placeholder="Ingrese el nombre del cliente"
                  variant="bordered"
                  errorMessage={ errors.name?.message }
                  isInvalid={ !!errors.name }
                  { ...register( 'name' ) }
                />

                <UI.Input
                  label="Apellido"
                  placeholder="Ingrese el apellido del cliente"
                  variant="bordered"
                  errorMessage={ errors.lastName?.message }
                  isInvalid={ !!errors.lastName }
                  { ...register( 'lastName' ) }
                />

                <UI.Input
                  label="DNI"
                  placeholder="Ingrese el DNI del cliente"
                  variant="bordered"
                  errorMessage={ errors.dni?.message }
                  isInvalid={ !!errors.dni }
                  { ...register( 'dni' ) }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una descripción del cliente"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />

                { phoneNumbers?.map( ( _, index ) => (
                  <div key={ index } className="mb-4">
                    <UI.Input
                      label={ `Teléfono ${ index + 1 }` }
                      placeholder="Ingrese el número de teléfono"
                      variant="bordered"
                      errorMessage={ errors.phoneNumbers?.[ index ]?.message }
                      isInvalid={ !!errors.phoneNumbers?.[ index ] }
                      { ...register( `phoneNumbers.${ index }` ) }
                    />
                    { index > 0 && (
                      <UI.Button
                        variant="light"
                        color="danger"
                        className="mt-2"
                        onPress={ () => removePhoneNumber( index ) }
                      >
                        Eliminar
                      </UI.Button>
                    ) }
                  </div>
                ) ) }

                <UI.Button
                  variant="light"
                  color="primary"
                  onPress={ addPhoneNumber }
                >
                  Agregar Teléfono
                </UI.Button>

                { addresses?.map( ( _, index ) => (
                  <div key={ index } className="mb-4">
                    <UI.Input
                      label={ `Dirección ${ index + 1 }` }
                      placeholder="Ingrese la dirección"
                      variant="bordered"
                      errorMessage={ errors.addresses?.[ index ]?.message }
                      isInvalid={ !!errors.addresses?.[ index ] }
                      { ...register( `addresses.${ index }` ) }
                    />
                    { index > 0 && (
                      <UI.Button
                        variant="light"
                        color="danger"
                        className="mt-2"
                        onPress={ () => removeAddress( index ) }
                      >
                        Eliminar
                      </UI.Button>
                    ) }
                  </div>
                ) ) }

                <UI.Button
                  variant="light"
                  color="primary"
                  onPress={ addAddress }
                >
                  Agregar Dirección
                </UI.Button>

                <UI.Select
                  label="Localidad"
                  placeholder="Seleccione la localidad del cliente"
                  variant="bordered"
                  errorMessage={ errors.localityId?.message }
                  isInvalid={ !!errors.localityId }
                  defaultSelectedKeys={ client?.locality.id ? [ client.locality.id ] : undefined }
                  { ...register( 'localityId' ) }
                >
                  { localities?.map( ( locality ) => (
                    <UI.SelectItem
                      key={ locality.id }
                      value={ locality.id }
                      textValue={ ` ${ locality.name }` }
                    >
                      { locality.name }
                    </UI.SelectItem>
                  ) ) || [] }
                </UI.Select>

              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2 bg-white dark:bg-gray-900 sticky bottom-0 z-50">
                <UI.Button
                  color="danger"
                  variant="light"
                  onPress={ onClose }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  type="submit"
                  startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                >
                  Guardar
                </UI.Button>
              </UI.ModalFooter>
            </form>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};
