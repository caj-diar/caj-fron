import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { refinanceLoan } from '../services';
import { ILoan } from '../interfaces';
import { LoanInputs } from '../validators';
import { useRedirect } from '../../../shared';


const prepareRefinanceData = ( data: LoanInputs ): LoanInputs => {
  return {
    ...data,
    amount: Number( data.amount ),
    installments: Number( data.installments ),
    interest: Number( data.interest ),
    installmentAmount: Math.round( Number( data.installmentAmount ) ),
    status: data.status || "ACTIVO"
  };
};

export const useRefinanceAddLoan = ( id: string ) => {
  const queryClient = useQueryClient();
  const { redirectTo } = useRedirect();

  const { mutate, isError, error, isPending } = useMutation<ILoan, Error, LoanInputs>( {
    mutationFn: async ( newLoan: LoanInputs ) => {

      const normalizedData = prepareRefinanceData( newLoan );

      // console.log( 'Refinanciando préstamo:', {
      //   loanId: id,
      //   payload: normalizedData
      // } );

      try {
        return await refinanceLoan( normalizedData, id );
      } catch ( error: any ) {
        console.error( 'Error detallado en refinanceLoan:', {
          status: error?.response?.status,
          data: error?.response?.data,
          error: error.message
        } );
        throw error;
      }
    },
    onSuccess: ( data ) => {
      console.log( 'Refinanciamiento exitoso, datos recibidos:', data );
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
      console.error( 'Error refinanciando préstamo:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      } );
    },
  } );

  const addLoan = async ( newLoan: LoanInputs ): Promise<boolean> => {
    return new Promise( ( resolve ) => {
      try {
        mutate( newLoan, {
          onSuccess: ( data ) => {
            toast.success(
              `Préstamo refinanciado correctamente: $${ data.amount }. ${ data.customer.lastName }, ${ data.customer.name }`
            );
            resolve( true );
          },
          onError: ( error ) => {
            console.error( 'Error específico en addLoan:', error );
            toast.error( 'No se pudo refinanciar el préstamo. Por favor, intente nuevamente.' );
            resolve( false );
          },
        } );
      } catch ( e ) {
        console.error( 'Excepción inesperada en addLoan:', e );
        toast.error( 'Error inesperado al procesar la solicitud.' );
        resolve( false );
      }
    } );
  };

  return {
    addLoan,
    isError,
    error,
    isPending,
  };
};