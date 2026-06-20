import { Router } from 'express';
import { verificarWebhook, recibirEvento } from '../webhooks/whatsapp.webhook';

const router = Router();

router.get('/whatsapp', verificarWebhook);
router.post('/whatsapp', recibirEvento);

export default router;
