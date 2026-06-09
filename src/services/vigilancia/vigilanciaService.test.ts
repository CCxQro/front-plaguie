import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), patch: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { vigilanciaService } from './vigilanciaService';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);
const del = vi.mocked(backendClient.delete);
const patch = vi.mocked(backendClient.patch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('vigilanciaService', () => {
  it('getAll hits the collection endpoint', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await vigilanciaService.getAll();
    expect(get).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias');
  });

  it('getById hits the item endpoint', async () => {
    get.mockResolvedValueOnce({ data: { vigilanciaFitosanitariaId: 2 } });
    await vigilanciaService.getById(2);
    expect(get).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias/2');
  });

  it('create posts the payload', async () => {
    const payload = { tipoPlaga: 'X', incidencia: 1, severidad: 2, ubicacionId: 9 };
    post.mockResolvedValueOnce({ data: { vigilanciaFitosanitariaId: 1 } });
    await vigilanciaService.create(payload);
    expect(post).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias', payload);
  });

  it('delete removes the item', async () => {
    del.mockResolvedValueOnce({ data: undefined });
    await vigilanciaService.delete(3);
    expect(del).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias/3');
  });

  it('validate patches with the status payload', async () => {
    patch.mockResolvedValueOnce({ data: { vigilanciaFitosanitariaId: 3 } });
    await vigilanciaService.validate(3, { statusId: 2 });
    expect(patch).toHaveBeenCalledWith('/api/vigilancias-fitosanitarias/3/validate', { statusId: 2 });
  });
});
