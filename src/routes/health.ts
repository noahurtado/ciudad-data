import { Router } from 'express';
import { getLifeExpectancy, getInfantMortality } from '../services/healthService.js';

const router = Router();

// Esperanza de vida
router.get('/life-expectancy/:country', async (req, res, next) => {
  try {
    const { country } = req.params;
    const result = await getLifeExpectancy(country);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Mortalidad infantil
router.get('/infant-mortality/:country', async (req, res, next) => {
  try {
    const { country } = req.params;
    const result = await getInfantMortality(country);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
