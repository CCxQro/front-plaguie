import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ValidacionPanel from './ValidacionPanel';
import type { AlertaDto } from '../services/alertas/alertasService';
import type { RecomendacionDto } from '../services/recomendaciones/recomendacionesService';
import type { VigilanciaFitosanitariaDto } from '../services/vigilancia/vigilanciaService';

const mocks = vi.hoisted(() => ({
  useVigilancias: vi.fn(),
  useValidateVigilancia: vi.fn(),
  useAlertas: vi.fn(),
  useValidateAlerta: vi.fn(),
  useRecomendaciones: vi.fn(),
  useValidateRecomendacion: vi.fn(),
  validateVigilancia: vi.fn(),
  validateAlerta: vi.fn(),
  validateRecomendacion: vi.fn(),
}));

vi.mock('../hooks/useVigilancia', () => ({
  useVigilancias: mocks.useVigilancias,
  useValidateVigilancia: mocks.useValidateVigilancia,
}));

vi.mock('../hooks/useAlertas', () => ({
  useAlertas: mocks.useAlertas,
  useValidateAlerta: mocks.useValidateAlerta,
}));

vi.mock('../hooks/useRecomendaciones', () => ({
  useRecomendaciones: mocks.useRecomendaciones,
  useValidateRecomendacion: mocks.useValidateRecomendacion,
}));

vi.mock('../services/Contexts/useAuthStore', () => {
  const useAuthStore = vi.fn((selector: (s: { user: { userId: number; name: string; email: string; roleId: number } | null; token: string | null; isAuthenticated: boolean }) => unknown) =>
    selector({
      user: { userId: 1, name: 'Admin Plaguie', email: 'admin@plaguie.test', roleId: 1 },
      token: 'test-token',
      isAuthenticated: true,
    })
  );
  return { default: useAuthStore };
});

const BASE_VIGILANCIAS: VigilanciaFitosanitariaDto[] = [
  {
    vigilanciaFitosanitariaId: 22,
    systemMonitoringId: 1,
    systemMonitoringName: 'Trampeo semanal',
    identificationKeyId: 1,
    identificationKeyName: 'CID-MOSCA-001',
    latitude: 20.75,
    longitude: -103.48,
    locationId: 1,
    plagueId: 1,
    plagueName: 'Mosca de la fruta',
    hostId: 1,
    hostName: 'Mango',
    varietyId: 1,
    varietyName: 'Ataulfo',
    speciesId: 1,
    speciesName: 'Mangifera indica',
    ahosp: 12.5,
    statusId: 2,
    statusName: 'Revision',
  },
  {
    vigilanciaFitosanitariaId: 23,
    systemMonitoringName: 'Monitoreo visual',
    plagueName: 'Roya asiatica',
    hostName: 'Soya',
    ahosp: 8.25,
    statusId: 1,
    statusName: 'Accepted',
    validatedByUserId: 1,
    validatedAt: '2026-05-10T10:30:00',
  },
];

const BASE_ALERTAS: AlertaDto[] = [
  {
    alertaId: 31,
    titulo: 'Brote de araña roja',
    descripcion: 'Se detecta presión alta en el lote norte.',
    ubicacionId: 3,
    tipoPlaga: 'Araña roja',
    hectareas: 14.5,
    severidad: 'critico',
    reportedByUserId: 8,
    createdAt: '2026-05-11T08:15:00',
    statusId: 2,
    statusName: 'Revision',
  },
  {
    alertaId: 32,
    titulo: 'Riesgo de roya',
    descripcion: 'Humedad persistente en cultivo de soya.',
    ubicacionId: 2,
    tipoPlaga: 'Roya asiatica',
    hectareas: 7,
    severidad: 'advertencia',
    reportedByUserId: 7,
    createdAt: '2026-05-10T09:00:00',
    statusId: 3,
    statusName: 'Rejected',
    validatedByUserId: 2,
    validatedAt: '2026-05-12T12:00:00',
  },
];

