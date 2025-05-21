import { useQuery } from '@tanstack/react-query';

import { getDaysCash } from '../services';




export const useDaysCash = () => {

  const { isLoading, isFetching, isError, error, data: allDaysCash } = useQuery( {
    queryKey: [ 'days-cash' ],
    queryFn: () => getDaysCash()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    allDaysCash
  };
};
