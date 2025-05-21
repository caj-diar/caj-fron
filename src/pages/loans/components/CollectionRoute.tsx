import { useEffect, useState } from 'react';

import { Icons, UI } from '../../../shared';
import { useCollectionRoute } from '../hooks';
import { ICollectionRouteResponse } from '../interfaces';
import { IRouteDelayed, IRouteIsPaid, IRouteLoan } from '../interfaces/ICollectionRoute';

const formatCurrency = ( value?: number ) => {
  const formatter = new Intl.NumberFormat( 'es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  } );

  return formatter.format( value || 0 );
};

const CollectionRouteContent = ( { searchDate, showDelayed }: { searchDate: string; showDelayed: boolean; forceKey: number; } ) => {
  const formatDate = ( dateString: string ) => {
    if ( !dateString ) return '';
    const date = new Date( dateString + 'T00:00:00' );
    return date.toLocaleDateString( 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' } );
  };

  const getPaymentStatus = ( payment: { isPaid: IRouteIsPaid; isDelayed: boolean; } ) => {
    if ( payment.isDelayed ) return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">ATRASADO</span>;
    return <span className={ `px-2 py-1 rounded-full text-xs font-medium ${ payment.isPaid === IRouteIsPaid.Pagado ? 'bg-green-100 text-green-800' :
      payment.isPaid === IRouteIsPaid.Parcial ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }` }>{ payment.isPaid }</span>;
  };

  const calculateDaysLate = ( paymentDate: string ) => {
    const getBuenosAiresDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };

      const today = new Date().toLocaleDateString( 'es-AR', options );
      const [ day, month, year ] = today.split( '/' ).map( Number );
      return new Date( year, month - 1, day );
    };

    const parsePaymentDate = ( dateStr: string ) => {
      const [ day, month, year ] = dateStr.split( '/' ).map( Number );
      return new Date( year, month - 1, day );
    };

    try {
      const buenosAiresToday = getBuenosAiresDate();
      const dueDate = parsePaymentDate( paymentDate );

      buenosAiresToday.setHours( 0, 0, 0, 0 );
      dueDate.setHours( 0, 0, 0, 0 );

      const timeDiff = buenosAiresToday.getTime() - dueDate.getTime();
      const daysLate = Math.floor( timeDiff / ( 1000 * 3600 * 24 ) );

      return Math.max( daysLate, 0 );
    } catch {
      return 0;
    }
  };

  const { collectionRoute, isLoading } = useCollectionRoute( formatDate( searchDate ) );

  const hasUnpaidPayments = ( loan: IRouteLoan ) => {
    const unpaidToday = loan.dueToday.some( payment => payment.isPaid !== IRouteIsPaid.Pagado );
    const unpaidDelayed = showDelayed && loan.delayed.some( payment => payment.isPaid !== IRouteIsPaid.Pagado );
    return unpaidToday || unpaidDelayed;
  };

  const hasUnfinishedLoans = ( route: ICollectionRouteResponse ) => {
    return Object.values( route.loans ).some( loan => hasUnpaidPayments( loan ) );
  };

  return (
    <>
      { isLoading && (
        <div className="flex justify-center p-8">
          <UI.Spinner size="lg" />
        </div>
      ) }

      { collectionRoute && (
        <div className="space-y-6">
          { ( ( collectionRoute as unknown as ICollectionRouteResponse[] ) )
            .filter( route => hasUnfinishedLoans( route ) )
            .map( ( route: ICollectionRouteResponse ) => (
              <div key={ route.customerId } className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{ route.customerName }</h3>
                      <UI.Button
                        variant="bordered"
                        color="primary"
                        startContent={ <Icons.IoIdCardOutline size={ 24 } /> }
                        onPress={ () => window.open( `/cliente/${ route.customerId }`, '_blank' ) }
                      >
                        Ver ficha del cliente
                      </UI.Button>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">
                        Total a Cobrar Hoy: <span className="font-semibold text-blue-600 text-lg">${ formatCurrency( route.totalDueToday ) }</span>
                      </p>
                      { showDelayed && (
                        <p className="text-sm">
                          Total Atrasado: <span className="font-semibold text-red-600 text-lg">${ formatCurrency( route.totalDelayed ) }</span>
                        </p>
                      ) }
                      <p className="text-sm">
                        Deuda Total hasta la fecha: <span className="font-semibold text-gray-900 text-lg">${ formatCurrency( route.totalDebt ) }</span>
                      </p>
                    </div>
                  </div>
                </div>

                { Object.entries( route.loans )
                  .filter( ( [ _, loan ] ) => hasUnpaidPayments( loan ) )
                  .map( ( [ loanId, loan ]: [ string, IRouteLoan ] ) => (
                    <div key={ loanId } className="divide-y divide-gray-200">
                      <div className="p-6 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">Préstamo #{ loan.loanNumber }</p>
                          </div>
                          <div className="text-right text-sm space-y-1">
                            <p className="text-gray-600">Cuotas Totales: <span className="font-medium">{ loan.totalInstallments }</span></p>
                            <p className="text-gray-600">Cuotas Pagadas: <span className="font-medium text-green-600">{ loan.paidInstallments }</span></p>
                            <p className="text-gray-600">Cuotas Restantes: <span className="font-medium text-blue-600">{ loan.remainingInstallments }</span></p>
                          </div>
                        </div>
                      </div>

                      { loan.dueToday.filter( payment => payment.isPaid !== IRouteIsPaid.Pagado ).length > 0 && (
                        <div className="p-6">
                          <div className="mb-4">
                            <h4 className="text-base font-semibold text-gray-900">
                              Cobrar (<span className="text-blue-600">${ formatCurrency( loan.dueToday
                                .filter( payment => payment.isPaid !== IRouteIsPaid.Pagado )
                                .reduce( ( total, payment ) => total + ( payment.remainingAmount || 0 ), 0 ) ) }</span>)
                            </h4>
                          </div>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Monto</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Pagado</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Restante</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                { loan.dueToday
                                  .filter( payment => payment.isPaid !== IRouteIsPaid.Pagado )
                                  .map( ( payment: IRouteDelayed ) => (
                                    <tr key={ payment.scheduleId }>
                                      <td className="px-4 py-3 text-sm text-gray-600">{ payment.paymentDate }</td>
                                      <td className="px-4 py-3 text-sm text-gray-900 text-right">${ formatCurrency( payment.paymentAmount ) }</td>
                                      <td className="px-4 py-3 text-sm text-green-600 text-right">${ formatCurrency( payment.paidAmount ) }</td>
                                      <td className="px-4 py-3 text-sm text-red-600 text-right">${ formatCurrency( payment.remainingAmount ) }</td>
                                      <td className="px-4 py-3 text-center">{ getPaymentStatus( payment ) }</td>
                                    </tr>
                                  ) ) }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) }

                      { showDelayed && loan.delayed.filter( payment => payment.isPaid !== IRouteIsPaid.Pagado ).length > 0 && (
                        <div className="p-6 bg-red-50">
                          <div className="mb-4">
                            <h4 className="text-base font-semibold text-gray-900">
                              Cobrar pagos Atrasados (<span className="text-red-600">${ formatCurrency( loan.delayed
                                .filter( payment => payment.isPaid !== IRouteIsPaid.Pagado )
                                .reduce( ( total, payment ) => total + ( payment.remainingAmount || 0 ), 0 ) ) }</span>)
                            </h4>
                          </div>
                          <div className="border rounded-lg overflow-hidden border-red-200">
                            <table className="w-full">
                              <thead className="bg-red-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-red-800">Fecha</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-red-800">Monto</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-red-800">Pagado</th>
                                  <th className="px-4 py-3 text-right text-sm font-semibold text-red-800">Restante</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-red-800">Días de Atraso</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-red-800">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-red-200">
                                { [ ...loan.delayed ]
                                  .filter( payment => payment.isPaid !== IRouteIsPaid.Pagado )
                                  .sort( ( a, b ) => {
                                    const [ dayA, monthA, yearA ] = a.paymentDate.split( '/' ).map( Number );
                                    const [ dayB, monthB, yearB ] = b.paymentDate.split( '/' ).map( Number );
                                    return new Date( yearA, monthA - 1, dayA ).getTime() - new Date( yearB, monthB - 1, dayB ).getTime();
                                  } ).map( ( payment: IRouteDelayed ) => {
                                    const daysLate = calculateDaysLate( payment.paymentDate );
                                    return (
                                      <tr key={ payment.scheduleId }>
                                        <td className="px-4 py-3 text-sm text-red-900">{ payment.paymentDate }</td>
                                        <td className="px-4 py-3 text-sm text-red-900 text-right">${ formatCurrency( payment.paymentAmount ) }</td>
                                        <td className="px-4 py-3 text-sm text-green-600 text-right">${ formatCurrency( payment.paidAmount ) }</td>
                                        <td className="px-4 py-3 text-sm text-red-900 text-right">${ formatCurrency( payment.remainingAmount ) }</td>
                                        <td className="px-4 py-3 text-center text-sm font-medium text-red-900">
                                          { daysLate > 0 ? `${ daysLate } días` : 'Al día' }
                                        </td>
                                        <td className="px-4 py-3 text-center">{ getPaymentStatus( payment ) }</td>
                                      </tr>
                                    );
                                  } ) }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) }
                    </div>
                  ) ) }
              </div>
            ) ) }
        </div>
      ) }
    </>
  );
};

