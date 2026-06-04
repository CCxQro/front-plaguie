import { useQuery } from '@tanstack/react-query';
import { getSalesSummary, type SalesSummaryResponse } from '../services/sales/salesSummaryService';

export const useSalesSummary = (startDate?: string, endDate?: string) => {
  return useQuery<SalesSummaryResponse, Error>({
    queryKey: ['sales-summary', startDate, endDate],
    queryFn: () => getSalesSummary(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};
