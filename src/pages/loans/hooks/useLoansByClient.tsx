import { useQuery } from '@tanstack/react-query';

import { getLoansByClientId } from '../services';



export const useLoansByClientId = ( clientId?: string ) => {

  const { isLoading, isFetching, isError, error, data: loansByClient } = useQuery( {
    queryKey: [ 'loans-by-client' ],
    queryFn: () => getLoansByClientId( clientId! ),
    enabled: !!clientId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    loansByClient,
  };
};
