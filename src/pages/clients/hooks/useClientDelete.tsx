import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteClient as deleteClientService } from '../services';

export const useClientDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( clientId: string ) => deleteClientService( clientId ),

    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'clients' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'client' ],
      } );
    },

    onError: ( error ) => {
      toast.error( 'No se pudo eliminar el cliente. Por favor, intente nuevamente.' );
      console.error( 'Error deleting client:', error );
    },
  } );

  return {
    deleteClient: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};