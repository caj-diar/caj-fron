import { useMemo } from 'react';

import { IDayCash } from '../interfaces';
import { AddTransaction } from './AddTransaction';
import { Icons, UI, useDisclosure } from '../../../shared';

interface DayCashCardProps {
  dayCash: IDayCash;
  previousBalance: number;
}

type AccountTotal = {
  accountId: string;
  accountName: string;
  total: number;
};

export const DayCashCard = ( { dayCash, previousBalance }: DayCashCardProps ) => {

  const { isOpen, onClose, onOpen } = useDisclosure();

  const sortedTransactions = useMemo( () =>
    dayCash.transactions?.sort( ( a, b ) =>
      new Date( a.date ).getTime() - new Date( b.date ).getTime()
    ) || [], [ dayCash.transactions ]
  );

  const formatNumber = ( num: number ) => {
    return new Intl.NumberFormat( 'es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format( num );
  };

  const totals = useMemo( () => {
    const income = sortedTransactions
      .filter( t => t.transactionCode.type === 1 )
      .reduce( ( sum, t ) => sum + t.amount, 0 );

    const expense = sortedTransactions
      .filter( t => t.transactionCode.type === 2 )
      .reduce( ( sum, t ) => sum + t.amount, 0 );

    return {
      income,
      expense,
      total: income - expense,
      withPrevious: previousBalance + income - expense
    };
  }, [ sortedTransactions, previousBalance ] );

  const accountTotals = useMemo( () => {
    const totals = new Map<string, AccountTotal>();

    sortedTransactions.forEach( transaction => {
      const { account, amount, transactionCode } = transaction;
      const adjustedAmount = transactionCode.type === 1 ? amount : -amount;

      if ( !totals.has( account.id ) ) {
        totals.set( account.id, {
          accountId: account.id,
          accountName: account.name,
          total: 0
        } );
      }

      const currentTotal = totals.get( account.id )!;
      totals.set( account.id, {
        ...currentTotal,
        total: currentTotal.total + adjustedAmount
      } );
    } );

    return Array.from( totals.values() );
  }, [ sortedTransactions ] );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          { dayCash.date }
        </h2>
        {
          dayCash.isOpen && (
            <>
              <UI.Button
                onPress={ onOpen }
                startContent={ <Icons.IoAddOutline size={ 24 } /> }
                variant="bordered"
              >
                Nueva Transacción
              </UI.Button>
              <AddTransaction
                dailyCashId={ dayCash.id }
                isOpen={ isOpen }
                onClose={ onClose }
              />
            </>
          )
        }
        <span className={ `rounded-full px-3 py-1 text-sm ${ dayCash.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }` }>
          { dayCash.isOpen ? 'Abierto' : 'Cerrado' }
        </span>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-gray-600">Saldo Anterior</p>
          <p className="text-lg font-semibold text-purple-600">
            ${ formatNumber( previousBalance ) }
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">Entradas</p>
          <p className="text-lg font-semibold text-green-600">
            ${ formatNumber( totals.income ) }
          </p>
        </div>
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-gray-600">Salidas</p>
          <p className="text-lg font-semibold text-red-600">
            ${ formatNumber( totals.expense ) }
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">Saldo Total</p>
          <p className="text-lg font-semibold text-blue-600">
            ${ formatNumber( totals.withPrevious ) }
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">Totales por Cuenta</h3>
        <div className="grid grid-cols-3 gap-4">
          { accountTotals.map( account => (
            <div key={ account.accountId } className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">{ account.accountName }</p>
              <p className={ `text-lg font-semibold ${ account.total >= 0 ? 'text-green-600' : 'text-red-600' }` }>
                ${ formatNumber( account.total ) }
              </p>
            </div>
          ) ) }
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="pb-2">Hora</th>
              <th className="pb-2">Tipo</th>
              <th className="pb-2">Descripción</th>
              <th className="pb-2">Cuenta</th>
              <th className="pb-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            { sortedTransactions.map( ( transaction ) => (
              <tr key={ transaction.id } className="border-b last:border-0">
                <td className="py-2">
                  { transaction.date }
                </td>
                <td className="py-2">
                  { transaction.transactionCode.name }
                </td>
                <td className="py-2">
                  { transaction.description || '-' }
                </td>
                <td className="py-2">
                  { transaction.account.name }
                </td>
                <td className={ `py-2 font-medium ${ transaction.transactionCode.type === 1
                  ? 'text-green-600'
                  : 'text-red-600'
                  }` }>
                  ${ formatNumber( transaction.amount ) }
                </td>
              </tr>
            ) ) }
          </tbody>
        </table>
      </div>
    </div>
  );
};