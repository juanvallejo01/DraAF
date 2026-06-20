import { Tratamiento } from '../models/Tratamiento';
import { ErrorPersonalizado } from '../middlewares/manejoErrores';
import {
  DatosCrearTratamiento,
  DatosActualizarTratamiento,
} from '../validations/tratamiento';

export const listarTratamientos = async (soloActivos = true) => {
  const filtro = soloActivos ? { activo: true } : {};
  return Tratamiento.find(filtro).sort({ nombre: 1 });
};

export const obtenerTratamiento = async (id: string) => {
  const tratamiento = await Tratamiento.findById(id);
  if (!tratamiento) throw new ErrorPersonalizado('Tratamiento no encontrado', 404);
  return tratamiento;
};

export const crearTratamiento = async (datos: DatosCrearTratamiento) => {
  const existe = await Tratamiento.findOne({ nombre: datos.nombre });
  if (existe) throw new ErrorPersonalizado('Ya existe un tratamiento con este nombre', 409);
  return Tratamiento.create(datos);
};

export const actualizarTratamiento = async (
  id: string,
  datos: DatosActualizarTratamiento
) => {
  const tratamiento = await Tratamiento.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
  if (!tratamiento) throw new ErrorPersonalizado('Tratamiento no encontrado', 404);
  return tratamiento;
};

export const eliminarTratamiento = async (id: string) => {
  const tratamiento = await Tratamiento.findByIdAndUpdate(
    id,
    { activo: false },
    { new: true }
  );
  if (!tratamiento) throw new ErrorPersonalizado('Tratamiento no encontrado', 404);
  return tratamiento;
};