export const CollectionRoute = () => {
  const [ selectedDate, setSelectedDate ] = useState( '' );
  const [ searchDate, setSearchDate ] = useState( '' );
  const [ forceKey, setForceKey ] = useState( 0 );
  const [ showDelayed, setShowDelayed ] = useState( true );

  const formatSelectedDate = ( dateString: string ) => {
    if ( !dateString ) return null;

    const date = new Date( dateString + 'T12:00:00' );
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString( 'es-ES', {
      ...options,
      timeZone: 'America/Argentina/Buenos_Aires'
    } );
  };

  const handleSearch = () => {
    setSearchDate( selectedDate );
    setForceKey( prevKey => prevKey + 1 );
  };

  useEffect( () => {
    if ( selectedDate ) {
      handleSearch();
    }
  }, [ selectedDate ] );

  const formattedDate = formatSelectedDate( searchDate );

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-end gap-4">
            <UI.Input
              type="date"
              label="Fecha"
              placeholder="Seleccione el día de cobranza"
              value={ selectedDate }
              onChange={ ( e ) => setSelectedDate( e.target.value ) }
              variant="bordered"
              className="w-64"
            />
            <UI.Button
              color="primary"
              onPress={ handleSearch }
              isDisabled={ !selectedDate }
            >
              Buscar
            </UI.Button>
            <UI.Checkbox
              isSelected={ showDelayed }
              onValueChange={ setShowDelayed }
              className="ml-4"
            >
              Mostrar cobros atrasados
            </UI.Checkbox>
          </div>
        </div>
        { formattedDate && (
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Ruta de Cobranza para el { formattedDate }
            </h2>
          </div>
        ) }
      </div>

      <CollectionRouteContent
        key={ forceKey }
        searchDate={ searchDate }
        forceKey={ forceKey }
        showDelayed={ showDelayed }
      />
    </div>
  );
};