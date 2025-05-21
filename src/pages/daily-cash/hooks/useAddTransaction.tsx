import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { addTransaction } from '../services';
import { ITransaction } from '../interfaces';
import { TransactionInputs } from '../validators';

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<ITransaction, Error, TransactionInputs>( {
    mutationFn: addTransaction,
    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'days-cash' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );
      
    },
    onError: ( err ) => {
      console.error( 'Error adding transaction:', err );
    },
  } );

  const createTransaction = ( newTransaction: TransactionInputs ) => {
    mutate( newTransaction, {
      onSuccess: ( data ) => {
        toast.success( `Transacción creada correctamente por $${ data.amount }` );
      },
      onError: () => {
        toast.error( 'No se pudo crear la transacción. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    createTransaction,
    isError,
    error,
  };
};