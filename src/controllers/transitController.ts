import type { Request, Response, NextFunction } from 'express';
import { getRoutesByCity, getEta } from '../services/transitService.js';
import { TransitIncidentModel } from '../models/transitIncident.js';
import { HttpError } from '../middlewares/error.js';

export async function routesHandler(req: Request, res: Response, next: NextFunction) {
  try { const data = await getRoutesByCity(req.params.city); res.json(data); }
  catch (e) { next(e); }
}

export async function etaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { stop_id } = req.query;
    if (!stop_id || typeof stop_id !== 'string') return res.status(400).json({ error: { message: 'stop_id required' } });
    const data = await getEta(stop_id); res.json(data);
  } catch (e) { next(e); }
}

export async function incidentCreate(req: Request, res: Response, next: NextFunction) {
  try { const doc = await TransitIncidentModel.create(req.body); res.status(201).json({ id: doc._id, ...doc.toObject() }); }
  catch (e) { next(e); }
}

export async function incidentList(_req: Request, res: Response, next: NextFunction) {
  try { const docs = await TransitIncidentModel.find().sort({ createdAt: -1 }); res.json(docs); }
  catch (e) { next(e); }
}

export async function incidentGet(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await TransitIncidentModel.findById(req.params.id);
    if (!doc) throw new HttpError(404, 'Incident not found');
    res.json(doc);
  } catch (e) { next(e); }
}

export async function incidentUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await TransitIncidentModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) throw new HttpError(404, 'Incident not found');
    res.json(doc);
  } catch (e) { next(e); }
}

export async function incidentDelete(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await TransitIncidentModel.findByIdAndDelete(req.params.id);
    if (!doc) throw new HttpError(404, 'Incident not found');
    res.status(204).send();
  } catch (e) { next(e); }
}
