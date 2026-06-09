import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), patch: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { recomendacionesService } from './recomendacionesService';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);
const del = vi.mocked(backendClient.delete);
const patch = vi.mocked(backendClient.patch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('recomendacionesService', () => {
  it('getAll hits the collection endpoint', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await recomendacionesService.getAll();
    expect(get).toHaveBeenCalledWith('/api/recomendaciones');
  });

  it('getById hits the item endpoint', async () => {
    get.mockResolvedValueOnce({ data: { recomendacionId: 3 } });
    const result = await recomendacionesService.getById(3);
    expect(get).toHaveBeenCalledWith('/api/recomendaciones/3');
    expect(result.recomendacionId).toBe(3);
  });

  it('create posts the payload', async () => {
    const payload = { titulo: 'T', tipoPlaga: 'X', productosRecomendados: 'P' };
    post.mockResolvedValueOnce({ data: { recomendacionId: 1 } });
    await recomendacionesService.create(payload);
    expect(post).toHaveBeenCalledWith('/api/recomendaciones', payload);
  });

  it('delete removes the item', async () => {
    del.mockResolvedValueOnce({ data: undefined });
    await recomendacionesService.delete(4);
    expect(del).toHaveBeenCalledWith('/api/recomendaciones/4');
  });

  it('validate patches with the status payload', async () => {
    patch.mockResolvedValueOnce({ data: { recomendacionId: 4 } });
    await recomendacionesService.validate(4, { statusId: 2 });
    expect(patch).toHaveBeenCalledWith('/api/recomendaciones/4/validate', { statusId: 2 });
  });
});
