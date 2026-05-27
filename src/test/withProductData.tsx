import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Decorator } from '@storybook/react-vite';
import {
  MOCK_PRODUCT_IMAGE,
  MOCK_SKU_SELLER_ID,
  mockCategories,
  mockProduct,
  mockProviders,
  mockUnits,
} from './productFixtures';

/**
 * Storybook decorator that provides a TanStack Query client pre-seeded with the
 * data the product modals query on mount — categories, providers, units, the
 * product, its resolved image URL, and the technical-seller id. Lets the
 * data-driven modals render fully populated without a backend.
 */

function buildSeededClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });
  client.setQueryData(['categories'], mockCategories);
  client.setQueryData(['providers'], mockProviders);
  client.setQueryData(['units'], mockUnits);
  client.setQueryData(['product', MOCK_SKU_SELLER_ID], mockProduct);
  client.setQueryData(['firebase-image', mockProduct.firebaseImageId], MOCK_PRODUCT_IMAGE);
  // useTechnicalSellerId keys on the auth-store userId, which is undefined in Storybook.
  client.setQueryData(['technical-seller-id', undefined], 1);
  return client;
}

const seededClient = buildSeededClient();

export const withProductData: Decorator = (Story) => (
  <QueryClientProvider client={seededClient}>
    <Story />
  </QueryClientProvider>
);
