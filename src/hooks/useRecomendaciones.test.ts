import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/recomendaciones/recomendacionesService', () => ({
  recomendacionesService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    validate: vi.fn(),
  },
}));

import { recomendacionesService } from '../services/recomendaciones/recomendacionesService';
import {
  useRecomendaciones,
  useRecomendacion,
  useCreateRecomendacion,
  useDeleteRecomendacion,
  useValidateRecomendacion,
} from './useRecomendaciones';
import { createQueryWrapper } from '../test/queryWrapper';

const svc = vi.mocked(recomendacionesService);

beforeEach(() => vi.clearAllMocks());

describe('useRecomendaciones hooks', () => {
  it('useRecomendaciones fetches the list', async () => {
    svc.getAll.mockResolvedValueOnce([] as never);
    const { result } = renderHook(() => useRecomendaciones(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getAll).toHaveBeenCalled();
  });

  it('useRecomendacion fetches by id', async () => {
    svc.getById.mockResolvedValueOnce({ recomendacionId: 5 } as never);
    const { result } = renderHook(() => useRecomendacion(5), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(svc.getById).toHaveBeenCalledWith(5);
  });

  it('useCreateRecomendacion creates', async () => {
    svc.create.mockResolvedValueOnce({ recomendacionId: 1 } as never);
    const { result } = renderHook(() => useCreateRecomendacion(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ titulo: 'T', tipoPlaga: 'X', productosRecomendados: 'P' });
    expect(svc.create).toHaveBeenCalled();
  });

  it('useDeleteRecomendacion deletes', async () => {
    svc.delete.mockResolvedValueOnce(undefined as never);
    const { result } = renderHook(() => useDeleteRecomendacion(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync(3);
    expect(svc.delete).toHaveBeenCalledWith(3);
  });

  it('useValidateRecomendacion validates', async () => {
    svc.validate.mockResolvedValueOnce({ recomendacionId: 3 } as never);
    const { result } = renderHook(() => useValidateRecomendacion(), { wrapper: createQueryWrapper() });
    await result.current.mutateAsync({ id: 3, payload: { statusId: 2 } });
    expect(svc.validate).toHaveBeenCalledWith(3, { statusId: 2 });
  });
});
