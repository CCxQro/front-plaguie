import { describe, it, expect } from 'vitest';
import {
  enrichClients,
  applyFilters,
  emptyFilters,
  type ClientFilters,
} from './clientsAggregator';
import type { ClientLocation } from './clientLocationsService';
import type { SellerOrderResponse } from '../orders/ordersService';

const baseLocation = (overrides: Partial<ClientLocation> = {}): ClientLocation => ({
  clientId: '1',
  clientName: 'Rancho Norte',
  lat: 25.6866,
  lng: -100.3161,
  ...overrides,
});

const baseOrder = (overrides: Partial<SellerOrderResponse> = {}): SellerOrderResponse => ({
  orderId: 1,
  farmerId: 1,
  farmerName: 'Rancho Norte',
  sellerId: 10,
  sellerName: 'Vendedor',
  orderDate: '2025-01-15T10:00:00',
  orderStatusId: 1,
  orderStatusName: 'Entregado',
  totalAmount: 500,
  details: [],
  ...overrides,
});

describe('enrichClients', () => {
  it('returns a client with zero metrics when there are no orders', () => {
    const result = enrichClients([baseLocation()], []);
    expect(result).toHaveLength(1);
    expect(result[0].totalOrders).toBe(0);
    expect(result[0].totalSpent).toBe(0);
    expect(result[0].lastOrderDate).toBeNull();
    expect(result[0].lastOrderStatus).toBeNull();
    expect(result[0].statuses).toEqual([]);
  });

  it('aggregates totals and unique statuses for a client', () => {
    const orders = [
      baseOrder({ orderId: 1, totalAmount: 300, orderStatusName: 'Entregado' }),
      baseOrder({ orderId: 2, totalAmount: 200, orderStatusName: 'Pendiente' }),
      baseOrder({ orderId: 3, totalAmount: 150, orderStatusName: 'Entregado' }),
    ];
    const [client] = enrichClients([baseLocation()], orders);
    expect(client.totalOrders).toBe(3);
    expect(client.totalSpent).toBe(650);
    expect(client.statuses.sort()).toEqual(['Entregado', 'Pendiente']);
  });

  it('sorts orders newest-first and exposes last order info', () => {
    const orders = [
      baseOrder({ orderId: 1, orderDate: '2025-01-01T00:00:00', orderStatusName: 'Cancelado' }),
      baseOrder({ orderId: 2, orderDate: '2025-06-01T00:00:00', orderStatusName: 'Entregado' }),
      baseOrder({ orderId: 3, orderDate: '2025-03-01T00:00:00', orderStatusName: 'Pendiente' }),
    ];
    const [client] = enrichClients([baseLocation()], orders);
    expect(client.orders.map((o) => o.orderId)).toEqual([2, 3, 1]);
    expect(client.lastOrderDate).toBe('2025-06-01T00:00:00');
    expect(client.lastOrderStatus).toBe('Entregado');
  });

  it('does not mix orders across farmers', () => {
    const locs = [baseLocation({ clientId: '1' }), baseLocation({ clientId: '2', clientName: 'B' })];
    const orders = [
      baseOrder({ farmerId: 1, totalAmount: 100 }),
      baseOrder({ farmerId: 2, totalAmount: 700 }),
    ];
    const result = enrichClients(locs, orders);
    expect(result[0].totalSpent).toBe(100);
    expect(result[1].totalSpent).toBe(700);
  });

  it('coerces non-numeric totalAmount safely', () => {
    const orders = [
      baseOrder({ totalAmount: undefined as unknown as number }),
      baseOrder({ orderId: 2, totalAmount: 50 }),
    ];
    const [client] = enrichClients([baseLocation()], orders);
    expect(client.totalSpent).toBe(50);
  });
});

describe('applyFilters', () => {
  const clients = enrichClients(
    [
      baseLocation({ clientId: '1', clientName: 'Rancho Norte' }),
      baseLocation({ clientId: '2', clientName: 'Granja del Sur' }),
      baseLocation({ clientId: '3', clientName: 'Hacienda Centro' }),
    ],
    [
      baseOrder({ farmerId: 1, totalAmount: 1500, orderStatusName: 'Entregado' }),
      baseOrder({ farmerId: 1, orderId: 99, totalAmount: 200, orderStatusName: 'Pendiente' }),
      baseOrder({ farmerId: 2, totalAmount: 300, orderStatusName: 'Cancelado' }),
    ],
  );

  it('returns all clients with empty filters', () => {
    expect(applyFilters(clients, emptyFilters)).toHaveLength(3);
  });

  it('filters by case-insensitive name search', () => {
    const filters: ClientFilters = { ...emptyFilters, search: 'rancho' };
    const result = applyFilters(clients, filters);
    expect(result).toHaveLength(1);
    expect(result[0].clientName).toBe('Rancho Norte');
  });

  it('filters by status (OR semantics)', () => {
    const filters: ClientFilters = { ...emptyFilters, statuses: ['Cancelado'] };
    const result = applyFilters(clients, filters);
    expect(result.map((c) => c.clientId)).toEqual(['2']);
  });

  it('filters by minOrders', () => {
    const filters: ClientFilters = { ...emptyFilters, minOrders: 2 };
    const result = applyFilters(clients, filters);
    expect(result).toHaveLength(1);
    expect(result[0].clientId).toBe('1');
  });

  it('filters by minSpent', () => {
    const filters: ClientFilters = { ...emptyFilters, minSpent: 1000 };
    const result = applyFilters(clients, filters);
    expect(result.map((c) => c.clientId)).toEqual(['1']);
  });

  it('combines filters with AND semantics', () => {
    const filters: ClientFilters = {
      search: 'rancho',
      statuses: ['Entregado'],
      minOrders: 2,
      minSpent: 1000,
    };
    expect(applyFilters(clients, filters)).toHaveLength(1);
  });
});
