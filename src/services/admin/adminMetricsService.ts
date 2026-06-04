import { backendClient } from '../http/backendClient';

export interface AdminMetrics {
  totalUsers: number;
  newUsersThisWeek: number;
  totalProducts: number;
  pendingValidations: number;
  totalSurveillanceRecords: number;
  recordsThisMonth: number;
  totalOrders: number;
  ordersThisWeek: number;
}

export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  // Use backend client which injects Authorization Bearer token
  const response = await backendClient.get<AdminMetrics>('/api/admin/metrics');
  return response.data;
};
