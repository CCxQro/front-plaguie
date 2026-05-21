import type { Category, Product, Provider, Unit } from '../types/Product';

/**
 * Shared mock data for the product table/modal stories. The product modals are
 * data-driven (TanStack Query); these fixtures feed the seeded query client in
 * `withProductData` so the stories render fully populated without a backend.
 */

/** Inline SVG data-URI — keeps stories off Firebase Storage and the network. */
export const MOCK_PRODUCT_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22%3E%3Crect width=%22160%22 height=%22160%22 rx=%2216%22 fill=%22%23DCFCE7%22/%3E%3Crect x=%2256%22 y=%2234%22 width=%2248%22 height=%2292%22 rx=%228%22 fill=%22%2300A63E%22/%3E%3Crect x=%2266%22 y=%2254%22 width=%2228%22 height=%2218%22 rx=%224%22 fill=%22%23F0FDF4%22/%3E%3C/svg%3E';

export const MOCK_SKU_SELLER_ID = 1001;

export const mockCategories: Category[] = [
  { categoryId: 1, name: 'Fertilizantes', colorHexa: '#008236' },
  { categoryId: 2, name: 'Herbicidas', colorHexa: '#CA3500' },
  { categoryId: 3, name: 'Insecticidas', colorHexa: '#1447E6' },
];

export const mockProviders: Provider[] = [
  { providerId: 1, name: 'AgroQuím SA' },
  { providerId: 2, name: 'Campo Verde Distribuciones' },
];

export const mockUnits: Unit[] = [
  { unitId: 1, name: 'Litro' },
  { unitId: 2, name: 'Kilogramo' },
];

export const mockProduct: Product = {
  skuSellerId: MOCK_SKU_SELLER_ID,
  sellerId: 1,
  sellerName: 'Juan Pérez',
  name: 'Fertilizante NPK 20-20-20',
  sku: 'PLG-001',
  categoryId: 1,
  categoryName: 'Fertilizantes',
  providerId: 1,
  providerName: 'AgroQuím SA',
  unitValue: 25,
  unitId: 1,
  unitName: 'Litro',
  description:
    'Fertilizante balanceado de liberación gradual para cultivos de alto rendimiento.',
  statusId: 1,
  statusName: 'Activo',
  firebaseImageId: 'products/demo-fertilizante.png',
  latestPrice: '250.00000',
  latestPriceDate: '2025-05-02T14:00:00',
  stock: 85,
};
