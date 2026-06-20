import { z } from 'zod';

export const esquemaWhatsApp = z.object({
  idInstancia: z.string().min(1, 'El ID de la instancia es requerido').optional(),
  token: z.string().min(1, 'El token es requerido').optional(),
  numeroWhatsApp: z.string().min(7, 'El número debe tener al menos 7 dígitos').optional(),
  activo: z.boolean().optional(),
});

export const esquemaHorarios = z.object({
  lunesViernes: z.object({
    inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
    fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
  }),
  sabado: z.object({
    inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
    fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm'),
  }),
  duracionSlotMinutos: z.number().min(10).max(120),
});

export const esquemaFechaBloqueada = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
});

export const esquemaPoliticaCancelacion = z.object({
  horasMinimas: z.number().min(0, 'Las horas mínimas no pueden ser negativas'),
});

export const esquemaRecordatorio = z.object({
  horasRecordatorio: z.number().min(1, 'Debe ser al menos 1 hora'),
});
