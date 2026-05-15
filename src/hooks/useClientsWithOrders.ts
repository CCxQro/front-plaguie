import { useMemo } from 'react';
import { useClientLocations } from './useClientLocations';
import { useSellerOrders } from './useSellerOrders';
import { enrichClients, type EnrichedClient } from '../services/clients/clientsAggregator';

interface UseClientsWithOrdersResult {
  clients: EnrichedClient[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Composes location data with seller orders into a single enriched client list.
 * If orders fail to load the map still renders with location-only data.
 */
export function useClientsWithOrders(): UseClientsWithOrdersResult {
  const locationsQuery = useClientLocations();
  const ordersQuery = useSellerOrders();

  const clients = useMemo(() => {
    const locations = locationsQuery.data ?? [];
    const orders = ordersQuery.data ?? [];
    return enrichClients(locations, orders);
  }, [locationsQuery.data, ordersQuery.data]);

  return {
    clients,
    isLoading: locationsQuery.isLoading,
    isError: locationsQuery.isError,
    error: (locationsQuery.error as Error | null) ?? null,
    refetch: () => {
      locationsQuery.refetch();
      ordersQuery.refetch();
    },
  };
}
