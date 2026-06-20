import { Usuario } from '../models/Usuario';
import { generarToken } from '../utils/jwt';
import { ErrorPersonalizado } from '../middlewares/manejoErrores';
import { DatosRegistro, DatosInicioSesion, DatosActualizarPerfil, DatosOlvidePassword, DatosRestablecerPassword } from '../validations/auth';
import { encolarMensajeWhatsApp } from '../queues/whatsapp';

export const registrarPaciente = async (datos: DatosRegistro) => {
  const existeCorreo = await Usuario.findOne({ correoElectronico: datos.correoElectronico });
  if (existeCorreo) {
    throw new ErrorPersonalizado('Ya existe una cuenta con este correo electrónico', 409);
  }

  const existeDocumento = await Usuario.findOne({ documentoIdentidad: datos.documentoIdentidad });
  if (existeDocumento) {
    throw new ErrorPersonalizado('Ya existe una cuenta con este documento de identidad', 409);
  }

  const usuario = await Usuario.create({ ...datos, rol: 'PACIENTE' });

  const token = generarToken({ id: usuario._id.toString(), rol: usuario.rol });

  return {
    token,
    usuario: {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      correoElectronico: usuario.correoElectronico,
      numeroWhatsApp: usuario.numeroWhatsApp,
      rol: usuario.rol,
    },
  };
};

export const iniciarSesion = async (datos: DatosInicioSesion) => {
  const usuario = await Usuario.findOne({ correoElectronico: datos.correoElectronico }).select(
    '+contrasena'
  );

  if (!usuario || !(await usuario.compararContrasena(datos.contrasena))) {
    throw new ErrorPersonalizado('Correo electrónico o contraseña incorrectos', 401);
  }

  if (!usuario.activo) {
    throw new ErrorPersonalizado('Tu cuenta ha sido desactivada. Contacta al administrador', 403);
  }

  const token = generarToken({ id: usuario._id.toString(), rol: usuario.rol });

  return {
    token,
    usuario: {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      correoElectronico: usuario.correoElectronico,
      numeroWhatsApp: usuario.numeroWhatsApp,
      rol: usuario.rol,
    },
  };
};

export const obtenerPerfil = async (usuarioId: string) => {
  const usuario = await Usuario.findById(usuarioId);
  if (!usuario) throw new ErrorPersonalizado('Usuario no encontrado', 404);
  return usuario;
};

export const actualizarPerfil = async (usuarioId: string, datos: DatosActualizarPerfil) => {
  const usuario = await Usuario.findById(usuarioId).select('+contrasena');
  if (!usuario) throw new ErrorPersonalizado('Usuario no encontrado', 404);

  if (datos.nombreCompleto) usuario.nombreCompleto = datos.nombreCompleto;
  if (datos.numeroWhatsApp) usuario.numeroWhatsApp = datos.numeroWhatsApp;

  if (datos.contrasenaActual && datos.contrasenaNueva) {
    const valida = await usuario.compararContrasena(datos.contrasenaActual);
    if (!valida) {
      throw new ErrorPersonalizado('La contraseña actual es incorrecta', 400);
    }
    usuario.contrasena = datos.contrasenaNueva;
  }

  await usuario.save();

  return {
    id: usuario._id,
    nombreCompleto: usuario.nombreCompleto,
    correoElectronico: usuario.correoElectronico,
    numeroWhatsApp: usuario.numeroWhatsApp,
    rol: usuario.rol,
  };
};

export const generarCodigoRecuperacion = async (datos: DatosOlvidePassword) => {
  const usuario = await Usuario.findOne({ correoElectronico: datos.correoElectronico });
  if (!usuario) return;
  
  if (!usuario.activo) {
    throw new ErrorPersonalizado('Tu cuenta ha sido desactivada.', 403);
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  usuario.codigoRecuperacion = codigo;
  const expiracion = new Date();
  expiracion.setMinutes(expiracion.getMinutes() + 15);
  usuario.expiracionCodigoRecuperacion = expiracion;
  await usuario.save();

  await encolarMensajeWhatsApp({
    citaId: usuario._id.toString(),
    numeroWhatsApp: usuario.numeroWhatsApp,
    nombrePaciente: usuario.nombreCompleto,
    nombreTratamiento: 'Recuperación de contraseña',
    fecha: new Date().toISOString(),
    hora: '00:00',
    mensajeDirecto: `🔐 *Código de recuperación*\n\nHola ${usuario.nombreCompleto}, tu código para restablecer la contraseña es:\n\n*${codigo}*\n\nEste código expira en 15 minutos. Si no lo solicitaste, ignora este mensaje.`,
    actualizarCita: false,
  });
};

export const restablecerPasswordConCodigo = async (datos: DatosRestablecerPassword) => {
  const usuario = await Usuario.findOne({ correoElectronico: datos.correoElectronico }).select('+codigoRecuperacion +expiracionCodigoRecuperacion +contrasena');
  
  if (!usuario) throw new ErrorPersonalizado('Código o correo electrónico inválido', 400);

  if (!usuario.codigoRecuperacion || usuario.codigoRecuperacion !== datos.codigo) {
    throw new ErrorPersonalizado('Código inválido o incorrecto', 400);
  }

  if (!usuario.expiracionCodigoRecuperacion || usuario.expiracionCodigoRecuperacion < new Date()) {
    throw new ErrorPersonalizado('El código ha expirado', 400);
  }

  usuario.contrasena = datos.contrasenaNueva;
  usuario.codigoRecuperacion = undefined;
  usuario.expiracionCodigoRecuperacion = undefined;
  await usuario.save();
};
