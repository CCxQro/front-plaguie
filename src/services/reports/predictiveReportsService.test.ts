import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: {
    get: vi.fn(),
  },
}));

import { backendClient } from '../http/backendClient';
import {
  buildReportFilename,
  downloadPredictiveReportExcel,
  downloadPredictiveReportPdf,
  fetchPredictiveReport,
} from './predictiveReportsService';

const mockedGet = vi.mocked(backendClient.get);

describe('predictiveReportsService', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  describe('fetchPredictiveReport', () => {
    it('calls backend with the correct path and params', async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          region: 'Jalisco',
          season: 'Verano',
          generatedAt: '2026-06-15T10:30:00',
          observationsAnalyzed: 25,
          executiveSummary: 'resumen',
          predictions: [],
        },
      });

      const result = await fetchPredictiveReport({ region: 'Jalisco', season: 'verano' });

      expect(mockedGet).toHaveBeenCalledWith('/api/reports/plagas/predictivo', {
        params: { region: 'Jalisco', temporada: 'verano' },
      });
      expect(result.region).toBe('Jalisco');
      expect(result.observationsAnalyzed).toBe(25);
    });
  });

  describe('downloadPredictiveReportPdf', () => {
    it('requests blob response on PDF endpoint', async () => {
      const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      mockedGet.mockResolvedValueOnce({ data: blob });

      const result = await downloadPredictiveReportPdf({ region: 'Sonora', season: 'invierno' });

      expect(mockedGet).toHaveBeenCalledWith('/api/reports/plagas/predictivo/export/pdf', {
        params: { region: 'Sonora', temporada: 'invierno' },
        responseType: 'blob',
      });
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('downloadPredictiveReportExcel', () => {
    it('requests blob response on Excel endpoint', async () => {
      const blob = new Blob(['PK'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      mockedGet.mockResolvedValueOnce({ data: blob });

      const result = await downloadPredictiveReportExcel({ region: 'Nuevo Leon', season: 'otono' });

      expect(mockedGet).toHaveBeenCalledWith('/api/reports/plagas/predictivo/export/excel', {
        params: { region: 'Nuevo Leon', temporada: 'otono' },
        responseType: 'blob',
      });
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('buildReportFilename', () => {
    it('produces a slugified filename with extension', () => {
      const name = buildReportFilename({ region: 'Nuevo León!', season: 'verano' }, 'pdf');
      expect(name).toBe('reporte-predictivo-plagas-nuevo-leon-verano.pdf');
    });

    it('falls back to default region label when input is unsafe', () => {
      const name = buildReportFilename({ region: '!!!', season: 'invierno' }, 'xlsx');
      expect(name).toBe('reporte-predictivo-plagas-reporte-invierno.xlsx');
    });
  });
});
