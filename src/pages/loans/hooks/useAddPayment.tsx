import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { presApi } from '../../../api';
import { IPayment } from '../interfaces';

interface IPayBody {
  amount: number;
  id: string;
  account: string;
}

export const useAddPay = () => {

  const queryClient = useQueryClient();

  const addPay = async ( data: IPayBody ): Promise<IPayment> => {
    try {
      const response = await presApi.post<IPayment>(
        `/payment-schedule/pay/${ data.id }`,
        {
          amount: Number( data.amount ),
          account: data.account
        }
      );
      return response.data;
    } catch ( error ) {
      console.error( 'Error detallado:', error );
      throw error;
    }
  };

  const { mutate, isError, error, isPending } = useMutation<IPayment, Error, IPayBody>( {
    mutationFn: addPay,
    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'loans-by-client' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'loans' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'totals' ],
      } );
    },
    onError: ( err ) => {
      console.error( 'Error adding payment:', err );
    },
  } );

  const addPayLoan = async ( newPay: IPayBody ): Promise<boolean> => {
    return new Promise( ( resolve ) => {
      mutate( newPay, {
        onSuccess: () => {
          toast.success( 'Pago registrado correctamente' );
          resolve( true );
        },
        onError: () => {
          toast.error( 'Error al registrar el pago. Por favor intente nuevamente.' );
          resolve( false );
        },
      } );
    } );
  };

  return {
    addPayLoan,
    isError,
    error,
    isPending,
  };
};