import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), patch: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { alertasService } from './alertasService';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);
const del = vi.mocked(backendClient.delete);
const patch = vi.mocked(backendClient.patch);

beforeEach(() => vi.clearAllMocks());

describe('alertasService', () => {
  it('getAll hits /api/alertas', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await alertasService.getAll();
    expect(get).toHaveBeenCalledWith('/api/alertas');
  });

  it('getById hits /api/alertas/:id', async () => {
    get.mockResolvedValueOnce({ data: { alertaId: 3 } });
    await alertasService.getById(3);
    expect(get).toHaveBeenCalledWith('/api/alertas/3');
  });

  it('create posts the payload', async () => {
    const payload = { titulo: 'T', ubicacionId: 1, tipoPlaga: 'X', hectareas: 2, severidad: 'critico' as const };
    post.mockResolvedValueOnce({ data: { alertaId: 1 } });
    await alertasService.create(payload);
    expect(post).toHaveBeenCalledWith('/api/alertas', payload);
  });

  it('delete removes the alert', async () => {
    del.mockResolvedValueOnce({ data: undefined });
    await alertasService.delete(4);
    expect(del).toHaveBeenCalledWith('/api/alertas/4');
  });

  it('validate patches the status', async () => {
    patch.mockResolvedValueOnce({ data: { alertaId: 4 } });
    await alertasService.validate(4, { statusId: 2 });
    expect(patch).toHaveBeenCalledWith('/api/alertas/4/validate', { statusId: 2 });
  });
});
