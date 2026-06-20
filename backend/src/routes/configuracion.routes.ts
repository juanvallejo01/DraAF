import { Router } from 'express';
import * as configuracionController from '../controllers/configuracion.controller';
import { verificarToken, soloAdmin } from '../middlewares/autenticacion';
import { validar } from '../middlewares/validar';
import {
  esquemaWhatsApp,
  esquemaHorarios,
  esquemaFechaBloqueada,
  esquemaPoliticaCancelacion,
  esquemaRecordatorio
} from '../validations/configuracion';

const router = Router();

router.get('/whatsapp', verificarToken, soloAdmin, configuracionController.obtenerWhatsApp);
router.patch('/whatsapp', verificarToken, soloAdmin, validar(esquemaWhatsApp), configuracionController.actualizarWhatsApp);

// Contacto público (landing page)
router.get('/contacto', configuracionController.obtenerContactoPublico);

// Horarios públicos (sin auth) para el formulario de reserva
router.get('/horarios', configuracionController.obtenerHorarios);
router.patch('/horarios', verificarToken, soloAdmin, validar(esquemaHorarios), configuracionController.actualizarHorarios);

// Fechas bloqueadas — GET público para el calendario de reservas
router.get('/fechas-bloqueadas', configuracionController.listarFechasBloqueadas);
router.post('/fechas-bloqueadas', verificarToken, soloAdmin, validar(esquemaFechaBloqueada), configuracionController.agregarFecha);
router.delete('/fechas-bloqueadas/:fecha', verificarToken, soloAdmin, configuracionController.eliminarFecha);

// Política de cancelación — GET público para mostrársela al paciente
router.get('/cancelacion', configuracionController.obtenerPoliticaCancelacion);
router.patch('/cancelacion', verificarToken, soloAdmin, validar(esquemaPoliticaCancelacion), configuracionController.actualizarPoliticaCancelacion);

// Recordatorio automático
router.get('/recordatorio', verificarToken, soloAdmin, configuracionController.obtenerConfiguracionRecordatorio);
router.patch('/recordatorio', verificarToken, soloAdmin, validar(esquemaRecordatorio), configuracionController.actualizarConfiguracionRecordatorio);


export default router;
