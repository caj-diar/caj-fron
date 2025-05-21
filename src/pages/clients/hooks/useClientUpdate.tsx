import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IClient } from '../interfaces';
import { ClientInputs } from '../validators';
import { updateClient } from '../services';


export const useClientUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IClient, Error, { client: ClientInputs; id: string; }>( {

    mutationFn: ( { client, id } ) => updateClient( client, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'client' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'clients' ]
      } );

      toast.success( `Cliente actualizado correctamente:  ${ data.lastName }, ${ data.name }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar el cliente. Por favor, intente nuevamente.' );
      console.error( 'Error updating client:', error );
    }

  } );

  const clientUpdate = async ( client: ClientInputs, id: string ): Promise<IClient> => {
    const result = await mutation.mutateAsync( { client, id } );
    return result;
  };

  return {
    clientUpdate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
};