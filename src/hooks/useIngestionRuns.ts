import { useQuery } from '@tanstack/react-query';
import { getIngestionRuns, IngestionRunResponseDto } from '../services/ingestion/ingestionService';

export const useIngestionRuns = () => {
  return useQuery<IngestionRunResponseDto[]>({
    queryKey: ['ingestion-runs'],
    queryFn: getIngestionRuns,
    staleTime: 1000 * 60, // 1 minute
  });
};
