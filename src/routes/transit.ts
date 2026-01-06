import { Router } from 'express';
import {
  routesHandler, etaHandler,
  incidentCreate, incidentList, incidentGet, incidentUpdate, incidentDelete
} from '../controllers/transitController.js';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate.js';

export const router = Router();

router.get('/routes/:city', routesHandler);
router.get('/eta', etaHandler);

const IncidentSchema = z.object({
  line: z.string().min(1),
  city: z.string().min(2),
  description: z.string().min(5).max(1000)
});

router.post('/incident', validateBody(IncidentSchema), incidentCreate);
router.get('/incident', incidentList);
router.get('/incident/:id', incidentGet);
router.put('/incident/:id', validateBody(IncidentSchema.partial()), incidentUpdate);
router.delete('/incident/:id', incidentDelete);

