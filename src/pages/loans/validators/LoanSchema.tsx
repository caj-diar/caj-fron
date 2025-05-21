import { z } from 'zod';

const accountValidation = z.string().uuid( {
  message: "El ID de la cuenta debe ser un UUID válido."
} );

const amountValidation = z.number().positive( {
  message: "El monto debe ser un número positivo."
} );

const customerIdValidation = z.string().uuid( {
  message: "El ID del cliente debe ser un UUID válido."
} );

const dueDaysValidation = z.enum( [ 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO' ], {
  errorMap: () => ( { message: "Debe seleccionar un día válido de la semana." } )
} ).optional();

const installmentAmountValidation = z.number().positive( {
  message: "El monto de la cuota debe ser un número positivo."
} );

const installmentsValidation = z.number().int().positive( {
  message: "El número de cuotas debe ser un número entero positivo."
} );

const interestValidation = z.number().positive( {
  message: "El interés debe ser un número positivo."
} );

const paymentFrequencyValidation = z.enum( [ 'DIARIO', 'SEMANAL', 'QUINCENAL', 'MENSUAL' ], {
  errorMap: () => ( { message: "La frecuencia de pago debe ser DIARIO, SEMANAL, QUINCENAL o MENSUAL." } )
} );

const startDateValidation = z.string().regex( /^\d{4}-\d{2}-\d{2}$/, {
  message: "La fecha debe tener el formato YYYY-MM-DD."
} );

const statusValidation = z.enum( [ 'ACTIVO', 'TERMINADO', 'ATRASADO' ], {
  errorMap: () => ( { message: "El estado debe ser ACTIVO, TERMINADO o ATRASADO." } )
} ).optional();

export const loanSchema = z.object( {
  account: accountValidation,
  amount: amountValidation,
  customerId: customerIdValidation,
  dueDays: dueDaysValidation,
  installmentAmount: installmentAmountValidation,
  installments: installmentsValidation,
  interest: interestValidation,
  paymentFrequency: paymentFrequencyValidation,
  startDate: startDateValidation,
  status: statusValidation
} ).refine(
  ( data ) => {
    if ( data.paymentFrequency === 'DIARIO' ) {
      return true;
    }
    return !!data.dueDays;
  },
  {
    message: "Debe seleccionar un día de cobro para frecuencias semanales, quincenales o mensuales",
    path: [ "dueDays" ]
  }
);

export type LoanInputs = z.infer<typeof loanSchema>;