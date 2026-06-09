import { describe, it, expect } from 'vitest';
import type { Product } from '../../types/Product';
import {
  STOCK_BADGE_STYLES,
  filterProducts,
  formatPriceDecimal5,
  formatPriceUSD,
  getDisplayPrice,
  getStockState,
  summarizeStock,
} from './inventoryHelpers';

function product(overrides: Partial<Product>): Product {
  return {
    skuSellerId: 1,
    sku: 'SKU-1',
    name: 'Producto',
    stock: 100,
    categoryId: 1,
    providerId: 1,
    latestPrice: 10,
    ...overrides,
  } as Product;
}

describe('inventoryHelpers', () => {
  describe('getStockState', () => {
    it('returns critico at or below the critical threshold', () => {
      expect(getStockState(10)).toBe('critico');
      expect(getStockState(0)).toBe('critico');
    });
    it('returns bajo between thresholds', () => {
      expect(getStockState(11)).toBe('bajo');
      expect(getStockState(20)).toBe('bajo');
    });
    it('returns normal above the low threshold', () => {
      expect(getStockState(21)).toBe('normal');
      expect(getStockState(500)).toBe('normal');
    });
  });

  it('STOCK_BADGE_STYLES has an entry per state', () => {
    expect(STOCK_BADGE_STYLES.normal.label).toBe('Normal');
    expect(STOCK_BADGE_STYLES.bajo.label).toBe('Bajo');
    expect(STOCK_BADGE_STYLES.critico.label).toBe('Crítico');
  });

  it('summarizeStock counts products by state', () => {
    const summary = summarizeStock([
      product({ stock: 5 }),
      product({ stock: 15 }),
      product({ stock: 50 }),
      product({ stock: 50 }),
    ]);
    expect(summary).toEqual({ total: 4, normal: 2, bajo: 1, critico: 1 });
  });

  describe('formatPriceUSD', () => {
    it('formats numbers with two decimals', () => {
      expect(formatPriceUSD(10)).toBe('$10.00');
      expect(formatPriceUSD('19.5')).toBe('$19.50');
    });
    it('returns em dash for null/undefined/NaN', () => {
      expect(formatPriceUSD(null)).toBe('—');
      expect(formatPriceUSD(undefined)).toBe('—');
      expect(formatPriceUSD('abc')).toBe('—');
    });
  });

  it('formatPriceDecimal5 keeps five decimals', () => {
    expect(formatPriceDecimal5(1.5)).toBe('1.50000');
  });

  it('getDisplayPrice uses the latest price', () => {
    expect(getDisplayPrice(product({ latestPrice: '25' }))).toBe('$25.00');
    expect(getDisplayPrice(product({ latestPrice: null }))).toBe('—');
  });

  describe('filterProducts', () => {
    const products = [
      product({ skuSellerId: 1, name: 'Fertilizante NPK', sku: 'NPK-1', categoryId: 1, providerId: 1, stock: 5 }),
      product({ skuSellerId: 2, name: 'Insecticida', sku: 'INS-2', categoryId: 2, providerId: 2, stock: 50 }),
    ];

    it('returns all when no filters', () => {
      expect(filterProducts(products, {})).toHaveLength(2);
    });
    it('matches by search on name or sku (case-insensitive)', () => {
      expect(filterProducts(products, { search: 'npk' })).toHaveLength(1);
      expect(filterProducts(products, { search: 'INS-2' })).toHaveLength(1);
      expect(filterProducts(products, { search: 'zzz' })).toHaveLength(0);
    });
    it('filters by category, provider and stock state', () => {
      expect(filterProducts(products, { categoryId: 1 })).toHaveLength(1);
      expect(filterProducts(products, { providerId: 2 })).toHaveLength(1);
      expect(filterProducts(products, { stockState: 'critico' })).toHaveLength(1);
    });
  });
});
