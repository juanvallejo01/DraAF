import { z } from 'zod';

export const esquemaCrearTratamiento = z.object({
  nombre: z
    .string({ required_error: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  descripcion: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .trim(),
  duracionMinutos: z
    .number({ required_error: 'La duración en minutos es requerida' })
    .int('La duración debe ser un número entero')
    .min(15, 'La duración mínima es 15 minutos')
    .max(480, 'La duración máxima es 480 minutos'),
  imagen: z.string().url('URL de imagen inválida').optional(),
});

export const esquemaActualizarTratamiento = esquemaCrearTratamiento.partial().extend({
  activo: z.boolean().optional(),
});

export type DatosCrearTratamiento = z.infer<typeof esquemaCrearTratamiento>;
export type DatosActualizarTratamiento = z.infer<typeof esquemaActualizarTratamiento>;
