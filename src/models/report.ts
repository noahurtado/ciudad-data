import { Schema, model } from 'mongoose';

const ReportSchema = new Schema({
  type: { type: String, required: true, enum: ['bache', 'iluminacion', 'transporte', 'otro'] },
  description: { type: String, required: true, maxlength: 1000 },
  city: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export type Report = {
  type: string;
  description: string;
  city: string;
  location: { lat: number; lon: number };
  createdAt?: Date;
};

export const ReportModel = model<Report>('Report', ReportSchema);
