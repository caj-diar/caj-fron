import { useQuery } from '@tanstack/react-query';

import { getClients } from '../services';



export const useClients = () => {

  const { isLoading, isFetching, isError, error, data: allClients } = useQuery( {
    queryKey: [ 'clients' ],
    queryFn: () => getClients()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    allClients
  };
};
