import { useState } from 'react';

import { BackButton } from '../../../shared';
import { IDayCash, ITransaction } from '../interfaces';
import { TotalDisplay, SearchBar, DayCashCard } from '../components';
import { useDaysCash } from '../hooks';


type AccountTotal = {
  accountId: string;
  accountName: string;
  total: number;
};

export const DailyCashPage = () => {
  const [ currentPage, setCurrentPage ] = useState( 1 );
  const [ searchTerm, setSearchTerm ] = useState( '' );
  const { allDaysCash, isLoading } = useDaysCash();


  const itemsPerPage = 5;
  const filteredDaysCash = allDaysCash?.map( dayCash => {
    if ( !searchTerm.trim() ) return dayCash;

    const search = searchTerm.toLowerCase().trim();

    const filteredTransactions = dayCash.transactions?.filter( transaction => {
      const searchableFields = [
        transaction.date,
        transaction.transactionCode.name,
        transaction.description || '',
        transaction.account.name,
        transaction.amount.toLocaleString( 'es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        } ),
        transaction.amount.toString(),
        transaction.amount.toFixed( 2 ),
        dayCash.date
      ].map( field => field.toLowerCase() );

      return searchableFields.some( field => field.includes( search ) );
    } );

    return filteredTransactions?.length
      ? { ...dayCash, transactions: filteredTransactions }
      : null;
  } ).filter( Boolean ) as IDayCash[];

  const totalPages = Math.ceil( ( filteredDaysCash?.length || 0 ) / itemsPerPage );
  const startIndex = ( currentPage - 1 ) * itemsPerPage;
  const paginatedDaysCash = filteredDaysCash?.slice( startIndex, startIndex + itemsPerPage );

  const calculateAccountTotals = ( transactions: ITransaction[] ): AccountTotal[] => {
    const accountTotals = new Map<string, AccountTotal>();

    transactions.forEach( transaction => {
      const { account, amount, transactionCode } = transaction;
      const adjustedAmount = transactionCode.type === 1 ? amount : -amount;

      if ( !accountTotals.has( account.id ) ) {
        accountTotals.set( account.id, {
          accountId: account.id,
          accountName: account.name,
          total: 0
        } );
      }

      const currentTotal = accountTotals.get( account.id )!;
      accountTotals.set( account.id, {
        ...currentTotal,
        total: currentTotal.total + adjustedAmount
      } );
    } );

    return Array.from( accountTotals.values() );
  };

  const allTransactions = allDaysCash?.flatMap( dayCash => dayCash.transactions || [] ) || [];
  const totalBalance = allTransactions.reduce( ( total, transaction ) =>
    total + ( transaction.transactionCode.type === 1 ? transaction.amount : -transaction.amount ), 0 );
  const accountTotals = calculateAccountTotals( allTransactions );

  if ( isLoading ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-1">
        <BackButton url="/home" />
      </div>

      <TotalDisplay totalBalance={ totalBalance || 0 } accountTotals={ accountTotals } />


      <SearchBar onSearch={ setSearchTerm } searchTerm={ searchTerm } />

      <div className="space-y-6">
        { paginatedDaysCash?.map( ( dayCash ) => {
          const previousDayCash = allDaysCash?.[ allDaysCash.findIndex( dc => dc.id === dayCash.id ) + 1 ];
          return (
            <DayCashCard
              key={ dayCash.id }
              dayCash={ dayCash }
              previousBalance={ getPreviousDayBalance( previousDayCash ) }
            />
          );
        } ) }
      </div>

      <div className="mt-8 flex justify-center space-x-2">
        { Array.from( { length: totalPages }, ( _, i ) => (
          <button
            key={ i + 1 }
            onClick={ () => setCurrentPage( i + 1 ) }
            className={ `h-10 w-10 rounded-lg ${ currentPage === i + 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }` }
          >
            { i + 1 }
          </button>
        ) ) }
      </div>
    </div>
  );
};

const getPreviousDayBalance = ( previousDayCash?: IDayCash ): number => {

  if ( !previousDayCash?.transactions?.length ) return 0;

  return previousDayCash.transactions.reduce( ( total, transaction ) =>
    total + ( transaction.transactionCode.type === 1 ? transaction.amount : -transaction.amount ), 0 );
};