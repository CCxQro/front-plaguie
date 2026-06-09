import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { salesClientsService } from './salesClientsService';

const get = vi.mocked(backendClient.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('salesClientsService', () => {
  describe('getClientsMap', () => {
    it('requests without query string when no filters', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await salesClientsService.getClientsMap();
      expect(get).toHaveBeenCalledWith('/api/sales/clients');
    });

    it('builds the query string from all filters', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await salesClientsService.getClientsMap({
        cultivo: 'Maíz',
        estadoParcela: 'Crecimiento',
        state: 'Jalisco',
        municipality: 'Zapopan',
        onlyWithActiveAlerts: true,
      });

      const calledWith = get.mock.calls[0][0] as string;
      expect(calledWith).toContain('/api/sales/clients?');
      expect(calledWith).toContain('cultivo=Ma%C3%ADz');
      expect(calledWith).toContain('estadoParcela=Crecimiento');
      expect(calledWith).toContain('state=Jalisco');
      expect(calledWith).toContain('municipality=Zapopan');
      expect(calledWith).toContain('onlyWithActiveAlerts=true');
    });

    it('omits onlyWithActiveAlerts when false', async () => {
      get.mockResolvedValueOnce({ data: [] });
      await salesClientsService.getClientsMap({ onlyWithActiveAlerts: false, cultivo: 'Soya' });
      const calledWith = get.mock.calls[0][0] as string;
      expect(calledWith).toContain('cultivo=Soya');
      expect(calledWith).not.toContain('onlyWithActiveAlerts');
    });
  });

  it('getClientDetail hits the detail endpoint', async () => {
    get.mockResolvedValueOnce({ data: { farmerId: 7 } });
    const result = await salesClientsService.getClientDetail(7);
    expect(get).toHaveBeenCalledWith('/api/sales/clients/7');
    expect(result.farmerId).toBe(7);
  });

  it('getClientParcelaStatus hits the status endpoint', async () => {
    get.mockResolvedValueOnce({ data: { farmerId: 7, parcelas: [] } });
    await salesClientsService.getClientParcelaStatus(7);
    expect(get).toHaveBeenCalledWith('/api/sales/clients/7/status');
  });
});
