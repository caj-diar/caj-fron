import { presApi, apiCall } from '../../../api';
import { ICollectionRouteResponse, ILoan, ILoansByClient, IPayment } from '../interfaces';
import { IPaymentScheduleEditBody, IPaymentScheduleEditResponse } from '../interfaces/ILoan';
import { LoanInputs } from '../validators';

const LOAN_ENDPOINT = '/loan';
const PAYMENT_SCHEDULE_ENDPOINT = '/payment-schedule';



const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => presApi[ method ]<T>( endpoint, data ) );

export const addPay = ( { amount, id }: { amount: number, id: string; } ): Promise<IPayment> =>
  makeApiCall( 'post', `${ PAYMENT_SCHEDULE_ENDPOINT }/pay/${ id }`, { amount } );

export const createLoan = ( newLoan: LoanInputs ): Promise<ILoan> =>
  makeApiCall( 'post', LOAN_ENDPOINT, newLoan );

export const refinanceLoan = ( newLoan: LoanInputs, id: string ): Promise<ILoan> => {
  const {
    customerId,
    amount,
    interest,
    installments,
    installmentAmount,
    paymentFrequency,
    dueDays,
    startDate,
    status,
    account
  } = newLoan;

  const refinancePayload = {
    customerId,
    amount: Number( amount ),
    interest: Number( interest ),
    installments: Number( installments ),
    installmentAmount: Math.round( Number( installmentAmount ) ),
    paymentFrequency,
    dueDays,
    startDate,
    status: status || "ACTIVO",
    account
  };

  // console.log( `Enviando payload para refinanciar préstamo ${ id }:`, refinancePayload );

  return makeApiCall( 'post', `${ LOAN_ENDPOINT }/refinance/${ id }`, refinancePayload );
};

export const cancelLoan = ( id: string ): Promise<any> =>
  makeApiCall( 'post', `${ LOAN_ENDPOINT }/close-manual/${ id }` );

export const deleteLoan = ( id: string ): Promise<any> =>
  makeApiCall( 'delete', `${ LOAN_ENDPOINT }/${ id }` );

export const getLoanById = ( id: string ): Promise<ILoan> => {
  if ( !id ) return Promise.reject( new Error( 'Loan ID is required' ) );
  return makeApiCall( 'get', `${ LOAN_ENDPOINT }/${ id }` );
};

export const getLoansByClientId = ( id: string ): Promise<ILoansByClient> => {
  if ( !id ) return Promise.reject( new Error( 'Customer ID is required' ) );
  return makeApiCall( 'get', `${ LOAN_ENDPOINT }/customer/${ id }` );
};

export const getLoans = (): Promise<ILoan[]> =>
  makeApiCall( 'get', LOAN_ENDPOINT );

export const updateLoan = ( loanUpdate: LoanInputs, id: string ): Promise<ILoan> =>
  makeApiCall( 'patch', `${ LOAN_ENDPOINT }/${ id }`, loanUpdate );

export const getCollectionRoute = ( date: string ): Promise<ICollectionRouteResponse> =>
  makeApiCall( 'post', `${ PAYMENT_SCHEDULE_ENDPOINT }/collection-route`, { date } );

export const editPaymentSchedule = ( paymentScheduleEdit: IPaymentScheduleEditBody, id: string ): Promise<IPaymentScheduleEditResponse> =>
  makeApiCall( 'patch', `${ PAYMENT_SCHEDULE_ENDPOINT }/edit/${ id }`, paymentScheduleEdit );
