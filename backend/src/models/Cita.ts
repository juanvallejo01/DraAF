import { Schema, model, Document, Types } from 'mongoose';
import { EstadoCita } from '../types';

export interface ICita extends Document {
  _id: Types.ObjectId;
  paciente: Types.ObjectId;
  tratamiento: Types.ObjectId;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: EstadoCita;
  notasPaciente?: string;
  notasAdmin?: string;
  mensajeWhatsAppEnviado: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  historialEstados?: {
    estado: EstadoCita;
    fecha: Date;
    notas?: string;
  }[];
}

const esquemaCita = new Schema<ICita>(
  {
    paciente: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El paciente es requerido'],
    },
    tratamiento: {
      type: Schema.Types.ObjectId,
      ref: 'Tratamiento',
      required: [true, 'El tratamiento es requerido'],
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha de la cita es requerida'],
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es requerida'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es requerida'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'],
    },
    estado: {
      type: String,
      enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO'],
      default: 'PENDIENTE',
    },
    notasPaciente: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
    },
    notasAdmin: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas del administrador no pueden exceder 500 caracteres'],
    },
    mensajeWhatsAppEnviado: {
      type: Boolean,
      default: false,
    },
    historialEstados: [
      {
        estado: { type: String, required: true },
        fecha: { type: Date, default: Date.now },
        notas: { type: String },
      }
    ],
  },
  {
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    versionKey: false,
  }
);

esquemaCita.index({ paciente: 1, fecha: 1 });
esquemaCita.index({ fecha: 1, estado: 1 });
esquemaCita.index({ tratamiento: 1, fecha: 1 });

export const Cita = model<ICita>('Cita', esquemaCita);
