import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/vigilancia/vigilanciaService', () => ({
  vigilanciaService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    validate: vi.fn(),
  },
}));

import { vigilanciaService } from '../services/vigilancia/vigilanciaService';
import {
  useVigilancias,
  useVigilancia,
  useCreateVigilancia,
  useDeleteVigilancia,
  useValidateVigilancia,
} from './useVigilancia';
import { createQueryWrapper } from '../test/queryWrapper';

const svc = vi.mocked(vigilanciaService);

beforeEach(() => vi.clearAllMocks());

describe('useVigilancia hooks', () => {
  it('useVigilancias fetches the list', async () => {
    svc.getAll.mockResolvedValueOnce([] as never);
    const { result } = renderHook(() => useVigilancias(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getAll).toHaveBeenCalled();
  });

  it('useVigilancia fetches by id and is disabled for id 0', async () => {
    svc.getById.mockResolvedValueOnce({ vigilanciaFitosanitariaId: 5 } as never);
    const { result } = renderHook(() => useVigilancia(5), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getById).toHaveBeenCalledWith(5);

    const disabled = renderHook(() => useVigilancia(0), { wrapper: createQueryWrapper() });
    expect(disabled.result.current.fetchStatus).toBe('idle');
  });

  it('useCreateVigilancia creates', async () => {
    svc.create.mockResolvedValueOnce({ vigilanciaFitosanitariaId: 1 } as never);
    const { result } = renderHook(() => useCreateVigilancia(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ tipoPlaga: 'X', incidencia: 1, severidad: 2, ubicacionId: 1 });
    expect(svc.create).toHaveBeenCalled();
  });

  it('useDeleteVigilancia deletes', async () => {
    svc.delete.mockResolvedValueOnce(undefined as never);
    const { result } = renderHook(() => useDeleteVigilancia(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync(3);
    expect(svc.delete).toHaveBeenCalledWith(3);
  });

  it('useValidateVigilancia validates', async () => {
    svc.validate.mockResolvedValueOnce({ vigilanciaFitosanitariaId: 3 } as never);
    const { result } = renderHook(() => useValidateVigilancia(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ id: 3, payload: { statusId: 2 } });
    expect(svc.validate).toHaveBeenCalledWith(3, { statusId: 2 });
  });
});
