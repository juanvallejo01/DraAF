import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { RolUsuario } from '../types';

export interface IUsuario extends Document {
  _id: Types.ObjectId;
  nombreCompleto: string;
  documentoIdentidad: string;
  correoElectronico: string;
  numeroWhatsApp: string;
  contrasena: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  codigoRecuperacion?: string;
  expiracionCodigoRecuperacion?: Date;
  compararContrasena(contrasenaIngresada: string): Promise<boolean>;
}

const esquemaUsuario = new Schema<IUsuario>(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    documentoIdentidad: {
      type: String,
      required: [true, 'El documento de identidad es requerido'],
      unique: true,
      trim: true,
    },
    correoElectronico: {
      type: String,
      required: [true, 'El correo electrónico es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo electrónico inválido'],
    },
    numeroWhatsApp: {
      type: String,
      required: [true, 'El número de WhatsApp es requerido'],
      trim: true,
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      enum: ['ADMIN', 'PACIENTE'],
      default: 'PACIENTE',
    },
    activo: {
      type: Boolean,
      default: true,
    },
    codigoRecuperacion: { type: String, select: false },
    expiracionCodigoRecuperacion: { type: Date, select: false },
  },
  {
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
    versionKey: false,
  }
);

esquemaUsuario.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next();
  this.contrasena = await bcrypt.hash(this.contrasena, 12);
  next();
});

esquemaUsuario.methods.compararContrasena = async function (
  contrasenaIngresada: string
): Promise<boolean> {
  return bcrypt.compare(contrasenaIngresada, this.contrasena);
};

export const Usuario = model<IUsuario>('Usuario', esquemaUsuario);
