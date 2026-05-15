import type { ClientLocation } from './clientLocationsService';
import type { SellerOrderResponse } from '../orders/ordersService';

export interface ClientOrderSummary {
  orderId: number;
  orderDate: string;
  orderStatusId: number;
  orderStatusName: string;
  totalAmount: number;
}

export interface EnrichedClient {
  clientId: string;
  farmerId: number;
  clientName: string;
  lat: number;
  lng: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  lastOrderStatus: string | null;
  statuses: string[];
  orders: ClientOrderSummary[];
}

function toSummary(o: SellerOrderResponse): ClientOrderSummary {
  return {
    orderId: o.orderId,
    orderDate: o.orderDate,
    orderStatusId: o.orderStatusId,
    orderStatusName: o.orderStatusName,
    totalAmount: Number(o.totalAmount ?? 0),
  };
}

/**
 * Combines client locations with their order history.
 * Locations come from a deduplicated source — every client appears exactly once.
 * Orders are bucketed by farmerId and sorted newest-first.
 */
export function enrichClients(
  locations: ClientLocation[],
  orders: SellerOrderResponse[],
): EnrichedClient[] {
  const ordersByFarmer = new Map<number, SellerOrderResponse[]>();
  for (const o of orders) {
    const bucket = ordersByFarmer.get(o.farmerId);
    if (bucket) {
      bucket.push(o);
    } else {
      ordersByFarmer.set(o.farmerId, [o]);
    }
  }

  return locations.map((loc) => {
    const farmerId = Number(loc.clientId);
    const farmerOrders = (ordersByFarmer.get(farmerId) ?? [])
      .slice()
      .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1));

    const summaries = farmerOrders.map(toSummary);
    const totalSpent = summaries.reduce((acc, s) => acc + s.totalAmount, 0);
    const statuses = Array.from(
      new Set(summaries.map((s) => s.orderStatusName).filter(Boolean)),
    );

    return {
      clientId: loc.clientId,
      farmerId,
      clientName: loc.clientName,
      lat: loc.lat,
      lng: loc.lng,
      totalOrders: summaries.length,
      totalSpent,
      lastOrderDate: summaries[0]?.orderDate ?? null,
      lastOrderStatus: summaries[0]?.orderStatusName ?? null,
      statuses,
      orders: summaries,
    };
  });
}

export interface ClientFilters {
  search: string;
  statuses: string[];
  minOrders: number | null;
  minSpent: number | null;
}

export const emptyFilters: ClientFilters = {
  search: '',
  statuses: [],
  minOrders: null,
  minSpent: null,
};

export function applyFilters(
  clients: EnrichedClient[],
  filters: ClientFilters,
): EnrichedClient[] {
  const term = filters.search.trim().toLowerCase();
  return clients.filter((c) => {
    if (term && !c.clientName.toLowerCase().includes(term)) return false;
    if (filters.statuses.length > 0) {
      const match = c.statuses.some((s) => filters.statuses.includes(s));
      if (!match) return false;
    }
    if (filters.minOrders !== null && c.totalOrders < filters.minOrders) return false;
    if (filters.minSpent !== null && c.totalSpent < filters.minSpent) return false;
    return true;
  });
}
