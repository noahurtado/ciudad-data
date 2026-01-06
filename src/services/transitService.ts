import axios from 'axios';
import { getCache, setCache } from '../utils/cache.js';
import { CACHE_TTL, env } from '../config/env.js';
import { HttpError } from '../middlewares/error.js';

export async function getRoutesByCity(city: string) {
  const key = `transit:routes:${city.toLowerCase()}`;
  const cached = getCache<any>(key);
  if (cached) return cached;

  // Si la ciudad es Londres, usar TfL
  if (city.toLowerCase() === 'london') {
    if (!env.TFL_APP_KEY) throw new HttpError(500, 'TFL_APP_KEY not configured');

    const url = `https://api.tfl.gov.uk/Line/Mode/bus,tube?app_key=${env.TFL_APP_KEY}`;
    const { data } = await axios.get(url);

    const routes = data.map((line: any) => ({
      id: line.id,
      name: line.name,
      mode: line.modeName,
      city: 'London'
    }));

    setCache(key, routes, CACHE_TTL);
    return routes;
  }

  // Simulación para otras ciudades
  const routes = [
    { id: 'bus-1', name: 'Línea Bus Centro', city },
    { id: 'metro-a', name: 'Metro Línea A', city }
  ];
  setCache(key, routes, CACHE_TTL);
  return routes;
}

export async function getEta(stopId: string) {
  const key = `transit:eta:${stopId}`;
  const cached = getCache<any>(key);
  if (cached) return cached;

  if (!env.TFL_APP_KEY) {
    // Simulación si no hay clave
    const eta = { stopId, nextArrivalMinutes: Math.floor(Math.random() * 8) + 2 };
    setCache(key, eta, 30);
    return eta;
  }

  // Llamada real a TfL
  const url = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${env.TFL_APP_KEY}`;
  const { data } = await axios.get(url);

  if (!data || data.length === 0) throw new HttpError(404, 'No ETA data found');

  const next = data[0];
  const eta = {
    stopId,
    line: next.lineName,
    destination: next.destinationName,
    expectedArrival: next.expectedArrival
  };

  setCache(key, eta, 30);
  return eta;
}
