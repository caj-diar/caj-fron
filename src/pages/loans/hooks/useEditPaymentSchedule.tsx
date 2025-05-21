import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { editPaymentSchedule } from '../services';
import { IPaymentScheduleEditBody, IPaymentScheduleEditResponse } from '../interfaces/ILoan';



export const useEditPaymentSchedule = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IPaymentScheduleEditResponse, Error, { paymentScheduleEdit: IPaymentScheduleEditBody; id: string; }>( {

    mutationFn: ( { paymentScheduleEdit, id } ) => editPaymentSchedule( paymentScheduleEdit, id ),

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

      queryClient.invalidateQueries( {
        queryKey: [ 'loans-by-client' ],
      } );

      toast.success( `Cuota actualizada correctamente:  $${ data.paymentAmount } - ${ data.paymentDate }.` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar la cuota. Por favor, intente nuevamente.' );
      console.error( 'Error updating payment schedule:', error );
    }

  } );

  const paymentSchedule = async ( paymentScheduleEdit: IPaymentScheduleEditBody, id: string ): Promise<IPaymentScheduleEditResponse> => {
    const result = await mutation.mutateAsync( { paymentScheduleEdit, id } );
    return result;
  };

  return {
    paymentSchedule,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error
  };
};