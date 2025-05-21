import { z } from 'zod';

const amountValidation = z.number().int({
  message: "El monto debe ser un número entero"
}).positive({
  message: "El monto de la transacción debe ser un número positivo"
});

const accountIdValidation = z.string().min(1, {
  message: "Debe seleccionar una cuenta"
});

const dailyCashIdValidation = z.string().min(1, {
  message: "El ID de la caja diaria es obligatorio"
});

const transactionCodeIdValidation = z.string().min(1, {
  message: "Debe seleccionar un código de transacción"
});

const descriptionValidation = z.string().min(1, {
  message: "La descripción de la transacción es obligatoria"
});

export const transactionSchema = z.object({
  amount:            amountValidation,
  accountId:         accountIdValidation,
  dailyCashId:       dailyCashIdValidation,
  transactionCodeId: transactionCodeIdValidation,
  description:       descriptionValidation
});

export type TransactionInputs = z.infer<typeof transactionSchema>;