import { BackButton, CustomTable, Icons, StatusColorMap, toTitleCase, UI, useRedirect } from '../../../shared';
import { useLoans } from '../hooks';


export const LoansPage = () => {
  const { allLoans, isLoading, isFetching } = useLoans();
  const { redirectTo } = useRedirect();

  const statusColorMap: StatusColorMap = {
    status: "success"
  };

  const formatCurrency = ( value: number ) => {
    const numberFormat = new Intl.NumberFormat( 'es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    } );
    return numberFormat.format( value );
  };

  if ( isLoading ) {
    return (
      <div className="flex items-center justify-center mt-11">
        <UI.Spinner />
      </div>
    );
  }

  if ( !allLoans ) return null;

  const goToClientProfile = ( idClient: string ) => {
    redirectTo( `/cliente/${ idClient }` );
  };

  const columns = [
    { name: "Número de préstamo", uid: "number", sortable: true },
    { name: "Cliente", uid: "customerName", sortable: true },
    { name: "DNI", uid: "customerDni", sortable: true },
    { name: "Fecha inicio", uid: "startDate", sortable: true },
    { name: "Monto", uid: "amount", sortable: true },
    { name: "Interés", uid: "interest", sortable: true },
    { name: "Total a pagar", uid: "totalAmount", sortable: true },
    { name: "Ganancia", uid: "profit", sortable: true },
    { name: "Cuotas", uid: "installments", sortable: true },
    { name: "Monto cuota", uid: "installmentAmount", sortable: true },
    { name: "Frecuencia", uid: "paymentFrequency", sortable: true },
    { name: "Estado", uid: "status", sortable: true },
    { name: "Acciones", uid: "actions", sortable: false }
  ];

  const getStatusColor = ( status: string ) => {
    switch ( status ) {
      case "ACTIVO":
        return "success";
      case "TERMINADO":
        return "warning";
      case "ATRASADO":
        return "danger";
      default:
        return "default";
    }
  };

  const transformLoans = ( loans: typeof allLoans ) => {
    return loans.map( loan => {
      const totalAmount = loan.amount * ( 1 + loan.interest / 100 );
      const profit = totalAmount - loan.amount;

      return {
        number: loan.number,
        customerName: `${ toTitleCase( loan.customer.lastName ) }, ${ toTitleCase( loan.customer.name ) }`,
        customerDni: loan.customer.dni,
        startDate: loan.startDate,
        amount: `$${ formatCurrency( loan.amount ) }`,
        interest: `${ loan.interest }%`,
        totalAmount: `$${ formatCurrency( totalAmount ) }`,
        profit: `$${ formatCurrency( profit ) }`,
        installments: loan.installments,
        installmentAmount: `$${ formatCurrency( loan.installmentAmount ) }`,
        paymentFrequency: loan.paymentFrequency,
        status: (
          <UI.Chip
            color={ getStatusColor( loan.status ) }
            variant="flat"
          >
            { loan.status }
          </UI.Chip>
        ),
        actions: <UI.Button
          onPress={ () => { goToClientProfile( loan.customer.id ); } }
          variant="bordered"
          color="primary"
          startContent={ <Icons.IoIdCardOutline size={ 24 } /> }
        >
          Más información
        </UI.Button>,
      };
    } );
  };

  const allTransformedLoans = transformLoans( allLoans );
  const activeLoans = transformLoans( allLoans.filter( loan => loan.status !== "TERMINADO" ) );
  const delinquentLoans = transformLoans( allLoans.filter( loan => loan.status === "ATRASADO" ) );
  const finalizedLoans = transformLoans( allLoans.filter( loan => loan.status === "TERMINADO" ) );

  const renderLoansTable = ( loans: ReturnType<typeof transformLoans> ) => (
    <div className="mt-4 p-8">
      <div className="flex justify-between items-center mb-4">
        { isFetching && (
          <div className="flex items-center gap-2">
          </div>
        ) }
      </div>
      <CustomTable
        data={ loans }
        columns={ columns }
        defaultSortDescriptor={ {
          column: "number",
          direction: "descending"
        } }
        statusColorMap={ statusColorMap }
        initialVisibleColumns={ [
          "number",
          "customerName",
          "customerDni",
          "startDate",
          "amount",
          "interest",
          "totalAmount",
          "profit",
          "installments",
          "installmentAmount",
          "paymentFrequency",
          "status",
          "actions"
        ] }
        title="Préstamos"
      />
    </div>
  );

  return (
    <UI.Card className="mt-6 p-2">
      <UI.CardHeader>
        <div className="absolute left-0 ml-2">
          <BackButton url='/home' />
        </div>
        <div className="flex items-center justify-center space-x-2 w-full">
          <Icons.IoCashOutline size={ 24 } />
          <h1 className="text-2xl font-bold">Préstamos</h1>
        </div>
      </UI.CardHeader>
      <UI.CardBody>
        <div className="flex w-full flex-col">
          <UI.Tabs aria-label="Options" color="primary" variant="bordered" className="justify-center">

            <UI.Tab
              key="active"
              title={
                <div className="flex items-center space-x-2">
                  <Icons.IoClipboardOutline size={ 24 } />
                  <span>Activos</span>
                </div>
              }
            >
              { renderLoansTable( activeLoans ) }
            </UI.Tab>

            <UI.Tab
              key="delinquent"
              title={
                <div className="flex items-center space-x-2">
                  <Icons.IoAlertCircleOutline size={ 24 } />
                  <span>Atrasados</span>
                </div>
              }
            >
              { renderLoansTable( delinquentLoans ) }
            </UI.Tab>

            <UI.Tab
              key="finalized"
              title={
                <div className="flex items-center space-x-2">
                  <Icons.IoCheckmarkOutline size={ 24 } />
                  <span>Finalizados</span>
                </div>
              }
            >
              { renderLoansTable( finalizedLoans ) }
            </UI.Tab>

            <UI.Tab
              key="all"
              title={
                <div className="flex items-center space-x-2">
                  <Icons.IoWalletOutline size={ 24 } />
                  <span>Todos</span>
                </div>
              }
            >
              { renderLoansTable( allTransformedLoans ) }
            </UI.Tab>
          </UI.Tabs>
        </div>
      </UI.CardBody>
    </UI.Card>
  );
};