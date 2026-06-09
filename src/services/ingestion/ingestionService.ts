import { backendClient } from '../http/backendClient';

export interface IngestionFileResponseDto {
  id: number;
  sourceUrl: string;
  filename: string;
  status: string;
  rowsTotal: number;
  rowsInserted: number;
  rowsSkipped: number;
  error?: string;
  createdAt: string;
}

export interface IngestionRunResponseDto {
  id: number;
  startedAt: string;
  finishedAt: string;
  status: string;
  filesFound: number;
  filesProcessed: number;
  files: IngestionFileResponseDto[];
}

export interface IngestionProgressEvent {
  runId: number;
  filename: string;
  processed: number;
  total: number;
  status: string;
}

export const getIngestionRuns = async (): Promise<IngestionRunResponseDto[]> => {
  const { data } = await backendClient.get<IngestionRunResponseDto[]>('/api/ingestion/runs');
  return data;
};

export const uploadIngestionFile = async (file: File): Promise<{status: string; message: string}> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Note: let the browser set the Content-Type boundary for multipart/form-data
  const { data } = await backendClient.post('/api/ingestion/upload', formData);
  return data;
};
