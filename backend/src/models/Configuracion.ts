import { Schema, model, Document } from 'mongoose';

export interface IConfiguracion extends Document {
  clave: string;
  valor: string;
  descripcion?: string;
  actualizadoEn: Date;
}

const esquemaConfiguracion = new Schema<IConfiguracion>(
  {
    clave: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    valor: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { updatedAt: 'actualizadoEn' },
    versionKey: false,
  }
);

export const Configuracion = model<IConfiguracion>('Configuracion', esquemaConfiguracion);
