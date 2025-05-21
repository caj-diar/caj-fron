import { apiCall, presApi } from '../../../../api';
import { ILocality } from '../interfaces';




const LOCALITY_ENDPOINT = '/locality';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => presApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', LOCALITY_ENDPOINT );

export const getLocalities = (): Promise<ILocality[]> =>
  makeApiCall( 'get', LOCALITY_ENDPOINT );
