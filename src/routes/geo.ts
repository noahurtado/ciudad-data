import { Router } from 'express';
import {
  cityHandler, populationHandler,
  reportCreate, reportList, reportGet, reportUpdate, reportDelete
} from '../controllers/geoController.js';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate.js';

export const router = Router();

router.get('/city/:city', cityHandler);
router.get('/population/:country', populationHandler);

const ReportSchema = z.object({
  type: z.enum(['bache', 'iluminacion', 'transporte', 'otro']),
  description: z.string().min(5).max(1000),
  city: z.string().min(2),
  location: z.object({ lat: z.number(), lon: z.number() })
});

router.post('/report', validateBody(ReportSchema), reportCreate);
router.get('/report', reportList);
router.get('/report/:id', reportGet);
router.put('/report/:id', validateBody(ReportSchema.partial()), reportUpdate);
router.delete('/report/:id', reportDelete);

