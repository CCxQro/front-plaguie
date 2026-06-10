import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../../services/reports/predictiveReportsService', () => ({
  fetchPredictiveReport: vi.fn(),
  downloadPredictiveReportPdf: vi.fn(),
  downloadPredictiveReportExcel: vi.fn(),
  buildReportFilename: vi.fn(() => 'reporte.pdf'),
}));

import {
  fetchPredictiveReport,
  downloadPredictiveReportExcel,
  downloadPredictiveReportPdf,
} from '../../services/reports/predictiveReportsService';
import ReportesPanel from './ReportesPanel';

const mockFetch = vi.mocked(fetchPredictiveReport);
const mockPdf = vi.mocked(downloadPredictiveReportPdf);
const mockExcel = vi.mocked(downloadPredictiveReportExcel);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ReportesPanel', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockPdf.mockReset();
    mockExcel.mockReset();
  });

  it('renders placeholder before any report is generated', () => {
    render(<ReportesPanel />, { wrapper: createWrapper() });
    expect(screen.getByTestId('reportes-panel')).toBeInTheDocument();
    expect(screen.getByTestId('report-placeholder')).toBeInTheDocument();
  });

  it('fetches and renders the report when filters are submitted', async () => {
    mockFetch.mockResolvedValueOnce({
      region: 'Jalisco',
      season: 'Verano',
      generatedAt: '2026-06-15T10:30:00',
      observationsAnalyzed: 25,
      executiveSummary: 'Resumen de prueba',
      predictions: [
        {
          plagueName: 'Pulgon',
          probability: 80,
          estimatedPeriod: 'Junio',
          riskLevel: 'Alto',
          affectedHost: 'Maiz',
          justification: 'Alta densidad observada',
          suggestedProduct: 'Imidacloprid',
        },
      ],
      hotspots: [],
      recommendations: [],
    });

    render(<ReportesPanel />, { wrapper: createWrapper() });

    await userEvent.type(screen.getByTestId('input-region'), 'Jalisco');
    await userEvent.click(screen.getByTestId('generate-report-button'));

    await waitFor(() => {
      expect(screen.getByTestId('predictive-report-summary')).toBeInTheDocument();
    });
    expect(screen.getByTestId('predictions-table')).toBeInTheDocument();
    expect(screen.getByText('Pulgon')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith({ region: 'Jalisco', season: 'verano' });
  });

  it('triggers PDF download via service when the button is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      region: 'Jalisco',
      season: 'Verano',
      generatedAt: null,
      observationsAnalyzed: 0,
      executiveSummary: null,
      predictions: [],
      hotspots: [],
      recommendations: [],
    });
    mockPdf.mockResolvedValueOnce(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));

    const originalCreateUrl = URL.createObjectURL;
    const originalRevokeUrl = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => 'blob:fake');
    URL.revokeObjectURL = vi.fn();

    render(<ReportesPanel />, { wrapper: createWrapper() });

    await userEvent.type(screen.getByTestId('input-region'), 'Jalisco');
    await userEvent.click(screen.getByTestId('generate-report-button'));

    await waitFor(() => {
      expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('download-pdf-button'));

    await waitFor(() => {
      expect(mockPdf).toHaveBeenCalledWith({ region: 'Jalisco', season: 'verano' });
    });

    URL.createObjectURL = originalCreateUrl;
    URL.revokeObjectURL = originalRevokeUrl;
  });

  it('shows error UI when the report query fails', async () => {
    mockFetch.mockRejectedValue(new Error('Backend caído'));

    render(<ReportesPanel />, { wrapper: createWrapper() });
    await userEvent.type(screen.getByTestId('input-region'), 'Sonora');
    await userEvent.click(screen.getByTestId('generate-report-button'));

    await waitFor(
      () => {
        expect(screen.getByTestId('report-error')).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
    expect(screen.getByTestId('report-error')).toHaveTextContent('Backend caído');
  });

  it('triggers Excel download via service', async () => {
    mockFetch.mockResolvedValueOnce({
      region: 'Jalisco',
      season: 'Verano',
      generatedAt: null,
      observationsAnalyzed: 0,
      executiveSummary: null,
      predictions: [],
      hotspots: [],
      recommendations: [],
    });
    mockExcel.mockResolvedValueOnce(
      new Blob(['PK'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    );

    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => 'blob:fake');
    URL.revokeObjectURL = vi.fn();

    render(<ReportesPanel />, { wrapper: createWrapper() });
    await userEvent.type(screen.getByTestId('input-region'), 'Jalisco');
    await userEvent.click(screen.getByTestId('generate-report-button'));
    await waitFor(() => expect(screen.getByTestId('download-excel-button')).toBeInTheDocument());

    await userEvent.click(screen.getByTestId('download-excel-button'));
    await waitFor(() =>
      expect(mockExcel).toHaveBeenCalledWith({ region: 'Jalisco', season: 'verano' }),
    );

    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
  });

  it('shows an export error when a download fails', async () => {
    mockFetch.mockResolvedValueOnce({
      region: 'Jalisco',
      season: 'Verano',
      generatedAt: null,
      observationsAnalyzed: 0,
      executiveSummary: null,
      predictions: [],
      hotspots: [],
      recommendations: [],
    });
    mockPdf.mockRejectedValueOnce(new Error('PDF no disponible'));

    render(<ReportesPanel />, { wrapper: createWrapper() });
    await userEvent.type(screen.getByTestId('input-region'), 'Jalisco');
    await userEvent.click(screen.getByTestId('generate-report-button'));
    await waitFor(() => expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument());

    await userEvent.click(screen.getByTestId('download-pdf-button'));
    await waitFor(() => expect(screen.getByTestId('export-error')).toHaveTextContent('PDF no disponible'));
  });
});
