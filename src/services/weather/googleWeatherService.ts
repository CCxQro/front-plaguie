import { googleWeatherClient } from '../http/googleWeatherClient';

// ─── Google API response types (flat — no currentConditions wrapper) ──────────

interface GoogleWeatherResponse {
  weatherCondition: {
    type: string;
    description: { text: string };
  };
  temperature: { degrees: number };
  relativeHumidity: number;
  wind: { speed: { value: number } };
}

// ─── Internal shape used by the app ───────────────────────────────────────────

export type WeatherIconType = 'sun' | 'cloud' | 'rain' | 'storm';

export interface LocationWeather {
  clientId: string;
  clientName: string;
  lat: number;
  lng: number;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: WeatherIconType;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function conditionTypeToIcon(type: string): WeatherIconType {
  const t = type.toUpperCase();
  if (t.includes('THUNDER') || t.includes('STORM')) return 'storm';
  if (t.includes('RAIN') || t.includes('DRIZZLE') || t.includes('SHOWER') || t.includes('SNOW')) return 'rain';
  if (t.includes('CLOUD') || t.includes('OVERCAST') || t.includes('FOG') || t.includes('HAZY')) return 'cloud';
  return 'sun';
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function fetchWeatherForLocation(
  clientId: string,
  clientName: string,
  lat: number,
  lng: number,
): Promise<LocationWeather> {
  const { data } = await googleWeatherClient.get<GoogleWeatherResponse>(
    '/currentConditions:lookup',
    { params: { 'location.latitude': lat, 'location.longitude': lng } },
  );

  return {
    clientId,
    clientName,
    lat,
    lng,
    condition: data.weatherCondition.description.text,
    temperature: Math.round(data.temperature.degrees),
    humidity: data.relativeHumidity,
    windSpeed: Math.round(data.wind.speed.value),
    icon: conditionTypeToIcon(data.weatherCondition.type),
  };
}
