import { useMemo, useState } from 'react';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { ChevronDownIcon } from '../components/Icons/ChevronDownIcon';
import { InventoryGlyph } from '../components/Icons/InventoryGlyph';
import { MetricCard } from '../components/MetricCard';
import { VerProductoModal } from '../components/VerProductoModal/VerProductoModal';
import { EditarProductoModal } from '../components/EditarProductoModal/EditarProductoModal';
import { PendingProductsPanel } from '../components/PendingProductsPanel/PendingProductsPanel';
import { DataTable } from '../components/DataTable/DataTable';
import type {
  InventoryStockState,
  InventoryTableRowData,
} from '../components/DataTable/InventoryTableRow';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import type { Product } from '../types/Product';
import {
  getDisplayPrice,
  getStockState,
  STOCK_LOW_THRESHOLD,
  summarizeStock,
} from '../services/products/inventoryHelpers';

const STOCK_MAX_BAR = 100;

function toLegacyStockState(stock: number): InventoryStockState {
  if (stock <= 0) return 'agotado';
  if (stock <= STOCK_LOW_THRESHOLD) return 'bajo';
  return 'ok';
}

function toRow(product: Product, categoryColor: string): InventoryTableRowData {
  const stock = product.stock;
  const stockState = toLegacyStockState(stock);
  const stockLabel =
    stock <= 0
      ? 'Agotado'
      : getStockState(stock) === 'critico'
        ? 'Stock crítico'
        : getStockState(stock) === 'bajo'
          ? 'Stock bajo'
          : 'Stock normal';

  return {
    id: String(product.skuSellerId),
    product: product.name,
    sku: product.sku,
    category: product.categoryName,
    categoryColor,
    price: getDisplayPrice(product),
    unitValue: product.unitValue,
    stock,
    stockMax: Math.max(stock, STOCK_MAX_BAR),
    stockState,
    stockLabel,
    unitName: product.unitName
      ? product.unitName + (product.unitValue > 1 ? 's' : '')
      : undefined,
    imagePath: product.firebaseImageId || undefined,
  };
}

function InventarioPanel() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [viewProductId, setViewProductId] = useState<number | null>(null);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const { data: products = [], isLoading, error } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const categoryColorById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c.colorHexa])),
    [categories],
  );

  const summary = useMemo(() => summarizeStock(products), [products]);

  const filteredRows = useMemo<InventoryTableRowData[]>(() => {
    const q = search.trim().toLowerCase();
    const cat = category.trim().toLowerCase();

    return products
      .filter((p) => {
        if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) {
          return false;
        }
        if (cat && p.categoryName.toLowerCase() !== cat) return false;
        return true;
      })
      .map((p) => toRow(p, categoryColorById.get(p.categoryId) ?? '#94A3B8'))
      .filter((row) => {
        if (!stockFilter) return true;
        return row.stockState === stockFilter;
      });
  }, [products, categoryColorById, search, category, stockFilter]);

  const headerActionText = isLoading
    ? 'Cargando…'
    : `Mostrando ${filteredRows.length} producto${filteredRows.length === 1 ? '' : 's'}`;

  const dot = <span className="h-2 w-2 rounded-full bg-current" />;
  const stats = [
    { title: 'Total Productos', value: summary.total, iconBg: '#DBEAFE', iconColor: '#155DFC', valueColor: '#101828', icon: <InventoryGlyph /> },
    { title: 'Stock Normal', value: summary.normal, iconBg: '#DCFCE7', iconColor: '#00A63E', valueColor: '#00A63E', icon: dot },
    { title: 'Stock Bajo', value: summary.bajo, iconBg: '#FFEDD4', iconColor: '#F54900', valueColor: '#F54900', icon: dot },
    { title: 'Stock Crítico', value: summary.critico, iconBg: '#FFE2E2', iconColor: '#E7000B', valueColor: '#E7000B', icon: dot },
  ];

  function handleDelete(id: string) {
    const name = filteredRows.find((r) => r.id === id)?.product ?? 'este producto';
    if (!window.confirm(`¿Eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    deleteMutation.mutate(Number(id));
  }

  return (
    <div data-testid="inventario-panel" className="flex min-h-full flex-col bg-[#F6F7F7] font-sans">
      <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm">
        <div className="flex min-h-24 items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-3xl font-black leading-9 tracking-[-0.75px] text-[#0F172A]">
              Inventario Global
            </h1>
            <p className="mt-1 text-base leading-6 text-[#64748B]">
              Monitorea el stock de todos los productos registrados en la plataforma.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-8">
        <PendingProductsPanel />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <MetricCard key={s.title} variant="compact" data={s} className="max-w-none" />
          ))}
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos por nombre o SKU..."
                className="w-full rounded-[10px] bg-[#F1F5F9] py-2.5 pl-9 pr-4 text-sm text-[#0F172A] placeholder-[#90A1B9] outline-none transition-shadow focus:ring-2 focus:ring-[#75C79E]/40"
              />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none rounded-[10px] bg-[#F1F5F9] py-2.5 pl-4 pr-9 text-sm text-[#0F172A] outline-none transition-shadow focus:ring-2 focus:ring-[#75C79E]/40"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.name.toLowerCase()}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
                <ChevronDownIcon />
              </span>
            </div>

            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="appearance-none rounded-[10px] bg-[#F1F5F9] py-2.5 pl-4 pr-9 text-sm text-[#0F172A] outline-none transition-shadow focus:ring-2 focus:ring-[#75C79E]/40"
              >
                <option value="">Todo el stock</option>
                <option value="ok">Stock normal</option>
                <option value="bajo">Stock bajo</option>
                <option value="agotado">Agotado</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <DataTable
          rows={filteredRows}
          title="Inventario"
          headerActionText={headerActionText}
          onView={(id) => setViewProductId(Number(id))}
          onEdit={(id) => setEditProductId(Number(id))}
          onDelete={handleDelete}
          pageText={`Pagina 1 de ${Math.max(1, Math.ceil(filteredRows.length / 10))}`}
          emptyText={
            error
              ? 'No se pudieron cargar los productos.'
              : isLoading
                ? 'Cargando productos…'
                : 'No hay productos para mostrar.'
          }
        />
      </div>

      {viewProductId !== null && (
        <VerProductoModal
          skuSellerId={viewProductId}
          onClose={() => setViewProductId(null)}
        />
      )}

      {editProductId !== null && (
        <EditarProductoModal
          skuSellerId={editProductId}
          onClose={() => setEditProductId(null)}
        />
      )}
    </div>
  );
}

export default InventarioPanel;
