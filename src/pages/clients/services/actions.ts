import { IAccount, IClient } from '../interfaces';
import { presApi, apiCall } from '../../../api';
import { ClientInputs } from '../validators';

const CUSTOMER_ENDPOINT = '/customer';
const ACCOUNTS_ENDPOINT = '/accounts';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => presApi[ method ]<T>( endpoint, data ) );

export const getClients = (): Promise<IClient[]> =>
  makeApiCall( 'get', CUSTOMER_ENDPOINT );

export const getAccounts = (): Promise<IAccount[]> =>
  makeApiCall( 'get', ACCOUNTS_ENDPOINT );

export const getClientByid = ( id: string ): Promise<IClient> => {
  if ( !id ) return Promise.reject( new Error( 'Client ID is required' ) );
  return makeApiCall( 'get', `${ CUSTOMER_ENDPOINT }/${ id }` );
};

export const createClient = ( newClient: ClientInputs ): Promise<IClient> =>
  makeApiCall( 'post', CUSTOMER_ENDPOINT, newClient );

export const updateClient = ( clientUpdate: ClientInputs, id: string ): Promise<IClient> =>
  makeApiCall( 'patch', `${ CUSTOMER_ENDPOINT }/${ id }`, clientUpdate );

export const deleteClient = ( id: string ): Promise<any> =>
  makeApiCall( 'delete', `${ CUSTOMER_ENDPOINT }/${ id }` );
