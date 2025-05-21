import { useEffect, useState } from 'react';

import { UI } from '../../../shared';
import { useEditPaymentSchedule } from '../hooks';

interface EditInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: {
    id: string;
    amount: number;
    paymentDate: string;
    installmentNumber: number;
  };
}

export const EditInstallmentModal = ( { isOpen, onClose, schedule }: EditInstallmentModalProps ) => {
  const [ amount, setAmount ] = useState<string>( '' );
  const [ paymentDate, setPaymentDate ] = useState<string>( '' );
  const [ percentage, setPercentage ] = useState<string>( '' );
  const { paymentSchedule, isPending } = useEditPaymentSchedule();

  useEffect( () => {
    if ( schedule ) {
      setAmount( schedule.amount.toString() );
      const [ day, month, year ] = schedule.paymentDate.split( '/' );
      setPaymentDate( `${ year }-${ month.padStart( 2, '0' ) }-${ day.padStart( 2, '0' ) }` );
      setPercentage( '' );
    }
  }, [ schedule ] );

  const handlePercentageChange = ( value: string ) => {
    setPercentage( value );
    if ( schedule && value ) {
      const increase = ( Number( schedule.amount ) * Number( value ) ) / 100;
      const newAmount = ( Number( schedule.amount ) + increase ).toString();
      setAmount( newAmount );
    } else {
      setAmount( schedule?.amount.toString() || '' );
    }
  };

  const handleAmountChange = ( value: string ) => {
    setAmount( value );
    if ( schedule && value ) {
      const percentageChange = ( ( Number( value ) - Number( schedule.amount ) ) / Number( schedule.amount ) ) * 100;
      setPercentage( percentageChange.toFixed( 2 ) );
    } else {
      setPercentage( '' );
    }
  };

  const formatDateToAPI = ( dateStr: string ): string => {
    const [ year, month, day ] = dateStr.split( '-' );
    return `${ day }/${ month }/${ year }`;
  };

  const handleSave = async () => {
    if ( schedule && amount && paymentDate ) {
      try {
        await paymentSchedule(
          {
            amount: Number( amount ),
            paymentDate: formatDateToAPI( paymentDate )
          },
          schedule.id
        );
        onClose();
      } catch ( error ) {
        console.error( 'Error al guardar los cambios:', error );
      }
    }
  };

  return (
    <UI.Modal
      isOpen={ isOpen }
      onClose={ onClose }
      placement="center"
    >
      <UI.ModalContent>
        { ( onClose ) => (
          <>
            <UI.ModalHeader className="flex flex-col gap-1">
              Editar Cuota { schedule?.installmentNumber }
            </UI.ModalHeader>
            <UI.ModalBody>
              <div className="flex flex-col gap-4">
                <UI.Input
                  type="date"
                  label="Fecha de pago"
                  value={ paymentDate }
                  onChange={ ( e ) => setPaymentDate( e.target.value ) }
                />
                <UI.Input
                  type="text"
                  label="Monto de la cuota"
                  value={ amount }
                  onChange={ ( e ) => handleAmountChange( e.target.value ) }
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  onKeyDown={ ( e ) => {
                    const allowedKeys = [
                      'Backspace',
                      'Delete',
                      'ArrowLeft',
                      'ArrowRight',
                      'Tab',
                      '.',
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
                <UI.Input
                  type="text"
                  label="Porcentaje de aumento"
                  value={ percentage }
                  onChange={ ( e ) => handlePercentageChange( e.target.value ) }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">%</span>
                    </div>
                  }
                  onKeyDown={ ( e ) => {
                    const allowedKeys = [
                      'Backspace',
                      'Delete',
                      'ArrowLeft',
                      'ArrowRight',
                      'Tab',
                      '.',
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
              </div>
            </UI.ModalBody>
            <UI.ModalFooter>
              <UI.Button
                color="danger"
                variant="light"
                onPress={ onClose }
              >
                Cancelar
              </UI.Button>
              <UI.Button
                color="primary"
                onPress={ handleSave }
                isLoading={ isPending }
              >
                Guardar
              </UI.Button>
            </UI.ModalFooter>
          </>
        ) }
      </UI.ModalContent>
    </UI.Modal>
  );
};