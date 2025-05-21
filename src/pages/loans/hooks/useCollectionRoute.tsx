import { useQuery } from '@tanstack/react-query';

import { getCollectionRoute } from '../services';



export const useCollectionRoute = ( date: string ) => {

  const { isLoading, isFetching, isError, error, data: collectionRoute } = useQuery( {
    queryKey: [ 'collection-route' ],
    queryFn: () => getCollectionRoute( date ),
    enabled: !!date,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    collectionRoute,
  };
};
