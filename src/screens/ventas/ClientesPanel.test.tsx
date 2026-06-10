import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useClientsMap', () => ({ useClientsMap: vi.fn() }));
vi.mock('../../hooks/useClientDetail', () => ({ useClientDetail: vi.fn() }));

vi.mock('../../components/ClientFilters/ClientFilters', async (orig) => {
  const actual = await orig<typeof import('../../components/ClientFilters/ClientFilters')>();
  return { ...actual, ClientFilters: () => <div data-testid="client-filters" /> };
});
vi.mock('../../components/ClientMap/ClientMap', () => ({
  ClientMap: ({ onSelectClient }: { onSelectClient: (id: number) => void }) => (
    <button data-testid="client-map" onClick={() => onSelectClient(1)}>
      map
    </button>
  ),
}));
vi.mock('../../components/ClientDetailDrawer/ClientDetailDrawer', () => ({
  ClientDetailDrawer: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="client-drawer">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

import { useClientsMap } from '../../hooks/useClientsMap';
import { useClientDetail } from '../../hooks/useClientDetail';
import ClientesPanel from './ClientesPanel';

const mapHook = vi.mocked(useClientsMap);
const detailHook = vi.mocked(useClientDetail);

const client = (overrides = {}) => ({
  farmerId: 1,
  name: 'Cliente Uno',
  cultivos: ['Maíz'],
  estadosParcela: ['Crecimiento'],
  state: 'Jalisco',
  hasActiveAlerts: true,
  maxAlertSeverity: 'critico',
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  detailHook.mockReturnValue({ data: undefined, isLoading: false } as never);
});

describe('ClientesPanel', () => {
  it('shows the loading state', () => {
    mapHook.mockReturnValue({ data: [], isLoading: true, isError: false, refetch: vi.fn() } as never);
    render(<ClientesPanel />);
    expect(screen.getByTestId('clientes-panel-loading')).toBeInTheDocument();
  });

  it('shows the error state and retries', () => {
    const refetch = vi.fn();
    mapHook.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: new Error('falló'),
      refetch,
    } as never);
    render(<ClientesPanel />);
    expect(screen.getByTestId('clientes-panel-error')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('shows the empty state when no clients', () => {
    mapHook.mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() } as never);
    render(<ClientesPanel />);
    expect(screen.getByTestId('clientes-panel-empty')).toBeInTheDocument();
  });

  it('renders the map with severity badges and opens/closes the detail drawer', () => {
    mapHook.mockReturnValue({
      data: [client(), client({ farmerId: 2, maxAlertSeverity: 'advertencia', hasActiveAlerts: false })],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);

    render(<ClientesPanel />);
    expect(screen.getByTestId('client-map')).toBeInTheDocument();
    expect(screen.getByText(/Críticos: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Advertencias: 1/)).toBeInTheDocument();

    // selecting a client opens the drawer (and triggers the detail hook)
    fireEvent.click(screen.getByTestId('client-map'));
    expect(screen.getByTestId('client-drawer')).toBeInTheDocument();
    expect(detailHook).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByTestId('client-drawer')).toBeNull();
  });

  it('refreshes from the header button', () => {
    const refetch = vi.fn();
    mapHook.mockReturnValue({ data: [client()], isLoading: false, isError: false, refetch } as never);
    render(<ClientesPanel />);
    fireEvent.click(screen.getByTestId('clientes-panel-refresh'));
    expect(refetch).toHaveBeenCalled();
  });
});
