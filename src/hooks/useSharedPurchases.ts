import { useOrders } from './useOrders';

export function useSharedPurchases() {
  const { data: orders = [], isLoading, isError, error, refetch } = useOrders();
  
  const sharedPurchases = orders.filter((order) => order.providerShared === true);

  return {
    data: sharedPurchases,
    isLoading,
    isError,
    error,
    refetch
  };
}
