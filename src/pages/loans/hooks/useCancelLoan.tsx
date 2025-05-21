import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { cancelLoan } from '../services';

export const useCancelLoan = ( id: string ) => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => cancelLoan( id ),

    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'loan' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'loans' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'loans-by-client' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );

      toast.success( 'Préstamo cancelado exitosamente' );
    },

    onError: ( error: Error ) => {
      console.error( 'Error al cancelar el préstamo:', error );
      toast.error( 'Error al cancelar el préstamo' );
    }
  } );

  const handleCancelLoan = () => {
    mutation.mutate();
  };

  return {
    cancelLoan: handleCancelLoan,
    isError: mutation.isError,
    error: mutation.error,
    isPending: mutation.isPending
  };
};