import { Request } from 'express';
import { Types } from 'mongoose';

export type RolUsuario = 'ADMIN' | 'PACIENTE';

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA' | 'NO_ASISTIO';

export interface PayloadJWT {
  id: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}

export interface RequestAutenticado extends Request {
  usuario?: PayloadJWT;
}

export interface RespuestaAPI<T = unknown> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  errores?: string[];
}

export interface ConfiguracionClinica {
  direccion: string;
  enlaceGoogleMaps: string;
  plantillaMensaje: string;
}

export interface DatosJobWhatsApp {
  citaId: Types.ObjectId | string;
  numeroWhatsApp: string;
  nombrePaciente: string;
  nombreTratamiento: string;
  fecha: string;
  hora: string;
  mensajeDirecto?: string;           // si se define, omite la plantilla y envía este texto
  actualizarCita?: boolean;          // default true — controla si actualiza mensajeWhatsAppEnviado
  verificarCitaConfirmada?: boolean; // si true, omite si la cita ya no está CONFIRMADA
}
