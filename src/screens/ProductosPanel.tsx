import { useMemo, useState } from 'react';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { ChevronDownIcon } from '../components/Icons/ChevronDownIcon';
import { NuevoProductoModal } from '../components/NuevoProductoModal/NuevoProductoModal';
import { DataTable } from '../components/DataTable/DataTable';
import type {
  InventoryStockState,
  InventoryTableRowData,
} from '../components/DataTable/InventoryTableRow';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import type { Product } from '../types/Product';
import {
  getDisplayPrice,
  getStockState,
  STOCK_LOW_THRESHOLD,
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

function ProductosPanel() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data: products = [], isLoading, error } = useProducts();
  const { data: categories = [] } = useCategories();

  const categoryColorById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c.colorHexa])),
    [categories],
  );

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

  return (
    <div className="flex min-h-full flex-col bg-[#F6F7F7] font-sans">
      <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm">
        <div className="flex min-h-24 items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-3xl font-black leading-9 tracking-[-0.75px] text-[#0F172A]">
              Gestión de Inventario
            </h1>
            <p className="mt-1 text-base leading-6 text-[#64748B]">
              Administra y monitorea el stock de productos agroquímicos de forma eficiente.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#75C79E] px-5 py-2.5 text-base font-bold text-[#0F172A] shadow-sm transition-colors hover:bg-[#6ab080] active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-8">
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
          onView={(id) => {
            const name = filteredRows.find((r) => r.id === id)?.product;
            console.log('ver', { id, name });
          }}
          onEdit={(id) => {
            const name = filteredRows.find((r) => r.id === id)?.product;
            console.log('editar', { id, name });
          }}
          onDelete={(id) => {
            const name = filteredRows.find((r) => r.id === id)?.product;
            console.log('eliminar', { id, name });
          }}
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

      {showModal && <NuevoProductoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default ProductosPanel;
