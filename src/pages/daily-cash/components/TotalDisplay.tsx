import { useTotals } from '../hooks';

type AccountTotal = {
  accountId: string;
  accountName: string;
  total: number;
};

interface TotalDisplayProps {
  totalBalance: number;
  accountTotals: AccountTotal[];
}

export const TotalDisplay = ( { totalBalance, accountTotals }: TotalDisplayProps ) => {
  const { totals } = useTotals();

  const formatNumber = ( num: number ) => {
    return new Intl.NumberFormat( 'es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format( num );
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="rounded-lg bg-gray-800 p-6 text-white">
        <h2 className="text-lg font-medium">Balance Total</h2>
        <p className="text-2xl font-bold">${ formatNumber( totalBalance ) }</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">Balance por Cuenta</h3>
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

      { totals && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Por Cobrar</h3>
            <p className="text-lg font-semibold text-gray-600">
              ${ formatNumber( totals.totalToCollect ) }
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Ganancias</h3>
            <p className="text-lg font-semibold text-green-600">
              ${ formatNumber( totals.totalProfit ) }
            </p>
          </div>


          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Atrasado</h3>
            <p className="text-lg font-semibold text-red-600">
              ${ formatNumber( totals.totalOverdue ) }
            </p>
          </div>
        </div>
      ) }
    </div>
  );
};