import { z } from 'zod';


const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const esquemaCrearCita = z.object({
  tratamiento: z
    .string({ required_error: 'El tratamiento es requerido' })
    .regex(/^[a-f\d]{24}$/i, 'ID de tratamiento inválido'),
  fecha: z
    .string({ required_error: 'La fecha es requerida' })
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  horaInicio: z
    .string({ required_error: 'La hora de inicio es requerida' })
    .regex(REGEX_HORA, 'Formato de hora inválido (HH:MM)'),
  notasPaciente: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

export const esquemaActualizarEstadoCita = z.object({
  estado: z.enum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO'], {
    required_error: 'El estado es requerido',
    invalid_type_error: 'Estado inválido',
  }),
  notasAdmin: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

export const esquemaCrearCitaAdmin = z.object({
  pacienteId: z
    .string({ required_error: 'El paciente es requerido' })
    .regex(/^[a-f\d]{24}$/i, 'ID de paciente inválido'),
  tratamiento: z
    .string({ required_error: 'El tratamiento es requerido' })
    .regex(/^[a-f\d]{24}$/i, 'ID de tratamiento inválido'),
  fecha: z
    .string({ required_error: 'La fecha es requerida' })
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  horaInicio: z
    .string({ required_error: 'La hora de inicio es requerida' })
    .regex(REGEX_HORA, 'Formato de hora inválido (HH:MM)'),
  notasPaciente: z.string().max(500).optional(),
  confirmarInmediatamente: z.boolean().optional().default(false),
});

export type DatosCrearCita = z.infer<typeof esquemaCrearCita>;
export type DatosActualizarEstadoCita = z.infer<typeof esquemaActualizarEstadoCita>;
export type DatosCrearCitaAdmin = z.infer<typeof esquemaCrearCitaAdmin>;
