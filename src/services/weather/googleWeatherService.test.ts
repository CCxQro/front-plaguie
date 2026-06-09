import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/googleWeatherClient', () => ({
  googleWeatherClient: { get: vi.fn() },
}));

import { googleWeatherClient } from '../http/googleWeatherClient';
import { fetchWeatherForLocation } from './googleWeatherService';

const get = vi.mocked(googleWeatherClient.get);

function response(type: string) {
  return {
    data: {
      weatherCondition: { type, description: { text: 'Despejado' } },
      temperature: { degrees: 24.6 },
      relativeHumidity: 60,
      wind: { speed: { value: 12.3 } },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('googleWeatherService', () => {
  it('maps the flat Google response and rounds temperature/wind', async () => {
    get.mockResolvedValueOnce(response('CLEAR'));
    const result = await fetchWeatherForLocation('c1', 'Cliente 1', 20.1, -103.2);

    expect(get).toHaveBeenCalledWith('/currentConditions:lookup', {
      params: { 'location.latitude': 20.1, 'location.longitude': -103.2 },
    });
    expect(result).toMatchObject({
      clientId: 'c1',
      clientName: 'Cliente 1',
      temperature: 25,
      humidity: 60,
      windSpeed: 12,
      icon: 'sun',
    });
  });

  it.each([
    ['THUNDERSTORM', 'storm'],
    ['LIGHT_RAIN', 'rain'],
    ['SNOW', 'rain'],
    ['CLOUDY', 'cloud'],
    ['FOG', 'cloud'],
    ['CLEAR', 'sun'],
  ])('maps condition %s to icon %s', async (type, icon) => {
    get.mockResolvedValueOnce(response(type));
    const result = await fetchWeatherForLocation('c', 'n', 0, 0);
    expect(result.icon).toBe(icon);
  });
});
