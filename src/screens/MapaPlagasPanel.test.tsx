import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../services/pestMap/pestMapService', () => ({
  getPestMapPoints: vi.fn(),
}));

// Stub the leaflet map so jsdom doesn't need to render real tiles/canvas.
vi.mock('../components/PestMap/PestMap', () => ({
  PestMap: ({
    zones,
    onSelectZone,
  }: {
    zones: { key: string; municipio: string | null }[];
    onSelectZone: (k: string) => void;
  }) => (
    <div data-testid="pest-map-mock">
      {zones.map((z) => (
        <button key={z.key} data-testid={`zone-btn-${z.municipio}`} onClick={() => onSelectZone(z.key)}>
          {z.municipio}
        </button>
      ))}
    </div>
  ),
}));

import { getPestMapPoints } from '../services/pestMap/pestMapService';
import type { PestMapPoint } from '../types/PestMap';
import MapaPlagasPanel from './MapaPlagasPanel';

const mockGet = vi.mocked(getPestMapPoints);

function point(p: Partial<PestMapPoint> & { vigilanciaId: number }): PestMapPoint {
  return {
    latitude: 20.7,
    longitude: -103.4,
    plagaNombre: 'Mosca de la fruta',
    hospedanteNombre: 'Mango',
    especieNombre: null,
    estadoNombre: 'jalisco',
    municipioNombre: 'zapopan',
    ahosp: 10,
    validatedAt: '2026-05-20T10:00:00',
    ...p,
  };
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('MapaPlagasPanel', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGet.mockResolvedValue([
      point({ vigilanciaId: 1, plagaNombre: 'Mosca de la fruta' }),
      point({ vigilanciaId: 2, plagaNombre: 'Araña roja' }),
      point({ vigilanciaId: 3, plagaNombre: 'Mosca de la fruta' }),
      point({
        vigilanciaId: 4,
        plagaNombre: 'Roya asiatica',
        estadoNombre: 'michoacán',
        municipioNombre: 'uruapan',
        latitude: 19.4,
        longitude: -102.0,
      }),
    ]);
  });

  it('renders the panel with aggregated zones and totals', async () => {
    render(<MapaPlagasPanel />, { wrapper: createWrapper() });

    expect(screen.getByTestId('mapa-plagas-panel')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('pest-map-mock')).toBeInTheDocument();
    });
    // 2 zones (zapopan, uruapan), 4 total incidencias
    expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByTestId('zone-btn-zapopan')).toBeInTheDocument();
    expect(screen.getByTestId('zone-btn-uruapan')).toBeInTheDocument();
  });

  it('filters zones by pest type', async () => {
    render(<MapaPlagasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('zone-btn-zapopan')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByTestId('filter-plaga'), 'Roya asiatica');

    await waitFor(() => {
      expect(screen.queryByTestId('zone-btn-zapopan')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('zone-btn-uruapan')).toBeInTheDocument();
  });

  it('shows zone detail with pest breakdown when a zone is selected', async () => {
    render(<MapaPlagasPanel />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('zone-btn-zapopan')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('zone-btn-zapopan'));

    await waitFor(() => {
      expect(screen.getByTestId('zone-plagues')).toBeInTheDocument();
    });
    const detail = screen.getByTestId('zone-detail');
    expect(detail).toHaveTextContent('Mosca de la fruta');
    expect(detail).toHaveTextContent('Araña roja');
    expect(detail).toHaveTextContent('Riesgo Alto');
  });
});
