import { z } from 'zod';

export const esquemaRegistro = z.object({
  nombreCompleto: z
    .string({ required_error: 'El nombre completo es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  documentoIdentidad: z
    .string({ required_error: 'El documento de identidad es requerido' })
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .trim(),
  correoElectronico: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido')
    .toLowerCase()
    .trim(),
  numeroWhatsApp: z
    .string({ required_error: 'El número de WhatsApp es requerido' })
    .min(7, 'El número de WhatsApp debe tener al menos 7 dígitos')
    .trim(),
  contrasena: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const esquemaInicioSesion = z.object({
  correoElectronico: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido')
    .toLowerCase()
    .trim(),
  contrasena: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña es requerida'),
});

export const esquemaActualizarPerfil = z.object({
  nombreCompleto: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100)
    .trim()
    .optional(),
  numeroWhatsApp: z
    .string()
    .min(7, 'El número de WhatsApp debe tener al menos 7 dígitos')
    .trim()
    .optional(),
  contrasenaActual: z.string().optional(),
  contrasenaNueva: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').optional(),
}).refine(
  (d) => {
    if (d.contrasenaNueva && !d.contrasenaActual) return false;
    if (d.contrasenaActual && !d.contrasenaNueva) return false;
    return true;
  },
  { message: 'Para cambiar la contraseña debes proporcionar la contraseña actual y la nueva' }
);

export const esquemaOlvidePassword = z.object({
  correoElectronico: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido')
    .toLowerCase()
    .trim(),
});

export const esquemaRestablecerPassword = z.object({
  correoElectronico: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido')
    .toLowerCase()
    .trim(),
  codigo: z.string().length(6, 'El código debe tener 6 dígitos'),
  contrasenaNueva: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
});

export type DatosRegistro = z.infer<typeof esquemaRegistro>;
export type DatosInicioSesion = z.infer<typeof esquemaInicioSesion>;
export type DatosActualizarPerfil = z.infer<typeof esquemaActualizarPerfil>;
export type DatosOlvidePassword = z.infer<typeof esquemaOlvidePassword>;
export type DatosRestablecerPassword = z.infer<typeof esquemaRestablecerPassword>;
