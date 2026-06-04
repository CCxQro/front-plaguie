import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClienteParcelaModal } from './ClienteParcelaModal';
import { salesClientsService, type ClientParcelaStatus } from '../../services/sales/salesClientsService';

vi.mock('../../services/sales/salesClientsService', () => ({
  salesClientsService: {
    getClientParcelaStatus: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ClienteParcelaModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return a promise that doesn't resolve to keep it loading
    vi.mocked(salesClientsService.getClientParcelaStatus).mockReturnValue(new Promise(() => {}));

    render(<ClienteParcelaModal farmerId={1} onClose={() => {}} />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('cliente-parcela-modal-loading')).toBeInTheDocument();
  });

  it('renders error state on failure', async () => {
    vi.mocked(salesClientsService.getClientParcelaStatus).mockRejectedValue(new Error('Network Error'));

    render(<ClienteParcelaModal farmerId={1} onClose={() => {}} />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByTestId('cliente-parcela-modal-error')).toBeInTheDocument();
      expect(screen.getByText('Error al cargar estado')).toBeInTheDocument();
    });
  });

  it('renders empty state if no parcelas', async () => {
    vi.mocked(salesClientsService.getClientParcelaStatus).mockResolvedValue({
      farmerId: 1,
      parcelas: [],
    });

    render(<ClienteParcelaModal farmerId={1} onClose={() => {}} />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByTestId('cliente-parcela-modal-empty')).toBeInTheDocument();
      expect(screen.getByText(/Este cliente no tiene parcelas/i)).toBeInTheDocument();
    });
  });

  it('renders the mocked sample data: Lote 1 / Alerta Pulgón / Riesgo Medio', async () => {
    const mockData: ClientParcelaStatus = {
      farmerId: 1,
      parcelas: [
        {
          parcelaId: 101,
          nombreParcela: 'Lote 1',
          saludCultivo: 45,
          alertas: [
            {
              alertaId: 1001,
              titulo: 'Alerta de plaga',
              tipoPlaga: 'Pulgón',
              severidad: 'advertencia',
              fecha: '2023-10-10',
            }
          ]
        }
      ]
    };

    vi.mocked(salesClientsService.getClientParcelaStatus).mockResolvedValue(mockData);

    render(<ClienteParcelaModal farmerId={1} onClose={() => {}} />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      // Assert "Lote 1" is shown
      expect(screen.getByText('Lote 1')).toBeInTheDocument();
      
      // Assert crop health is displayed correctly (e.g. 45% in red because < 50)
      expect(screen.getByText('45%')).toBeInTheDocument();
      
      // Assert "Alerta Pulgón" logic
      expect(screen.getByText('Alerta Pulgón')).toBeInTheDocument();
      
      // Assert "Riesgo Medio" is displayed
      expect(screen.getByText('Riesgo Medio')).toBeInTheDocument();
    });
  });

  it('calls onClose when clicking the close button', async () => {
    vi.mocked(salesClientsService.getClientParcelaStatus).mockResolvedValue({
      farmerId: 1,
      parcelas: [],
    });

    const onCloseMock = vi.fn();
    render(<ClienteParcelaModal farmerId={1} onClose={onCloseMock} />, { wrapper: createWrapper() });
    
    const closeButton = screen.getByTestId('cliente-parcela-modal-close');
    await userEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