const BASE_RECOMENDACIONES: RecomendacionDto[] = [
  {
    recomendacionId: 41,
    titulo: 'Tratamiento contra mosca de la fruta',
    descripcion: 'Aplicar control preventivo en franja perimetral.',
    tipoPlaga: 'Mosca de la fruta',
    productosRecomendados: 'Spinosad, trampas McPhail',
    reportedByUserId: 11,
    createdAt: '2026-05-12T11:30:00',
    statusId: 2,
    statusName: 'Revision',
  },
];

function makeQuery<T>(data: T) {
  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  };
}

function setupHookMocks({
  vigilancias = BASE_VIGILANCIAS,
  alertas = BASE_ALERTAS,
  recomendaciones = BASE_RECOMENDACIONES,
}: {
  vigilancias?: VigilanciaFitosanitariaDto[];
  alertas?: AlertaDto[];
  recomendaciones?: RecomendacionDto[];
} = {}) {
  mocks.useVigilancias.mockReturnValue(makeQuery(vigilancias));
  mocks.useAlertas.mockReturnValue(makeQuery(alertas));
  mocks.useRecomendaciones.mockReturnValue(makeQuery(recomendaciones));
  mocks.useValidateVigilancia.mockReturnValue({
    mutateAsync: mocks.validateVigilancia,
    isPending: false,
  });
  mocks.useValidateAlerta.mockReturnValue({
    mutateAsync: mocks.validateAlerta,
    isPending: false,
  });
  mocks.useValidateRecomendacion.mockReturnValue({
    mutateAsync: mocks.validateRecomendacion,
    isPending: false,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.validateVigilancia.mockResolvedValue(BASE_VIGILANCIAS[0]);
  mocks.validateAlerta.mockResolvedValue(BASE_ALERTAS[0]);
  mocks.validateRecomendacion.mockResolvedValue(BASE_RECOMENDACIONES[0]);
  setupHookMocks();
});

describe('ValidacionPanel', () => {
  it('renders normalized vigilance records using vigilanciaFitosanitariaId', () => {
    render(<ValidacionPanel />);

    expect(screen.getByText('Vigilancia: Mosca de la fruta')).toBeInTheDocument();
    expect(screen.getByText('#22')).toBeInTheDocument();
    expect(screen.getByText('Mango')).toBeInTheDocument();
  });

  it('approves a vigilance record with the numeric backend id and statusId 1', async () => {
    const user = userEvent.setup();
    render(<ValidacionPanel />);

    await user.click(screen.getAllByTestId('validate-button')[0]);
    await user.click(screen.getByTestId('modal-accept-button'));

    await waitFor(() => {
      expect(mocks.validateVigilancia).toHaveBeenCalledWith({
        id: 22,
        payload: { statusId: 1 },
      });
    });
  });

  it('rejects a vigilance record with statusId 3', async () => {
    const user = userEvent.setup();
    render(<ValidacionPanel />);

    await user.click(screen.getAllByTestId('validate-button')[0]);
    await user.click(screen.getByTestId('modal-reject-button'));

    await waitFor(() => {
      expect(mocks.validateVigilancia).toHaveBeenCalledWith({
        id: 22,
        payload: { statusId: 3 },
      });
    });
  });

  it('shows pending counts for all validation tabs', () => {
    render(<ValidacionPanel />);

    expect(screen.getByTestId('tab-badge-vigilancia')).toHaveTextContent('1 pendientes');
    expect(screen.getByTestId('tab-badge-alertas')).toHaveTextContent('1 pendientes');
    expect(screen.getByTestId('tab-badge-recomendaciones')).toHaveTextContent('1 pendientes');
  });

  it('does not submit validation when a record id is invalid', async () => {
    const invalidVigilancia = {
      ...BASE_VIGILANCIAS[0],
      vigilanciaFitosanitariaId: undefined,
    } as unknown as VigilanciaFitosanitariaDto;
    setupHookMocks({ vigilancias: [invalidVigilancia] });

    const user = userEvent.setup();
    render(<ValidacionPanel />);

    await user.click(screen.getByTestId('validate-button'));
    await user.click(screen.getByTestId('modal-accept-button'));

    expect(mocks.validateVigilancia).not.toHaveBeenCalled();
    expect(await screen.findByText('Registro sin ID válido')).toBeInTheDocument();
  });
});
