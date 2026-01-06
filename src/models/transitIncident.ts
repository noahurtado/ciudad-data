import { Schema, model } from 'mongoose';

const TransitIncidentSchema = new Schema({
  line: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

export type TransitIncident = {
  line: string;
  city: string;
  description: string;
  createdAt?: Date;
};

export const TransitIncidentModel = model<TransitIncident>('TransitIncident', TransitIncidentSchema);
