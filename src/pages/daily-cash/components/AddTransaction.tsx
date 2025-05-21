import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { transactionSchema, TransactionInputs } from '../validators';
import { UI } from '../../../shared';
import { useAccounts } from '../../clients';
import { useAddTransaction, useTransactionsCodes } from '../hooks';

interface Props {
  dailyCashId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransaction = ( { dailyCashId, isOpen, onClose }: Props ) => {
  const { transactionsCodes } = useTransactionsCodes();
  const { createTransaction } = useAddTransaction();
  const { allAccounts } = useAccounts();

  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<TransactionInputs>( {
    resolver: zodResolver( transactionSchema ),
    defaultValues: {
      dailyCashId,
      accountId: allAccounts?.[ 0 ]?.id || '',
      transactionCodeId: transactionsCodes?.[ 0 ]?.id || '',
      description: transactionsCodes?.[ 0 ]?.name || ''
    }
  } );

  useEffect( () => {
    if ( transactionsCodes && allAccounts ) {
      setValue( 'accountId', allAccounts[ 0 ]?.id || '' );
      setValue( 'transactionCodeId', transactionsCodes[ 0 ]?.id || '' );
      setValue( 'description', transactionsCodes[ 0 ]?.name || '' );
    }
  }, [ transactionsCodes, allAccounts, setValue ] );

  const onSubmit = ( data: TransactionInputs ) => {
    createTransaction( data );
    reset();
    onClose();
  };

  return (
    <UI.Modal isOpen={ isOpen } onClose={ onClose }>
      <UI.ModalContent>
        <form onSubmit={ handleSubmit( onSubmit ) }>
          <UI.ModalHeader>
            <h2 className="text-xl font-bold">Nueva Transacción</h2>
          </UI.ModalHeader>

          <UI.ModalBody>
            <div className="space-y-4">
              <UI.Input
                type="number"
                label="Monto"
                { ...register( 'amount', {
                  valueAsNumber: true,
                  onChange: ( e ) => {
                    e.target.value = e.target.value.replace( /[^0-9]/g, '' );
                  }
                } ) }
                errorMessage={ errors.amount?.message }
                isInvalid={ !!errors.amount }
              />

              <Controller
                name="transactionCodeId"
                control={ control }
                render={ ( { field } ) => (
                  <UI.Select
                    label="Código de Transacción"
                    defaultSelectedKeys={ [ transactionsCodes?.[ 0 ]?.id || '' ] }
                    onChange={ ( e ) => {
                      field.onChange( e.target.value );
                      const selectedCode = transactionsCodes?.find( code => code.id === e.target.value );
                      if ( selectedCode ) {
                        setValue( 'description', selectedCode.name );
                      }
                    } }
                    value={ field.value }
                    errorMessage={ errors.transactionCodeId?.message }
                    isInvalid={ !!errors.transactionCodeId }
                  >
                    { ( transactionsCodes || [] ).map( ( code ) => (
                      <UI.SelectItem key={ code.id } value={ code.id }>
                        { code.name }
                      </UI.SelectItem>
                    ) ) }
                  </UI.Select>
                ) }
              />

              <UI.Select
                label="Cuenta"
                defaultSelectedKeys={ [ allAccounts?.[ 0 ]?.id || '' ] }
                { ...register( 'accountId' ) }
                errorMessage={ errors.accountId?.message }
                isInvalid={ !!errors.accountId }
              >
                { ( allAccounts || [] ).map( ( account ) => (
                  <UI.SelectItem key={ account.id } value={ account.id }>
                    { account.name }
                  </UI.SelectItem>
                ) ) }
              </UI.Select>

              <input
                type="hidden"
                { ...register( 'dailyCashId' ) }
              />

              <UI.Textarea
                label="Descripción"
                { ...register( 'description' ) }
                errorMessage={ errors.description?.message }
                isInvalid={ !!errors.description }
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
              type="submit"
              color="primary"
            >
              Crear Transacción
            </UI.Button>
          </UI.ModalFooter>
        </form>
      </UI.ModalContent>
    </UI.Modal>
  );
};