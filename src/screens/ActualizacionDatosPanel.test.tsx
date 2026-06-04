import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ActualizacionDatosPanel from './ActualizacionDatosPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ingestionService from '../services/ingestion/ingestionService';

vi.mock('../services/ingestion/ingestionService', () => ({
  getIngestionRuns: vi.fn(),
  uploadIngestionFile: vi.fn()
}));

// Mock fetchEventSource
vi.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: vi.fn()
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ActualizacionDatosPanel />
    </QueryClientProvider>
  );
};

describe('ActualizacionDatosPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ingestionService.getIngestionRuns as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: 1,
        startedAt: '2026-06-01T12:00:00Z',
        finishedAt: '2026-06-01T12:05:00Z',
        status: 'COMPLETED',
        filesFound: 1,
        filesProcessed: 1,
        files: [{ filename: 'test.csv', rowsInserted: 50, status: 'COMPLETED' }]
      }
    ]);
  });

  it('renders correctly and loads history', async () => {
    renderComponent();
    expect(screen.getByText(/Actualización de Datos/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('history-row')).toBeInTheDocument();
    });
    
    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });

  it('handles valid CSV upload', async () => {
    (ingestionService.uploadIngestionFile as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ status: 'queued' });
    renderComponent();

    const fileInput = screen.getByTestId('file-upload-input');
    const uploadButton = screen.getByTestId('upload-button');

    expect(uploadButton).toBeDisabled();

    const file = new File(['header,row\n1,2'], 'data.csv', { type: 'text/csv' });
    await userEvent.upload(fileInput, file);

    expect(uploadButton).not.toBeDisabled();
    
    await userEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(ingestionService.uploadIngestionFile).toHaveBeenCalledTimes(1);
    });
  });

  it('rejects oversized files', async () => {
    renderComponent();
    const fileInput = screen.getByTestId('file-upload-input');
    
    const file = new File(['text'], 'data.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 400 * 1024 * 1024 }); // 400MB
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText(/Archivo demasiado grande/i)).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('upload-button')).toBeDisabled();
  });
});
