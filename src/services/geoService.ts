import axios from 'axios';
import { env, CACHE_TTL } from '../config/env.js';
import { getCache, setCache } from '../utils/cache.js';
import { HttpError } from '../middlewares/error.js';

export async function getCityGeo(city: string) {
  const key = `geo:city:${city.toLowerCase()}`;
  const cached = getCache<any>(key);
  if (cached) return cached;

  const url = `http://api.geonames.org/searchJSON?name=${encodeURIComponent(city)}&maxRows=1&username=${env.GEONAMES_USERNAME}`;
  const { data } = await axios.get(url);
  if (!data?.geonames?.length) throw new HttpError(404, 'City not found');
  const g = data.geonames[0];
  const result = { city: g.name, country: g.countryName, lat: Number(g.lat), lon: Number(g.lng) };
  setCache(key, result, CACHE_TTL);
  return result;
}

export async function getCountryPopulation(countryCode: string) {
  const key = `geo:pop:${countryCode.toUpperCase()}`;
  const cached = getCache<any>(key);
  if (cached) return cached;

  const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`;
  const { data } = await axios.get(url);
  const series = Array.isArray(data) ? data[1] : null;
  if (!series?.length) throw new HttpError(404, 'Population data not found');
  const latest = series.find((x: any) => x.value != null) ?? series[0];
  const result = {
    countryCode: countryCode.toUpperCase(),
    indicator: 'SP.POP.TOTL',
    year: latest.date,
    value: latest.value
  };
  setCache(key, result, CACHE_TTL);
  return result;
}
