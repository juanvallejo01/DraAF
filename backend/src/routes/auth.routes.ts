import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verificarToken } from '../middlewares/autenticacion';
import { validar } from '../middlewares/validar';
import { esquemaRegistro, esquemaInicioSesion, esquemaActualizarPerfil, esquemaOlvidePassword, esquemaRestablecerPassword } from '../validations/auth';

const router = Router();

router.post('/registro', validar(esquemaRegistro), authController.registrar);
router.post('/sesion', validar(esquemaInicioSesion), authController.iniciarSesion);
router.get('/perfil', verificarToken, authController.perfil);
router.patch('/perfil', verificarToken, validar(esquemaActualizarPerfil), authController.actualizarPerfil);
router.post('/olvide-password', validar(esquemaOlvidePassword), authController.olvidePassword);
router.post('/restablecer-password', validar(esquemaRestablecerPassword), authController.restablecerPassword);

export default router;
