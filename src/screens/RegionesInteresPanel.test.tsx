import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../services/regions/regionsService', () => ({
  getStates: vi.fn(),
  getRegionesInteres: vi.fn(),
  addRegionInteres: vi.fn(),
  deleteRegionInteres: vi.fn(),
  getEarlyAlerts: vi.fn(),
}));

import {
  getStates,
  getRegionesInteres,
  addRegionInteres,
  deleteRegionInteres,
  getEarlyAlerts,
} from '../services/regions/regionsService';
import RegionesInteresPanel from './RegionesInteresPanel';

const mockGetStates = vi.mocked(getStates);
const mockGetRegiones = vi.mocked(getRegionesInteres);
const mockAdd = vi.mocked(addRegionInteres);
const mockDelete = vi.mocked(deleteRegionInteres);
const mockGetAlerts = vi.mocked(getEarlyAlerts);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('RegionesInteresPanel', () => {
  beforeEach(() => {
    mockGetStates.mockReset();
    mockGetRegiones.mockReset();
    mockAdd.mockReset();
    mockDelete.mockReset();
    mockGetAlerts.mockReset();

    mockGetStates.mockResolvedValue([
      { stateId: 5, name: 'Michoacán' },
      { stateId: 8, name: 'Jalisco' },
    ]);
    mockGetRegiones.mockResolvedValue([]);
    mockGetAlerts.mockResolvedValue([]);
  });

  it('renders the panel and prompts to configure regions', async () => {
    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    expect(screen.getByTestId('regiones-interes-panel')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('regiones-empty')).toBeInTheDocument();
    });
    // With no regions, the early-alerts section asks the user to configure one.
    expect(screen.getByTestId('alerts-need-regions')).toBeInTheDocument();
  });

  it('adds a region when a state is selected and the button is clicked', async () => {
    mockAdd.mockResolvedValueOnce({
      regionInteresId: 1,
      stateId: 5,
      stateName: 'Michoacán',
      createdAt: '2026-06-03T12:00:00',
    });

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    // Wait until the states catalog has loaded (the option appears and the select is enabled).
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Michoacán' })).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('state-select'), '5');
    await userEvent.click(screen.getByTestId('add-region-button'));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith(5);
    });
  });

  it('lists configured regions and shows early alerts', async () => {
    mockGetRegiones.mockResolvedValue([
      { regionInteresId: 1, stateId: 5, stateName: 'Michoacán', createdAt: null },
    ]);
    mockGetAlerts.mockResolvedValue([
      {
        alertaId: 10,
        titulo: 'Brote de pulgón',
        descripcion: 'Alta densidad',
        ubicacionId: 3,
        tipoPlaga: 'Pulgón',
        hectareas: 12,
        severidad: 'critico',
        reportedByUserId: 2,
        createdAt: '2026-06-01T10:00:00',
        statusId: 1,
        statusName: 'Aceptado',
      },
    ]);

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('region-row')).toHaveTextContent('Michoacán');
    });
    await waitFor(() => {
      expect(screen.getByTestId('early-alert-row')).toHaveTextContent('Brote de pulgón');
    });
  });

  it('deletes a region when its remove button is clicked', async () => {
    mockGetRegiones.mockResolvedValue([
      { regionInteresId: 1, stateId: 5, stateName: 'Michoacán', createdAt: null },
    ]);
    mockDelete.mockResolvedValueOnce(undefined);

    render(<RegionesInteresPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('delete-region-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('delete-region-button'));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });
});
