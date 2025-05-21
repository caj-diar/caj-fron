import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ILoan } from '../interfaces';
import { LoanInputs } from '../validators';
import { updateLoan } from '../services';



export const useLoanUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<ILoan, Error, { loan: LoanInputs; id: string; }>( {

    mutationFn: ( { loan, id } ) => updateLoan( loan, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'loan' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'loans' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );

      toast.success( `Préstamo actualizado correctamente:  $${ data.amount }. ${ data.customer.lastName }, ${ data.customer.name }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar el préstamo. Por favor, intente nuevamente.' );
      console.error( 'Error updating loan:', error );
    }

  } );

  const loanUpdate = async ( loan: LoanInputs, id: string ): Promise<ILoan> => {
    const result = await mutation.mutateAsync( { loan, id } );
    return result;
  };

  return {
    loanUpdate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
};