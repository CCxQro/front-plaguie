import { backendClient } from '../http/backendClient';

export interface SalesSummaryMetrics {
  totalEarnings: number;
  remainingInventory: number;
  totalOrders: number;
  newClients: number;
  earningsTrend: string;
  inventoryTrend: string;
  ordersTrend: string;
  clientsTrend: string;
}

export interface InventoryAlert {
  id: string;
  product: string;
  sku: string;
  category: string;
  stock: number;
  lastSaleDate: string;
  status: 'Crítico' | 'Bajo' | 'Normal';
}

export interface SalesSummaryResponse {
  metrics: SalesSummaryMetrics;
  inventoryAlerts: InventoryAlert[];
  salesChartData: { date: string; amount: number }[];
}

export const getSalesSummary = async (startDate?: string, endDate?: string): Promise<SalesSummaryResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await backendClient.get<SalesSummaryResponse>(`/api/sales/summary?${params.toString()}`);
  return response.data;
};
