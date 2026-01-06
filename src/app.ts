import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { router as geoRouter } from './routes/geo.js';
import { router as transitRouter } from './routes/transit.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middlewares/error.js';
import swaggerDoc from './config/swagger.js';
import fs from 'fs';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Swagger 
  const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8')); 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/geo', geoRouter);
  app.use('/transit', transitRouter);
  app.use('/health', healthRoutes);

  app.use(errorHandler);
  return app;
}
