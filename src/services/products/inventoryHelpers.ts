import type { Product } from '../../types/Product';

export type StockState = 'normal' | 'bajo' | 'critico';

export const STOCK_LOW_THRESHOLD = 20;
export const STOCK_CRITICAL_THRESHOLD = 10;

export function getStockState(stock: number): StockState {
  if (stock <= STOCK_CRITICAL_THRESHOLD) return 'critico';
  if (stock <= STOCK_LOW_THRESHOLD) return 'bajo';
  return 'normal';
}

export const STOCK_BADGE_STYLES: Record<StockState, { bg: string; text: string; label: string }> = {
  normal: { bg: '#DCFCE7', text: '#016630', label: 'Normal' },
  bajo: { bg: '#FFEDD4', text: '#9F2D00', label: 'Bajo' },
  critico: { bg: '#FFE2E2', text: '#9F0712', label: 'Crítico' },
};

export interface StockSummary {
  total: number;
  normal: number;
  bajo: number;
  critico: number;
}

export function summarizeStock(products: Product[]): StockSummary {
  const summary: StockSummary = { total: products.length, normal: 0, bajo: 0, critico: 0 };
  for (const p of products) {
    summary[getStockState(p.stock)] += 1;
  }
  return summary;
}

export function formatPriceUSD(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num)) return '—';
  return `$${num.toFixed(2)}`;
}

export function formatPriceDecimal5(value: number): string {
  return value.toFixed(5);
}

export function getDisplayPrice(product: Product): string {
  if (product.latestPrice != null) return formatPriceUSD(product.latestPrice);
  return formatPriceUSD(product.unitValue);
}

export interface ProductFilterOptions {
  search?: string;
  categoryId?: number | null;
  providerId?: number | null;
  stockState?: StockState | null;
}

export function filterProducts(
  products: Product[],
  { search, categoryId, providerId, stockState }: ProductFilterOptions,
): Product[] {
  const q = search?.trim().toLowerCase() ?? '';
  return products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    if (categoryId != null && p.categoryId !== categoryId) return false;
    if (providerId != null && p.providerId !== providerId) return false;
    if (stockState && getStockState(p.stock) !== stockState) return false;
    return true;
  });
}
