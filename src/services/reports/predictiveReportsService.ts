import { backendClient } from '../http/backendClient';
import type {
  PredictiveReportQuery,
  PredictivePestReport,
} from '../../types/PredictiveReport';

const BASE_PATH = '/api/reports/plagas/predictivo';

function buildParams({ region, season }: PredictiveReportQuery) {
  return { region, temporada: season };
}

export async function fetchPredictiveReport(
  query: PredictiveReportQuery,
): Promise<PredictivePestReport> {
  const { data } = await backendClient.get<PredictivePestReport>(BASE_PATH, {
    params: buildParams(query),
  });
  return data;
}

export async function downloadPredictiveReportPdf(
  query: PredictiveReportQuery,
): Promise<Blob> {
  const { data } = await backendClient.get<Blob>(`${BASE_PATH}/export/pdf`, {
    params: buildParams(query),
    responseType: 'blob',
  });
  return data;
}

export async function downloadPredictiveReportExcel(
  query: PredictiveReportQuery,
): Promise<Blob> {
  const { data } = await backendClient.get<Blob>(`${BASE_PATH}/export/excel`, {
    params: buildParams(query),
    responseType: 'blob',
  });
  return data;
}

export function buildReportFilename(
  query: PredictiveReportQuery,
  extension: 'pdf' | 'xlsx',
): string {
  const safe = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'reporte';
  return `reporte-predictivo-plagas-${safe(query.region)}-${safe(query.season)}.${extension}`;
}
