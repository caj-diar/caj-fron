import { useQuery } from '@tanstack/react-query';

import { getLoans } from '../services';

export const useLoans = () => {

  const { isLoading, isFetching, isError, error, data: allLoans } = useQuery( {
    queryKey: [ 'loans' ],
    queryFn: () => getLoans(),
    refetchInterval: 5000,
    refetchIntervalInBackground: true
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    allLoans
  };
};