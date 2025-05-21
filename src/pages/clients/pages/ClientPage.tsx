import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BackButton, Icons, toTitleCase, UI } from '../../../shared';
import { ClientsForm } from '../components/ClientsForm';
import { CancelLoan, RefinanceLoan } from '../components';
import { useAccounts } from '../hooks';
import { useAddPay } from '../../loans/hooks';
import { useClientById, useLoansByClientId } from '../../';
import { EditInstallmentModal } from '../../loans/components/EditScheduleModal';

export const ClientPage = () => {
  const { id } = useParams();
  const { client } = useClientById( id );
  const { loansByClient, isLoading } = useLoansByClientId( id );
  const { addPayLoan } = useAddPay();
  const { allAccounts } = useAccounts();

  const [ paymentData, setPaymentData ] = useState<{ [ key: string ]: { amount: string; accountId: string; }; }>( {} );
  const [ savingPaymentId, setSavingPaymentId ] = useState<string | null>( null );
  const [ isEditModalOpen, setIsEditModalOpen ] = useState( false );
  const [ selectedSchedule, setSelectedSchedule ] = useState<any>( null );
  const defaultAccountId = allAccounts?.[ 0 ]?.id || '';

  const openGoogleMaps = ( address: string ) => {
    const fullAddress = encodeURIComponent( `${ toTitleCase( address ) }, ${ toTitleCase( client?.locality?.name || '' ) }, Buenos Aires, Argentina` );
    window.open( `https://www.google.com/maps/search/?api=1&query=${ fullAddress }`, '_blank' );
  };

  const openWhatsApp = ( phone: string ) => {
    const formattedPhone = phone.replace( /\D/g, '' );
    window.open( `https://wa.me/${ formattedPhone }`, '_blank' );
  };

  const formatCurrency = useMemo( () =>
    ( value: number ) => new Intl.NumberFormat( 'es-AR', {
      style: 'currency',
      currency: 'ARS'
    } ).format( value ),
    [] );

  const getStatusColor = useMemo( () =>
    ( status: string ) => {
      switch ( status ) {
        case 'PENDIENTE': return 'warning';
        case 'ATRASADO': return 'danger';
        case 'FINALIZADO': return 'success';
        default: return 'default';
      }
    },
    [] );

  const handlePaymentChange = ( scheduleId: string, field: 'amount' | 'accountId', value: string ) => {
    setPaymentData( prev => ( {
      ...prev,
      [ scheduleId ]: {
        ...prev[ scheduleId ],
        [ field ]: value,
        accountId: field === 'accountId' ? value : ( prev[ scheduleId ]?.accountId || defaultAccountId )
      }
    } ) );
  };

  const handleSavePayment = async ( scheduleId: string ) => {
    const data = paymentData[ scheduleId ];
    if ( data?.amount && data?.accountId ) {
      const amount = parseInt( data.amount, 10 );
      if ( !isNaN( amount ) ) {
        setSavingPaymentId( scheduleId );
        try {
          await addPayLoan( {
            amount,
            id: scheduleId,
            account: data.accountId
          } );
          setPaymentData( prev => ( {
            ...prev,
            [ scheduleId ]: { amount: '', accountId: defaultAccountId }
          } ) );
        } finally {
          setSavingPaymentId( null );
        }
      }
    }
  };

  if ( isLoading ) {
    return (
      <div className="flex items-center justify-center mt-11">
        <UI.Spinner />
      </div>
    );
  }

  if ( !client || !loansByClient ) return null;

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start mb-4 pl-0">
          <BackButton url="/prestamos" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Icons.IoIdCardOutline size={ 24 } />
          <h1 className="font-bold text-xl mb-2 mt-2">#{ client.number } - { toTitleCase( client.lastName ) }, { toTitleCase( client.name ) }</h1>
          <ClientsForm id={ client.id } />
        </div>
        <div className="flex justify-center items-center gap-2">
          <UI.Chip
            color={ client.isActive ? "success" : "danger" }
            variant="flat"
            startContent={ client.isActive ?
              <Icons.IoCheckmarkCircleOutline className="flex-shrink-0" /> :
              <Icons.IoCloseCircleOutline className="flex-shrink-0" />
            }
          >
            { client.isActive ? "Cliente Activo" : "Cliente Inactivo" }
          </UI.Chip>
          <UI.Chip
            color="primary"
            variant="flat"
            startContent={ <Icons.IoCalendarOutline className="flex-shrink-0" /> }
          >
            Desde: { client.creationDate }
          </UI.Chip>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <UI.Card>
          <UI.CardHeader className="flex gap-2">
            <Icons.IoPersonOutline size={ 24 } />
            <h2 className="text-xl font-semibold">Información Personal</h2>
          </UI.CardHeader>
          <UI.CardBody className="gap-4">
            <div className="flex items-center gap-2">
              <Icons.IoFingerPrintOutline size={ 20 } />
              <span className="font-semibold">DNI:</span>
              <span>{ client.dni }</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.IoPersonAddOutline size={ 20 } />
              <span className="font-semibold">Registrado por:</span>
              <span>{ toTitleCase( client.createdBy?.username || '' ) }</span>
            </div>
            { client.documentation && client.documentation.length > 0 && (
              <div className="flex items-start gap-2">
                <Icons.IoDocumentTextOutline size={ 20 } className="mt-1" />
                <div>
                  <span className="font-semibold block mb-2">Documentación:</span>
                  <div className="flex flex-wrap gap-2">
                    { client.documentation.map( ( doc, index ) => (
                      <UI.Chip key={ index } variant="flat" size="sm">
                        { toTitleCase( doc ) }
                      </UI.Chip>
                    ) ) }
                  </div>
                </div>
              </div>
            ) }
          </UI.CardBody>
        </UI.Card>
        <UI.Card>
          <UI.CardHeader className="flex gap-2">
            <Icons.IoCallOutline size={ 24 } />
            <h2 className="text-xl font-semibold">Contacto</h2>
          </UI.CardHeader>
          <UI.CardBody className="gap-4">
            { client.phoneNumbers && client.phoneNumbers.length > 0 && (
              <div className="flex items-start gap-2">
                <Icons.IoPhonePortraitOutline size={ 20 } className="mt-1" />
                <div className="flex-grow">
                  <span className="font-semibold block mb-2">Teléfonos:</span>
                  { client.phoneNumbers.map( ( phone, index ) => (
                    <div key={ index } className="flex items-center gap-2 mb-2 group">
                      <span className="flex-grow">{ phone }</span>
                      <div className="flex gap-2">
                        <UI.Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label="WhatsApp"
                          onPress={ () => openWhatsApp( phone ) }
                          className="group-hover:opacity-100 opacity-70 transition-opacity"
                        >
                          <Icons.IoLogoWhatsapp size={ 20 } className="text-green-500" />
                        </UI.Button>
                        <UI.Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label="Llamar"
                          onPress={ () => window.open( `tel:${ phone }`, '_self' ) }
                          className="group-hover:opacity-100 opacity-70 transition-opacity"
                        >
                          <Icons.IoCallOutline size={ 20 } className="text-blue-500" />
                        </UI.Button>
                      </div>
                    </div>
                  ) ) }
                </div>
              </div>
            ) }
          </UI.CardBody>
        </UI.Card>
        <UI.Card>
          <UI.CardHeader className="flex gap-2">
            <Icons.IoLocationOutline size={ 24 } />
            <h2 className="text-xl font-semibold">Ubicación</h2>
          </UI.CardHeader>
          <UI.CardBody className="gap-4">
            { client.addresses && client.addresses.length > 0 && (
              <div className="flex items-start gap-2">
                <Icons.IoHomeOutline size={ 20 } className="mt-1" />
                <div className="flex-grow">
                  <span className="font-semibold block mb-2">Direcciones:</span>
                  { client.addresses.map( ( address, index ) => (
                    <div key={ index } className="flex items-center gap-2 mb-2 group">
                      <span className="flex-grow">{ toTitleCase( address ) }</span>
                      <UI.Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Ver en Maps"
                        onPress={ () => openGoogleMaps( address ) }
                        className="group-hover:opacity-100 opacity-70 transition-opacity"
                      >
                        <Icons.IoNavigateOutline size={ 20 } className="text-blue-500" />
                      </UI.Button>
                    </div>
                  ) ) }
                </div>
              </div>
            ) }
            <div className="flex items-center gap-2">
              <Icons.IoMapOutline size={ 20 } />
              <span className="font-semibold">Localidad:</span>
              <UI.Chip variant="flat" size="sm" color="primary">
                { toTitleCase( client.locality?.name || '' ) }
              </UI.Chip>
            </div>
            <div className="flex items-center gap-2">
              <Icons.IoNavigateOutline size={ 20 } />
              <span className="font-semibold">Zona:</span>
              <UI.Chip
                variant="flat"
                size="sm"
                color={ client.zone ? "success" : "warning" }
              >
                { toTitleCase( client.zone || "No especificada" ) }
              </UI.Chip>
            </div>
          </UI.CardBody>
        </UI.Card>
        { client.description && (
          <UI.Card>
            <UI.CardHeader className="flex gap-2">
              <Icons.IoInformationCircleOutline size={ 24 } />
              <h2 className="text-xl font-semibold">Descripción</h2>
            </UI.CardHeader>
            <UI.CardBody>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{ toTitleCase( client.description ) }</p>
              </div>
            </UI.CardBody>
          </UI.Card>
        ) }
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <UI.Card>
            <UI.CardBody>
              <div className="flex items-center gap-2 mb-2">
                <Icons.IoWalletOutline size={ 20 } />
                <span className="font-semibold">Total a Pagar:</span>
                <span className="text-primary">{ formatCurrency( loansByClient?.totalSummary?.totalAmountWithInterest || 0 ) }</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.IoCheckmarkCircleOutline size={ 20 } />
                <span className="font-semibold">Total Pagado:</span>
                <span className="text-success">{ formatCurrency( loansByClient?.totalSummary?.totalPaidAmount || 0 ) }</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.IoAlertCircleOutline size={ 20 } />
                <span className="font-semibold">Total Atrasado:</span>
                <span className="text-danger">{ formatCurrency( loansByClient?.totalSummary?.totalDelayedAmount || 0 ) }</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.IoTimeOutline size={ 20 } />
                <span className="font-semibold">Total Pendiente:</span>
                <span className="text-warning">{ formatCurrency( loansByClient?.totalSummary?.totalRemainingAmount || 0 ) }</span>
              </div>
            </UI.CardBody>
          </UI.Card>
        </div>
        <div className="space-y-6">
          { loansByClient?.loans?.map( ( loan, index ) => (
            <UI.Card key={ index } className="w-full">
              <UI.CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icons.IoCubeOutline size={ 20 } />
                  <span className="font-bold">Préstamo N° #{ loan.loanNumber }</span>
                  {
                    loan.status !== 'TERMINADO' && (
                      <CancelLoan loan={ loan } />
                    )
                  }
                  {
                    loan.status !== 'TERMINADO' && (
                      <RefinanceLoan
                        loan={ loan }
                        client={ client }
                      />
                    )
                  }
                </div>
                <div className="flex items-center gap-2">
                  <UI.Chip
                    color={ getStatusColor( loan.status ) }
                    variant="flat"
                  >
                    { loan.status }
                  </UI.Chip>
                  <UI.Chip variant="flat">
                    { formatCurrency( loan.summary?.totalDelayedAmount || 0 ) }
                  </UI.Chip>
                </div>
              </UI.CardHeader>
              <UI.CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Icons.IoCalendarOutline size={ 20 } />
                    <span className="font-semibold">Fecha:</span>
                    <span>{ loan.startDate }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.IoCashOutline size={ 20 } />
                    <span className="font-semibold">Monto Total:</span>
                    <span>{ formatCurrency( loan.totalAmountWithInterest || 0 ) }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.IoLayersOutline size={ 20 } />
                    <span className="font-semibold">Cuotas:</span>
                    <span>{ loan.installments }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.IoCheckmarkCircleOutline size={ 20 } />
                    <span className="font-semibold">Cuotas Pagadas:</span>
                    <span>{ loan.summary?.paidInstallments || 0 } de { loan.installments }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.IoAlertCircleOutline size={ 20 } />
                    <span className="font-semibold">Cuotas Atrasadas:</span>
                    <span>{ loan.summary?.delayedInstallments || 0 } de { loan.installments }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.IoTimeOutline size={ 20 } />
                    <span className="font-semibold">Cuotas Pendientes:</span>
                    <span>{ loan.summary?.remainingInstallments || 0 } de { loan.installments }</span>
                  </div>
                </div>
                <UI.Table aria-label="Cuotas del préstamo">
                  <UI.TableHeader>
                    <UI.TableColumn>Cuota</UI.TableColumn>
                    <UI.TableColumn>Fecha</UI.TableColumn>
                    <UI.TableColumn>Monto</UI.TableColumn>
                    <UI.TableColumn>Estado</UI.TableColumn>
                    <UI.TableColumn>Pagado</UI.TableColumn>
                    <UI.TableColumn>Pendiente</UI.TableColumn>
                    <UI.TableColumn>Días Atraso</UI.TableColumn>
                    <UI.TableColumn>Acciones</UI.TableColumn>
                  </UI.TableHeader>
                  <UI.TableBody>
                    { loan.schedules?.map( ( schedule ) => (
                      <UI.TableRow key={ schedule.id }>
                        <UI.TableCell>{ schedule.installmentNumber }</UI.TableCell>
                        <UI.TableCell>{ schedule.paymentDate }</UI.TableCell>
                        <UI.TableCell>{ formatCurrency( schedule.amount || 0 ) }</UI.TableCell>
                        <UI.TableCell>
                          <UI.Chip
                            size="sm"
                            color={ getStatusColor( schedule.status ) }
                            variant="flat"
                          >
                            { schedule.status }
                          </UI.Chip>
                        </UI.TableCell>
                        <UI.TableCell>{ formatCurrency( schedule.paidAmount || 0 ) }</UI.TableCell>
                        <UI.TableCell>{ formatCurrency( schedule.remainingAmount || 0 ) }</UI.TableCell>
                        <UI.TableCell>
                          { ( schedule.delayedDays || 0 ) > 0 && (
                            <UI.Chip
                              size="sm"
                              color="danger"
                              variant="flat"
                            >
                              { schedule.delayedDays } días
                            </UI.Chip>
                          ) }
                        </UI.TableCell>
                        <UI.TableCell>
                          <div className="flex flex-row space-x-2 items-center">
                            { schedule.status !== 'PAGADO' && schedule.status !== 'CANCELADO' && (
                              <>
                                <UI.Input
                                  type="text"
                                  value={ paymentData[ schedule.id ]?.amount || '' }
                                  onChange={ ( e ) => handlePaymentChange( schedule.id, 'amount', e.target.value ) }
                                  className="w-1/2"
                                  label="Monto pagado"
                                  onKeyDown={ ( e ) => {
                                    const allowedKeys = [
                                      'Backspace',
                                      'Delete',
                                      'ArrowLeft',
                                      'ArrowRight',
                                      'Tab',
                                      '0',
                                      '1',
                                      '2',
                                      '3',
                                      '4',
                                      '5',
                                      '6',
                                      '7',
                                      '8',
                                      '9'
                                    ];
                                    if ( !allowedKeys.includes( e.key ) ) {
                                      e.preventDefault();
                                    }
                                  } }
                                />
                                <UI.Select
                                  label="Seleccione una cuenta"
                                  value={ paymentData[ schedule.id ]?.accountId || defaultAccountId }
                                  onChange={ ( e ) => handlePaymentChange( schedule.id, 'accountId', e.target.value ) }
                                  defaultSelectedKeys={ [ defaultAccountId ] }
                                  className="w-1/3"
                                >
                                  { allAccounts?.map( ( account ) => (
                                    <UI.SelectItem key={ account.id } value={ account.id }>
                                      { account.name }
                                    </UI.SelectItem>
                                  ) ) || [] }
                                </UI.Select>
                                { savingPaymentId === schedule.id ? (
                                  <div className="flex items-center">
                                    <UI.Spinner size="sm" />
                                  </div>
                                ) : (
                                  <>
                                    <UI.Button
                                      color="primary"
                                      variant="bordered"
                                      endContent={ <Icons.IoSaveOutline size={ 24 } /> }
                                      onPress={ () => handleSavePayment( schedule.id ) }
                                    >
                                      Guardar pago
                                    </UI.Button>
                                    <UI.Button
                                      isIconOnly
                                      color="warning"
                                      variant="light"
                                      onPress={ () => {
                                        setSelectedSchedule( schedule );
                                        setIsEditModalOpen( true );
                                      } }
                                    >
                                      <Icons.IoPencilOutline size={ 20 } />
                                    </UI.Button>
                                  </>
                                ) }
                              </>
                            ) }
                          </div>
                        </UI.TableCell>
                      </UI.TableRow>
                    ) ) }
                  </UI.TableBody>
                </UI.Table>
              </UI.CardBody>
            </UI.Card>
          ) ) }
        </div>
      </div>
      { selectedSchedule && (
        <EditInstallmentModal
          isOpen={ isEditModalOpen }
          onClose={ () => {
            setIsEditModalOpen( false );
            setSelectedSchedule( null );
          } }
          schedule={ selectedSchedule }
        />
      ) }
    </div>
  );
};