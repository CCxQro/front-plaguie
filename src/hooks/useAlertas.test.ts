import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/alertas/alertasService', () => ({
  alertasService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    validate: vi.fn(),
  },
}));

import { alertasService } from '../services/alertas/alertasService';
import {
  useAlertas,
  useAlerta,
  useCreateAlerta,
  useDeleteAlerta,
  useValidateAlerta,
} from './useAlertas';
import { createQueryWrapper } from '../test/queryWrapper';

const svc = vi.mocked(alertasService);

beforeEach(() => vi.clearAllMocks());

describe('useAlertas hooks', () => {
  it('useAlertas fetches the list', async () => {
    svc.getAll.mockResolvedValueOnce([] as never);
    const { result } = renderHook(() => useAlertas(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getAll).toHaveBeenCalled();
  });

  it('useAlerta fetches by id', async () => {
    svc.getById.mockResolvedValueOnce({ alertaId: 5 } as never);
    const { result } = renderHook(() => useAlerta(5), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getById).toHaveBeenCalledWith(5);
  });

  it('useCreateAlerta creates', async () => {
    svc.create.mockResolvedValueOnce({ alertaId: 1 } as never);
    const { result } = renderHook(() => useCreateAlerta(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ titulo: 'T', ubicacionId: 1, tipoPlaga: 'X', hectareas: 2, severidad: 'critico' });
    expect(svc.create).toHaveBeenCalled();
  });

  it('useDeleteAlerta deletes', async () => {
    svc.delete.mockResolvedValueOnce(undefined as never);
    const { result } = renderHook(() => useDeleteAlerta(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync(3);
    expect(svc.delete).toHaveBeenCalledWith(3);
  });

  it('useValidateAlerta validates', async () => {
    svc.validate.mockResolvedValueOnce({ alertaId: 3 } as never);
    const { result } = renderHook(() => useValidateAlerta(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ id: 3, payload: { statusId: 2 } });
    expect(svc.validate).toHaveBeenCalledWith(3, { statusId: 2 });
  });
});
