import { useQuery } from '@tanstack/react-query';

import { getTransactionsCodes } from '../services';




export const useTransactionsCodes = () => {

  const { isLoading, isFetching, isError, error, data: transactionsCodes } = useQuery( {
    queryKey: [ 'transactions-codes' ],
    queryFn: () => getTransactionsCodes()
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    transactionsCodes
  };
};
