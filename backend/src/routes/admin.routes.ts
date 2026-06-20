import { Router, Response, NextFunction } from 'express';
import { verificarToken, soloAdmin } from '../middlewares/autenticacion';
import { RequestAutenticado } from '../types';
import { Usuario } from '../models/Usuario';
import { responderExito } from '../utils/respuesta';
import { ErrorPersonalizado } from '../middlewares/manejoErrores';

const router = Router();

router.get(
  '/pacientes',
  verificarToken,
  soloAdmin,
  async (req: RequestAutenticado, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.pagina as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limite as string, 10) || 20, 100);
      const skip = (page - 1) * limit;
      const search = req.query.busqueda as string;

      const query: any = { rol: 'PACIENTE' };

      if (search) {
        query.$or = [
          { nombreCompleto: { $regex: search, $options: 'i' } },
          { correoElectronico: { $regex: search, $options: 'i' } },
          { documentoIdentidad: { $regex: search, $options: 'i' } },
        ];
      }

      const [pacientes, total] = await Promise.all([
        Usuario.find(query).sort({ creadoEn: -1 }).skip(skip).limit(limit).select('-contrasena'),
        Usuario.countDocuments(query),
      ]);

      responderExito(res, {
        pacientes,
        total,
        pagina: page,
        limite: limit,
        paginas: Math.ceil(total / limit),
      }, 'Pacientes obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/pacientes/:id',
  verificarToken,
  soloAdmin,
  async (req: RequestAutenticado, res: Response, next: NextFunction) => {
    try {
      const paciente = await Usuario.findById(req.params.id).select('-contrasena');
      if (!paciente || paciente.rol !== 'PACIENTE') {
        throw new ErrorPersonalizado('Paciente no encontrado', 404);
      }
      responderExito(res, paciente, 'Paciente obtenido correctamente');
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/pacientes/:id/activo',
  verificarToken,
  soloAdmin,
  async (req: RequestAutenticado, res: Response, next: NextFunction) => {
    try {
      const activo = Boolean(req.body.activo);
      const paciente = await Usuario.findOneAndUpdate(
        { _id: req.params.id, rol: 'PACIENTE' },
        { activo },
        { new: true }
      ).select('-contrasena');
      if (!paciente) throw new ErrorPersonalizado('Paciente no encontrado', 404);
      responderExito(res, paciente, activo ? 'Paciente activado' : 'Paciente desactivado');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
