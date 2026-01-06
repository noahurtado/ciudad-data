import axios from 'axios';
import { HttpError } from '../middlewares/error.js';

const WHO_BASE = 'https://ghoapi.azureedge.net/api';

// Esperanza de vida al nacer (último año)
export async function getLifeExpectancy(countryCode: string) {
  const indicatorCode = 'WHOSIS_000001'; 
  const url = `${WHO_BASE}/${indicatorCode}?$filter=SpatialDim eq '${countryCode}'`;

  const { data } = await axios.get(url);
  if (!data.value || data.value.length === 0) {
    throw new HttpError(404, 'No life expectancy data found');
  }

  const latest = data.value.sort((a: any, b: any) => b.TimeDim - a.TimeDim)[0];

  return {
    indicator: latest.IndicatorName,
    country: latest.SpatialDim,
    year: latest.TimeDim,
    value: latest.Value
  };
}

// Mortalidad infantil (último año)
export async function getInfantMortality(countryCode: string) {
  const indicatorCode = 'WHOSIS_000015';
  const url = `${WHO_BASE}/${indicatorCode}?$filter=SpatialDim eq '${countryCode}'`;

  const { data } = await axios.get(url);
  if (!data.value || data.value.length === 0) {
    throw new HttpError(404, 'No infant mortality data found');
  }

  const latest = data.value.sort((a: any, b: any) => b.TimeDim - a.TimeDim)[0];

  return {
    indicator: latest.IndicatorName,
    country: latest.SpatialDim,
    year: latest.TimeDim,
    value: latest.Value
  };
}
