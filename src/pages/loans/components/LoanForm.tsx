import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { useAddLoan, useLoanById, useLoanUpdate } from '../hooks';
import { LoanInputs, loanSchema } from '../validators';
import { useAccounts } from '../../clients';

interface Props {
  id?: string;
  customerId: string;
}

type DayOfWeek = "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";

export const LoanForm = ( { id, customerId }: Props ) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addLoan } = useAddLoan();
  const { loanUpdate } = useLoanUpdate();
  const { loan } = useLoanById( id );
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isSuccess, setIsSuccess ] = useState( false );
  const [ progress, setProgress ] = useState( 0 );
  const { allAccounts = [] } = useAccounts();

  const getNextWeekday = ( selectedDay?: DayOfWeek ) => {
    const daysMap: Record<DayOfWeek, number> = {
      "DOMINGO": 0,
      "LUNES": 1,
      "MARTES": 2,
      "MIERCOLES": 3,
      "JUEVES": 4,
      "VIERNES": 5,
      "SABADO": 6
    };

    const today = new Date();
    today.setHours( 0, 0, 0, 0 );

    let targetDay: number;

    if ( selectedDay ) {
      targetDay = daysMap[ selectedDay ];
    } else {
      targetDay = today.getDay();
      if ( targetDay === 0 ) targetDay = 1;
      if ( targetDay === 6 ) targetDay = 5;
    }

    const nextWeek = new Date( today );
    const currentDay = today.getDay();

    let daysToAdd = targetDay - currentDay;
    if ( daysToAdd <= 0 ) daysToAdd += 7;

    nextWeek.setDate( today.getDate() + daysToAdd );

    return nextWeek.toLocaleString( 'en-US', { timeZone: 'America/Argentina/Buenos_Aires' } );
  };

  const getTodayInBuenosAires = ( selectedDay?: DayOfWeek ) => {
    return new Date( getNextWeekday( selectedDay ) ).toISOString().split( 'T' )[ 0 ];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<LoanInputs>( {
    resolver: zodResolver( loanSchema ),
    defaultValues: {
      customerId,
      startDate: getTodayInBuenosAires(),
      account: allAccounts.length > 0 ? allAccounts[ 0 ].id : undefined
    }
  } );

  const amount = watch( 'amount' ) || 0;
  const interest = watch( 'interest' ) || 0;
  const installments = watch( 'installments' ) || 0;
  const paymentFrequency = watch( 'paymentFrequency' );
  const dueDays = watch( 'dueDays' );

  const formatNumber = ( value: number ): string => {
    return value.toLocaleString( 'es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    } );
  };

  const handleIntegerInput = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
    if (
      e.key === '.' ||
      e.key === ',' ||
      e.key === '-' ||
      e.key === '+' ||
      e.key === 'e' ||
      e.key === 'E'
    ) {
      e.preventDefault();
    }
  };

  useEffect( () => {
    let progressInterval: NodeJS.Timeout;

    if ( isSubmitting && !isSuccess ) {
      progressInterval = setInterval( () => {
        setProgress( prev => {
          if ( prev >= 100 ) {
            clearInterval( progressInterval );
            return 100;
          }
          return prev + 2;
        } );
      }, 20 );
    }

    return () => {
      if ( progressInterval ) clearInterval( progressInterval );
    };
  }, [ isSubmitting, isSuccess ] );

  useEffect( () => {
    const calculateInstallmentAmount = () => {
      if ( amount && interest && installments ) {
        const totalAmount = amount * ( 1 + interest / 100 );
        const installmentAmount = totalAmount / installments;
        setValue( 'installmentAmount', Number( installmentAmount.toFixed( 2 ) ) );
      }
    };

    calculateInstallmentAmount();
  }, [ amount, interest, installments, setValue ] );

  const totalAmount = amount * ( 1 + interest / 100 );
  const interestAmount = totalAmount - amount;

  useEffect( () => {
    if ( loan && id ) {
      const formattedStartDate = new Date( loan.startDate )
        .toISOString()
        .split( 'T' )[ 0 ];

      const paymentFrequency = loan.paymentFrequency as "DIARIO" | "SEMANAL" | "QUINCENAL" | "MENSUAL";
      const status = loan.status as "ACTIVO" | "TERMINADO" | "ATRASADO" | undefined;
      const dueDays = loan.dueDays as DayOfWeek | undefined;

      reset( {
        amount: loan.amount,
        customerId: loan.customer.id,
        dueDays,
        installmentAmount: loan.installmentAmount,
        installments: loan.installments,
        interest: loan.interest,
        paymentFrequency,
        startDate: formattedStartDate,
        status
      } );
    } else {
      setValue( 'customerId', customerId );
      setValue( 'startDate', getTodayInBuenosAires() );
    }
  }, [ loan, id, reset, customerId, setValue ] );

  const onSubmit = async ( data: LoanInputs ) => {
    setIsSubmitting( true );
    setProgress( 0 );

    try {
      if ( id ) {
        await loanUpdate( data, id );
        setIsSuccess( true );
        setTimeout( () => {
          setIsSubmitting( false );
          setIsSuccess( false );
          setProgress( 0 );
          onClose();
        }, 1000 );
      } else {
        const success = await addLoan( data );
        if ( success ) {
          reset();
          setIsSuccess( true );
          setTimeout( () => {
            setIsSubmitting( false );
            setIsSuccess( false );
            setProgress( 0 );
            onClose();
          }, 1000 );
        } else {
          setIsSubmitting( false );
          setIsSuccess( false );
          setProgress( 0 );
        }
      }
    } catch ( error ) {
      setIsSubmitting( false );
      setIsSuccess( false );
      setProgress( 0 );
    }
  };

  const handleModalOpen = () => {
    if ( !id ) {
      setValue( 'startDate', getTodayInBuenosAires() );
    }
    onOpen();
  };

  const handleDueDaysChange = ( e: React.ChangeEvent<HTMLSelectElement> ) => {
    const selectedDay = e.target.value as DayOfWeek;
    setValue( 'dueDays', selectedDay );
    setValue( 'startDate', getTodayInBuenosAires( selectedDay ) );
  };

  return (
    <div>
      <UI.Button
        startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> }
        onPress={ handleModalOpen }
        variant="bordered"
        color="success"
      >
        { id ? (
          <>
            <Icons.IoPencilOutline size={ 24 } /> Editar
          </>
        ) : (
          'Nuevo Préstamo'
        ) }
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ isSubmitting ? undefined : onOpenChange }
        backdrop="blur"
        isDismissable={ false }
        hideCloseButton={ isSubmitting }
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              { isSubmitting ? (
                <div className="relative flex flex-col items-center justify-center p-8 min-h-[200px] overflow-hidden">
                  { isSuccess ? (
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                      <div
                        className="absolute w-16 h-16 bg-green-500 rounded-full transform transition-transform duration-700 ease-out origin-center scale-[20]"
                      />
                      <div className="z-10 flex flex-col items-center space-y-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg text-green-500">
                          <Icons.IoCheckmarkOutline size={ 32 } />
                        </div>
                        <span className="text-white font-semibold tracking-wide uppercase">
                          { id ? 'PRÉSTAMO ACTUALIZADO' : 'PRÉSTAMO APROBADO' }
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
                      <div className="relative w-full h-14">
                        <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                            style={ {
                              width: `${ progress }%`
                            } }
                          />
                        </div>
                        <div
                          className="absolute inset-0 flex items-center justify-center text-base font-bold tracking-wide uppercase transition-colors duration-300"
                          style={ {
                            color: progress > 50 ? 'white' : 'black'
                          } }
                        >
                          { id ? 'ACTUALIZANDO PRÉSTAMO' : 'APROBANDO PRÉSTAMO' }
                        </div>
                      </div>
                    </div>
                  ) }
                </div>
              ) : (
                <form onSubmit={ handleSubmit( onSubmit ) }>
                  <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                    <div className="flex items-center space-x-2 font-bold text-2xl">
                      <Icons.IoCashOutline size={ 24 } className="text-gray-500" />
                      <h2>{ id ? 'Editar préstamo' : 'Nuevo préstamo' }</h2>
                    </div>
                  </UI.ModalHeader>

                  <UI.ModalBody>

                    <input
                      type="hidden"
                      { ...register( 'customerId' ) }
                    />

                    <UI.Select
                      label="Cuenta de origen del dinero"
                      placeholder="Seleccione una cuenta"
                      variant="bordered"
                      errorMessage={ errors.account?.message }
                      isInvalid={ !!errors.account }
                      defaultSelectedKeys={ allAccounts.length > 0 ? [ allAccounts[ 0 ].id ] : [] }
                      { ...register( 'account' ) }
                    >
                      { allAccounts.map( ( account ) => (
                        <UI.SelectItem key={ account.id } value={ account.id }>
                          { account.name }
                        </UI.SelectItem>
                      ) ) }
                    </UI.Select>

                    <UI.Input
                      type="number"
                      label="Monto"
                      placeholder="Ingrese el monto del préstamo"
                      variant="bordered"
                      errorMessage={ errors.amount?.message }
                      isInvalid={ !!errors.amount }
                      onKeyDown={ handleIntegerInput }
                      { ...register( 'amount', {
                        valueAsNumber: true,
                        onChange: ( e ) => {
                          e.target.value = e.target.value.replace( /[^\d]/, '' );
                        }
                      } ) }
                    />

                    <UI.Input
                      type="number"
                      label="Interés"
                      placeholder="Ingrese el interés del préstamo"
                      variant="bordered"
                      endContent={ <div className="pointer-events-none">%</div> }
                      errorMessage={ errors.interest?.message }
                      isInvalid={ !!errors.interest }
                      { ...register( 'interest', { valueAsNumber: true } ) }
                    />

                    <UI.Input
                      type="number"
                      label="Número de cuotas"
                      placeholder="Ingrese el número de cuotas"
                      variant="bordered"
                      errorMessage={ errors.installments?.message }
                      isInvalid={ !!errors.installments }
                      onKeyDown={ handleIntegerInput }
                      { ...register( 'installments', {
                        valueAsNumber: true,
                        onChange: ( e ) => {
                          e.target.value = e.target.value.replace( /[^\d]/, '' );
                        }
                      } ) }
                    />

                    { amount > 0 && interest > 0 && installments > 0 && (
                      <div className="space-y-3 p-6 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-base text-gray-700 flex justify-between items-center">
                          <span>Monto de cada cuota:</span>
                          <span className="font-semibold text-lg">$ { formatNumber( totalAmount / installments ) }</span>
                        </p>
                        <p className="text-base text-gray-700 flex justify-between items-center">
                          <span>Total a pagar:</span>
                          <span className="font-semibold text-lg">$ { formatNumber( totalAmount ) }</span>
                        </p>
                        <p className="text-base text-gray-700 flex justify-between items-center">
                          <span>Ganancia por intereses:</span>
                          <span className="font-semibold text-lg">$ { formatNumber( interestAmount ) }</span>
                        </p>
                      </div>
                    ) }

                    <input
                      type="hidden"
                      { ...register( 'installmentAmount', { valueAsNumber: true } ) }
                    />

                    <UI.Select
                      label="Frecuencia de pago"
                      placeholder="Seleccione la frecuencia de pago"
                      variant="bordered"
                      errorMessage={ errors.paymentFrequency?.message }
                      isInvalid={ !!errors.paymentFrequency }
                      { ...register( 'paymentFrequency' ) }
                    >
                      <UI.SelectItem key="DIARIO" value="DIARIO">Diario</UI.SelectItem>
                      <UI.SelectItem key="SEMANAL" value="SEMANAL">Semanal</UI.SelectItem>
                      <UI.SelectItem key="QUINCENAL" value="QUINCENAL">Quincenal</UI.SelectItem>
                      <UI.SelectItem key="MENSUAL" value="MENSUAL">Mensual</UI.SelectItem>
                    </UI.Select>

                    { paymentFrequency && paymentFrequency !== 'DIARIO' && (
                      <UI.Select
                        label="Día de cobro"
                        placeholder="Seleccione el día para realizar el cobro"
                        variant="bordered"
                        errorMessage={ errors.dueDays?.message }
                        isInvalid={ !!errors.dueDays }
                        onChange={ handleDueDaysChange }
                        value={ dueDays }
                      >
                        <UI.SelectItem key="LUNES" value="LUNES">Lunes</UI.SelectItem>
                        <UI.SelectItem key="MARTES" value="MARTES">Martes</UI.SelectItem>
                        <UI.SelectItem key="MIERCOLES" value="MIERCOLES">Miércoles</UI.SelectItem>
                        <UI.SelectItem key="JUEVES" value="JUEVES">Jueves</UI.SelectItem>
                        <UI.SelectItem key="VIERNES" value="VIERNES">Viernes</UI.SelectItem>
                      </UI.Select>
                    ) }

                    <UI.Input
                      type="date"
                      label="Fecha de inicio"
                      placeholder="Seleccione la fecha de inicio"
                      variant="bordered"
                      errorMessage={ errors.startDate?.message }
                      isInvalid={ !!errors.startDate }
                      { ...register( 'startDate' ) }
                    />
                    { id && (
                      <UI.Select
                        label="Estado"
                        placeholder="Seleccione el estado del préstamo"
                        variant="bordered"
                        errorMessage={ errors.status?.message }
                        isInvalid={ !!errors.status }
                        defaultSelectedKeys={ loan?.status ? [ loan.status ] : undefined }
                        { ...register( 'status' ) }
                      >
                        <UI.SelectItem key="ACTIVO" value="ACTIVO">Activo</UI.SelectItem>
                        <UI.SelectItem key="TERMINADO" value="TERMINADO">Terminado</UI.SelectItem>
                        <UI.SelectItem key="ATRASADO" value="ATRASADO">Atrasado</UI.SelectItem>
                      </UI.Select>
                    ) }
                  </UI.ModalBody>

                  <UI.ModalFooter className="flex justify-center space-x-2">
                    <UI.Button
                      color="danger"
                      variant="light"
                      onPress={ onClose }
                      startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                    >
                      Cancelar
                    </UI.Button>

                    <UI.Button
                      color="primary"
                      type="submit"
                      startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                      className="min-w-[120px] transition-all duration-500"
                    >
                      Guardar
                    </UI.Button>
                  </UI.ModalFooter>
                </form>
              ) }
            </>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};