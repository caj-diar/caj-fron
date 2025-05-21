import { useQuery } from '@tanstack/react-query';

import { getAccounts } from '../services';

export const useAccounts = () => {

  const { isLoading, isFetching, isError, error, data: allAccounts } = useQuery( {
    queryKey: [ 'accounts' ],
    queryFn: () => getAccounts()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    allAccounts
  };
};
