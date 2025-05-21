import { useQuery } from '@tanstack/react-query';

import { getDayCashById } from '../services';


export const useDayCash = ( dayCashId?: string ) => {

  const { isLoading, isFetching, isError, error, data: dayCash } = useQuery( {
    queryKey: [ 'day-cash', dayCashId ],
    queryFn: () => getDayCashById( dayCashId! ),
    enabled: !!dayCashId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    dayCash,
  };
};
