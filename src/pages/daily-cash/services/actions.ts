import { IDayCash, ITotals, ITransaction, ITransactionCode } from '../interfaces';
import { presApi, apiCall } from '../../../api';
import { TransactionInputs } from '../validators';


const DAYLY_CASH_ENDPOINT = '/daily-cash';
const TRANSACTION_CODE_ENDPOINT = '/transaction-codes';
const TRANSACTION_ENDPOINT = '/transactions';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => presApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', DAYLY_CASH_ENDPOINT );

export const getDaysCash = (): Promise<IDayCash[]> =>
  makeApiCall( 'get', DAYLY_CASH_ENDPOINT );

export const getTotalsCash = (): Promise<ITotals> =>
  makeApiCall( 'get', `${ DAYLY_CASH_ENDPOINT }/totals` );

export const getTransactionsCodes = (): Promise<ITransactionCode[]> =>
  makeApiCall( 'get', TRANSACTION_CODE_ENDPOINT );

export const getDayCashById = ( id: string ): Promise<IDayCash> => {
  if ( !id ) return Promise.reject( new Error( 'Daycash ID is required' ) );
  return makeApiCall( 'get', `${ DAYLY_CASH_ENDPOINT }/${ id }` );
};

export const addTransaction = ( newTransaction: TransactionInputs ): Promise<ITransaction> =>
  makeApiCall( 'post', TRANSACTION_ENDPOINT, newTransaction );
