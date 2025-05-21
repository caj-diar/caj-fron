import { useQuery } from '@tanstack/react-query';

import { getClientByid } from '../services';



export const useClientById = ( clientId?: string ) => {

  const { isLoading, isFetching, isError, error, data: client } = useQuery( {
    queryKey: [ 'client', clientId ],
    queryFn: () => getClientByid( clientId! ),
    enabled: !!clientId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    client,
  };
};
