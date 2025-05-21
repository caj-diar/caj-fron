import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteLoan as deleteLoanService } from '../services';

export const useLoanDelete = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( loanId: string ) => deleteLoanService( loanId ),

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'loans' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'loan' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );
    },

    onError: ( error ) => {
      toast.error( 'No se pudo eliminar el préstamo. Por favor, intente nuevamente.' );
      console.error( 'Error deleting loan:', error );
    },
    
  } );

  return {
    deleteLoan: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};