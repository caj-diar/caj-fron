import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { createLoan } from '../services';
import { ILoan } from '../interfaces';
import { LoanInputs } from '../validators';
import { useRedirect } from '../../../shared';

export const useAddLoan = () => {
  const queryClient = useQueryClient();
  const { redirectTo } = useRedirect();

  const { mutate, isError, error, isPending } = useMutation<ILoan, Error, LoanInputs>( {
    mutationFn: createLoan,

    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'loan' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'loans' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );
      redirectTo( '/prestamos' );
    },

    onError: ( err ) => {
      console.error( 'Error adding loan:', err );
    },
  } );

  const addLoan = async ( newLoan: LoanInputs ): Promise<boolean> => {
    return new Promise( ( resolve ) => {
      mutate( newLoan, {
        onSuccess: ( data ) => {
          toast.success( `Préstamo otorgado correctamente: $${ data.amount }. ${ data.customer.lastName }, ${ data.customer.name }` );
          resolve( true );
        },
        onError: () => {
          toast.error( 'No se pudo crear el préstamo. Por favor, intente nuevamente.' );
          resolve( false );
        },
      } );
    } );
  };

  return {
    addLoan,
    isError,
    error,
    isPending
  };
};
