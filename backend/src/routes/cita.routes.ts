import { Router } from 'express';
import * as citaController from '../controllers/cita.controller';
import { verificarToken, soloAdmin } from '../middlewares/autenticacion';
import { validar } from '../middlewares/validar';
import { esquemaCrearCita, esquemaActualizarEstadoCita, esquemaCrearCitaAdmin } from '../validations/cita';

const router = Router();

router.get('/disponibilidad', verificarToken, citaController.disponibilidad);
router.get('/mis-citas', verificarToken, citaController.misciTAS);
router.post('/', verificarToken, validar(esquemaCrearCita), citaController.crear);
router.patch('/:id/cancelar', verificarToken, citaController.cancelar);

router.post('/admin', verificarToken, soloAdmin, validar(esquemaCrearCitaAdmin), citaController.crearAdmin);
router.get('/admin/todas', verificarToken, soloAdmin, citaController.listarAdmin);
router.get('/admin/dashboard', verificarToken, soloAdmin, citaController.dashboard);
router.get('/admin/resumen-mes', verificarToken, soloAdmin, citaController.resumenMes);
router.get('/admin/conteo-pendientes', verificarToken, soloAdmin, citaController.conteoPendientes);
router.get('/admin/:id', verificarToken, soloAdmin, citaController.obtener);
router.patch('/admin/:id/estado', verificarToken, soloAdmin, validar(esquemaActualizarEstadoCita), citaController.actualizarEstado);
router.patch('/admin/:id/notas', verificarToken, soloAdmin, citaController.actualizarNotas);

export default router;
