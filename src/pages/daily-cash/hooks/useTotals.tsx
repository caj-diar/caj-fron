import { useQuery } from '@tanstack/react-query';

import { getTotalsCash } from '../services';




export const useTotals = () => {

  const { isLoading, isFetching, isError, error, data: totals } = useQuery( {
    queryKey: [ 'totals' ],
    queryFn: () => getTotalsCash()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    totals
  };
};
