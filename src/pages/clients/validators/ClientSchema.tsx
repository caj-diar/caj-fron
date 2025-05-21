import { z } from 'zod';


const nameValidation = z.string().min(1, {
  message: "El nombre del cliente es obligatorio."
});

const lastNameValidation = z.string().min(1, {
  message: "El apellido del cliente es obligatorio."
});

const phoneNumbersValidation = z.array(z.string().min(1, {
  message: "Cada número de teléfono es obligatorio."
}));

const addressesValidation = z.array(z.string().min(1, {
  message: "Cada dirección es obligatoria."
}));

const descriptionValidation = z.string().optional();

const documentationValidation = z.array(z.any());

const dniValidation = z.string().min(1, {
  message: "El DNI del cliente es obligatorio."
});

const localityIdValidation = z.string().min(1, {
  message: "El ID de la localidad es obligatorio."
});


export const clientSchema = z.object({
  addresses:     addressesValidation,
  description:   descriptionValidation,
  dni:           dniValidation,
  documentation: documentationValidation,
  lastName:      lastNameValidation,
  localityId:    localityIdValidation,
  name:          nameValidation,
  phoneNumbers:  phoneNumbersValidation
});


export type ClientInputs = z.infer<typeof clientSchema>;