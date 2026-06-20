import { Router } from 'express';
import * as tratamientoController from '../controllers/tratamiento.controller';
import { verificarToken, soloAdmin } from '../middlewares/autenticacion';
import { validar } from '../middlewares/validar';
import {
  esquemaCrearTratamiento,
  esquemaActualizarTratamiento,
} from '../validations/tratamiento';

const router = Router();

router.get('/', tratamientoController.listar);
router.get('/:id', tratamientoController.obtener);

router.post('/', verificarToken, soloAdmin, validar(esquemaCrearTratamiento), tratamientoController.crear);
router.patch('/:id', verificarToken, soloAdmin, validar(esquemaActualizarTratamiento), tratamientoController.actualizar);
router.delete('/:id', verificarToken, soloAdmin, tratamientoController.eliminar);

export default router;
