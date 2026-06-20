import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { manejarErrores, manejarRutaNoEncontrada } from './middlewares/manejoErrores';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import tratamientoRoutes from './routes/tratamiento.routes';
import citaRoutes from './routes/cita.routes';
import configuracionRoutes from './routes/configuracion.routes';
import webhookRoutes from './routes/webhook.routes';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { exito: false, mensaje: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { exito: false, mensaje: 'Demasiados intentos de autenticación. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/webhooks', express.json({ verify: (req, _res, buf) => {
  (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
}}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (env.entorno !== 'test') {
  app.use(morgan(env.entorno === 'development' ? 'dev' : 'combined'));
}

app.use('/api', limitadorGeneral);

app.get('/api/salud', (_req, res) => {
  res.json({ exito: true, mensaje: 'DraAF API funcionando correctamente', version: '1.0.0' });
});

app.use('/api/auth', limitadorAuth, authRoutes);
app.use('/api/auth/admin', adminRoutes);
app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use(manejarRutaNoEncontrada);
app.use(manejarErrores);

export default app;
