import mongoose from 'mongoose';
import { env } from './config/env.js';
import { createApp } from './app.js';

(async () => {
  await mongoose.connect(env.MONGO_URI);
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`CiudadData listening on port ${env.PORT}`);
  });
})();
