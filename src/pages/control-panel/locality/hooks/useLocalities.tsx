import { useQuery } from '@tanstack/react-query';

import { getLocalities } from '../services';



export const useLocalities = () => {

  const { isLoading, isFetching, isError, error, data: localities } = useQuery( {
    queryKey: [ 'localities' ],
    queryFn: () => getLocalities()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    localities
  };
};
