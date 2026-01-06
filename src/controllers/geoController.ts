import type { Request, Response, NextFunction } from 'express';
import { getCityGeo, getCountryPopulation } from '../services/geoService.js';
import { ReportModel } from '../models/report.js';
import { HttpError } from '../middlewares/error.js';

export async function cityHandler(req: Request, res: Response, next: NextFunction) {
  try { const data = await getCityGeo(req.params.city); res.json(data); }
  catch (e) { next(e); }
}

export async function populationHandler(req: Request, res: Response, next: NextFunction) {
  try { const data = await getCountryPopulation(req.params.country); res.json(data); }
  catch (e) { next(e); }
}

export async function reportCreate(req: Request, res: Response, next: NextFunction) {
  try { const doc = await ReportModel.create(req.body); res.status(201).json({ id: doc._id, ...doc.toObject() }); }
  catch (e) { next(e); }
}

export async function reportList(_req: Request, res: Response, next: NextFunction) {
  try { const docs = await ReportModel.find().sort({ createdAt: -1 }); res.json(docs); }
  catch (e) { next(e); }
}

export async function reportGet(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await ReportModel.findById(req.params.id);
    if (!doc) throw new HttpError(404, 'Report not found');
    res.json(doc);
  } catch (e) { next(e); }
}

export async function reportUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await ReportModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) throw new HttpError(404, 'Report not found');
    res.json(doc);
  } catch (e) { next(e); }
}

export async function reportDelete(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await ReportModel.findByIdAndDelete(req.params.id);
    if (!doc) throw new HttpError(404, 'Report not found');
    res.status(204).send();
  } catch (e) { next(e); }
}
