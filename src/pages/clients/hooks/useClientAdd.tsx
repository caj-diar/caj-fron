import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IClient } from '../interfaces';
import { ClientInputs } from '../validators';
import { createClient } from '../services';



export const useAddClient = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<IClient, Error, ClientInputs>( {

    mutationFn: createClient,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'client' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'clients' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error adding client:', err );
    },

  } );

  const addClient = ( newClient: ClientInputs ) => {
    mutate( newClient, {
      onSuccess: ( data ) => {
        toast.success( `Cliente creado correctamente: ${ data.lastName }, ${ data.name }` );
      },
      onError: () => {
        toast.error( 'No se pudo crear el cliente. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addClient,
    isError,
    error,
  };
};
