import { Request, Response } from 'express';
import { env } from '../config/env';
import crypto from 'crypto';

export const verificarWebhook = (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.whatsapp.verifyToken) {
    console.log('✅ Webhook de WhatsApp verificado');
    res.status(200).send(challenge);
    return;
  }

  res.status(403).json({ mensaje: 'Verificación fallida' });
};

export const recibirEvento = (req: Request & { rawBody?: Buffer }, res: Response): void => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const rawBody = req.rawBody;

  if (env.whatsapp.appSecret && signature && rawBody) {
    const signatureHash = signature.split('=')[1];
    const expectedHash = crypto.createHmac('sha256', env.whatsapp.appSecret).update(rawBody).digest('hex');
    
    if (signatureHash !== expectedHash) {
      console.warn('⚠️ Firma SHA256 inválida en webhook de WhatsApp');
      res.status(403).json({ mensaje: 'Firma inválida' });
      return;
    }
  }

  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach((entrada: Record<string, unknown>) => {
      const cambios = (entrada.changes as Array<Record<string, unknown>>) ?? [];
      cambios.forEach((cambio) => {
        const valor = cambio.value as Record<string, unknown>;
        const mensajes = (valor?.messages as Array<Record<string, unknown>>) ?? [];
        mensajes.forEach((mensaje) => {
          console.log('📨 Mensaje entrante WhatsApp:', mensaje);
        });
      });
    });

    res.status(200).send('EVENT_RECEIVED');
    return;
  }

  res.sendStatus(404);
};
