import { Schema, model, Document, Types } from 'mongoose';

export interface ITratamiento extends Document {
  _id: Types.ObjectId;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  imagen?: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

const esquemaTratamiento = new Schema<ITratamiento>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tratamiento es requerido'],
      trim: true,
      unique: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción del tratamiento es requerida'],
      trim: true,
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },
    duracionMinutos: {
      type: Number,
      required: [true, 'La duración en minutos es requerida'],
      min: [15, 'La duración mínima es 15 minutos'],
      max: [480, 'La duración máxima es 480 minutos'],
    },
    imagen: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    versionKey: false,
  }
);

export const Tratamiento = model<ITratamiento>('Tratamiento', esquemaTratamiento);
