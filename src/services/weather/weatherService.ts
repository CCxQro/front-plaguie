export interface WeatherRegion {
  id: string;
  name: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: 'sun' | 'cloud' | 'rain' | 'storm';
}

export interface WeatherAlert {
  id: string;
  region: string;
  title: string;
  description: string;
  icon: 'rain';
}

export interface WeatherData {
  timestamp: string;
  regions: WeatherRegion[];
  alerts: WeatherAlert[];
}

/**
 * Mock weather service - replace with real API calls later
 * TODO: Replace with actual API endpoint using apiFetch from src/services/api.ts
 */
export const weatherService = {
  /**
   * Fetch weather data for all regions
   * @returns Promise with weather regions and alerts
   */
  async getWeatherData(): Promise<WeatherData> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timestamp: new Date().toISOString(),
          regions: [
            {
              id: 'norte',
              name: 'Región Norte',
              condition: 'Soleado',
              temperature: 28,
              humidity: 45,
              windSpeed: 12,
              icon: 'sun',
            },
            {
              id: 'centro',
              name: 'Región Centro',
              condition: 'Parcialmente Nublado',
              temperature: 22,
              humidity: 60,
              windSpeed: 8,
              icon: 'cloud',
            },
            {
              id: 'sur',
              name: 'Región Sur',
              condition: 'Lluvioso',
              temperature: 18,
              humidity: 85,
              windSpeed: 15,
              icon: 'rain',
            },
            {
              id: 'este',
              name: 'Región Este',
              condition: 'Despejado',
              temperature: 25,
              humidity: 50,
              windSpeed: 10,
              icon: 'sun',
            },
            {
              id: 'oeste',
              name: 'Región Oeste',
              condition: 'Nublado',
              temperature: 20,
              humidity: 70,
              windSpeed: 18,
              icon: 'cloud',
            },
            {
              id: 'noroeste',
              name: 'Región Noroeste',
              condition: 'Tormentas aisladas',
              temperature: 19,
              humidity: 88,
              windSpeed: 22,
              icon: 'storm',
            },
            {
              id: 'noreste',
              name: 'Región Noreste',
              condition: 'Soleado',
              temperature: 31,
              humidity: 38,
              windSpeed: 9,
              icon: 'sun',
            },
            {
              id: 'centro-norte',
              name: 'Centro Norte',
              condition: 'Parcialmente nublado',
              temperature: 24,
              humidity: 58,
              windSpeed: 11,
              icon: 'cloud',
            },
            {
              id: 'centro-sur',
              name: 'Centro Sur',
              condition: 'Lluvia ligera',
              temperature: 21,
              humidity: 76,
              windSpeed: 14,
              icon: 'rain',
            },
            {
              id: 'suroeste',
              name: 'Región Suroeste',
              condition: 'Nublado con llovizna',
              temperature: 17,
              humidity: 81,
              windSpeed: 17,
              icon: 'rain',
            },
            {
              id: 'sureste',
              name: 'Región Sureste',
              condition: 'Despejado',
              temperature: 29,
              humidity: 42,
              windSpeed: 7,
              icon: 'sun',
            },
          ],
          alerts: [
            {
              id: 'alert-sur',
              region: 'Sur',
              title: 'Alerta de Precipitaciones (Sur)',
              description:
                'Se recomienda reprogramar los servicios de fumigación exterior en la Región Sur para las próximas 48 horas debido a lluvias intensas.',
              icon: 'rain',
            },
            {
              id: 'alert-noroeste',
              region: 'Noroeste',
              title: 'Tormentas eléctricas en Noroeste',
              description:
                'Se recomienda evitar aplicaciones en campo abierto durante la tarde. Hay probabilidad alta de tormentas aisladas y rachas fuertes de viento.',
              icon: 'rain',
            },
            {
              id: 'alert-centro-sur',
              region: 'Centro Sur',
              title: 'Humedad elevada en Centro Sur',
              description:
                'Las condiciones de humedad pueden afectar el secado de tratamientos. Considere ventanas de aplicación más amplias y seguimiento posterior.',
              icon: 'rain',
            },
          ],
        });
      }, 300);
    });
  },

  /**
   * Refresh weather data
   * This is the same as getWeatherData but can be extended
   * to support more specific parameters later
   */
  async refreshWeatherData(): Promise<WeatherData> {
    return this.getWeatherData();
  },
};
