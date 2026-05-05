import { useQueries } from '@tanstack/react-query';
import { useClientLocations } from './useClientLocations';
import { fetchWeatherForLocation } from '../services/weather/googleWeatherService';
import type { LocationWeather } from '../services/weather/googleWeatherService';

export type { LocationWeather };

export interface WeatherDataState {
  locations: LocationWeather[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export function useWeatherData(): WeatherDataState {
  const { data: clientLocations = [], isLoading: locationsLoading, isError: locationsError } = useClientLocations();

  const weatherQueries = useQueries({
    queries: clientLocations.map((loc) => ({
      queryKey: ['weather', loc.lat, loc.lng],
      queryFn: () => fetchWeatherForLocation(loc.clientId, loc.clientName, loc.lat, loc.lng),
      staleTime: 10 * 60 * 1000,
      enabled: clientLocations.length > 0,
    })),
  });

  const isWeatherLoading = weatherQueries.some((q) => q.isLoading);
  const isWeatherError = weatherQueries.some((q) => q.isError);
  const failedQuery = weatherQueries.find((q) => q.isError);

  const locations = weatherQueries
    .map((q) => q.data)
    .filter((d): d is LocationWeather => d !== undefined);

  return {
    locations,
    isLoading: locationsLoading || isWeatherLoading,
    isError: locationsError || isWeatherError,
    errorMessage: isWeatherError
      ? (failedQuery?.error instanceof Error ? failedQuery.error.message : 'Error al cargar clima')
      : locationsError
      ? 'Error al cargar ubicaciones de clientes'
      : null,
  };
}
