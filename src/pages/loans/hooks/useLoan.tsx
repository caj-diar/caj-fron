import { useQuery } from '@tanstack/react-query';

import { getLoanById } from '../services';



export const useLoanById = ( loandId?: string ) => {

  const { isLoading, isFetching, isError, error, data: loan } = useQuery( {
    queryKey: [ 'loan', loandId ],
    queryFn: () => getLoanById( loandId! ),
    enabled: !!loandId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    loan,
  };
};
