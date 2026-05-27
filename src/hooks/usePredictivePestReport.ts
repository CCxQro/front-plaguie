import { useQuery } from '@tanstack/react-query';
import { fetchPredictiveReport } from '../services/reports/predictiveReportsService';
import type {
  PredictivePestReport,
  PredictiveReportQuery,
} from '../types/PredictiveReport';

export function usePredictivePestReport(query: PredictiveReportQuery | null) {
  return useQuery<PredictivePestReport>({
    queryKey: ['predictive-report', query?.region, query?.season],
    queryFn: () => fetchPredictiveReport(query as PredictiveReportQuery),
    enabled: Boolean(query?.region && query?.season),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
