import { backendClient } from '../http/backendClient';

export interface BackendStatus {
  status: 'UP' | 'DOWN';
  database: 'UP' | 'DOWN';
  service: string;
  timestamp: string;
}

export async function fetchStatus(): Promise<BackendStatus> {
  const { data } = await backendClient.get<BackendStatus>('/api/status');
  return data;
}
