import { useMemo, useState } from 'react';
import CategoryBadge from '../components/CategoryBadge/CategoryBadge';
import { ChevronDownIcon } from '../components/Icons/ChevronDownIcon';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { InventoryGlyph } from '../components/Icons/InventoryGlyph';
import { MetricCard } from '../components/MetricCard';
import {
  DataTableActionIcon,
  type DataTableActionIconName,
} from '../components/DataTable/DataTableIcons';
import { useFirebaseImageUrl } from '../hooks/useFirebaseImageUrl';
import { useCategories } from '../hooks/useCategories';
import { useProviders } from '../hooks/useProviders';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import type { Product } from '../types/Product';
import {
  STOCK_BADGE_STYLES,
  filterProducts,
  getDisplayPrice,
  getStockState,
  summarizeStock,
  type StockState,
} from '../services/products/inventoryHelpers';

function ProductImage({ path, alt }: { path?: string; alt: string }) {
  const isAlreadyUrl = !!path && /^https?:\/\//i.test(path);
  const { data: resolvedUrl } = useFirebaseImageUrl(isAlreadyUrl ? undefined : path);
  const src = isAlreadyUrl ? path : resolvedUrl;

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#F1F5F9]">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="text-base text-[#94A3B8]">📦</span>
      )}
    </div>
  );
}

function StockBadge({ state }: { state: StockState }) {
  const s = STOCK_BADGE_STYLES[state];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-0.75 text-xs font-medium text-(--bc) bg-(--bbg)"
      style={{ ['--bc' as string]: s.text, ['--bbg' as string]: s.bg } as React.CSSProperties}
    >
      {s.label}
    </span>
  );
}

function ActionBtn({
  icon,
  color,
  onClick,
  ariaLabel,
}: {
  icon: DataTableActionIconName;
  color: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="grid h-8 w-8 place-content-center rounded-[10px] text-(--c) transition-colors hover:bg-[#F1F5F9]"
      style={{ ['--c' as string]: color } as React.CSSProperties}
    >
      <DataTableActionIcon icon={icon} className="h-4 w-4" />
    </button>
  );
}

const ROW_ACTIONS: { icon: DataTableActionIconName; color: string; ariaLabel: string }[] = [
  { icon: 'ver', color: '#155DFC', ariaLabel: 'Ver producto' },
  { icon: 'editar', color: '#F54900', ariaLabel: 'Editar producto' },
  { icon: 'eliminar', color: '#E7000B', ariaLabel: 'Eliminar producto' },
];

function ProductRow({
  product,
  categoryColor,
  onDelete,
  isDeleting,
}: {
  product: Product;
  categoryColor: string;
  onDelete: (skuSellerId: number, name: string) => void;
  isDeleting: boolean;
}) {
  return (
    <tr className="border-b border-[#E5E7EB] last:border-b-0">
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-3">
          <ProductImage path={product.firebaseImageId || undefined} alt={product.name} />
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-base font-medium leading-6 text-[#101828]">{product.name}</p>
            <p className="text-sm leading-5 text-[#6A7282]">{getDisplayPrice(product)}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <span className="font-mono text-sm leading-5 text-[#4A5565]">{product.sku}</span>
      </td>
      <td className="px-6 py-4 align-middle">
        <CategoryBadge label={product.categoryName} color={categoryColor} />
      </td>
      <td className="px-6 py-4 align-middle">
        <span className="text-base font-medium leading-6 text-[#101828]">{product.stock}</span>
      </td>
      <td className="px-6 py-4 align-middle">
        <span className="text-base leading-6 text-[#4A5565]">
          {product.unitValue}{' '}
          {(product.unitName || 'u.') + (product.unitValue > 1 ? 's' : '')}
        </span>
      </td>
      <td className="px-6 py-4 align-middle">
        <StockBadge state={getStockState(product.stock)} />
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2">
          {ROW_ACTIONS.map((a) => (
            <ActionBtn
              key={a.icon}
              icon={a.icon}
              color={a.color}
              ariaLabel={a.ariaLabel}
              onClick={
                a.icon === 'eliminar'
                  ? () => !isDeleting && onDelete(product.skuSellerId, product.name)
                  : undefined
              }
            />
          ))}
        </div>
      </td>
    </tr>
  );
}

const TABLE_HEADERS = ['Producto', 'SKU', 'Categoría', 'Stock Actual', 'Unidad', 'Estado', 'Acciones'];

function InventarioPanel() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [stockState, setStockState] = useState<StockState | null>(null);

  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const providersQuery = useProviders();
  const deleteMutation = useDeleteProduct();

  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  const categoryColorById = useMemo(
    () => new Map(categories.map((c) => [c.categoryId, c.colorHexa])),
    [categories],
  );

  const filtered = useMemo(
    () => filterProducts(products, { search, categoryId, stockState }),
    [products, search, categoryId, stockState],
  );

  const summary = useMemo(() => summarizeStock(products), [products]);

  const dot = <span className="h-2 w-2 rounded-full bg-current" />;
  const stats = [
    { title: 'Total Productos', value: summary.total, iconBg: '#DBEAFE', iconColor: '#155DFC', valueColor: '#101828', icon: <InventoryGlyph /> },
    { title: 'Stock Normal', value: summary.normal, iconBg: '#DCFCE7', iconColor: '#00A63E', valueColor: '#00A63E', icon: dot },
    { title: 'Stock Bajo', value: summary.bajo, iconBg: '#FFEDD4', iconColor: '#F54900', valueColor: '#F54900', icon: dot },
    { title: 'Stock Crítico', value: summary.critico, iconBg: '#FFE2E2', iconColor: '#E7000B', valueColor: '#E7000B', icon: dot },
  ];

  function handleDelete(skuSellerId: number, name: string) {
    if (!window.confirm(`¿Eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) return;
    deleteMutation.mutate(skuSellerId);
  }

  const isInitialLoading = productsQuery.isLoading;
  const hasError = productsQuery.isError;

  let bodyContent: React.ReactNode;
  if (isInitialLoading) {
    bodyContent = (
      <td colSpan={7} className="px-6 py-14 text-center text-sm text-[#6A7282]">
        Cargando productos…
      </td>
    );
  } else if (hasError) {
    bodyContent = (
      <td colSpan={7} className="px-6 py-14 text-center text-sm text-[#E7000B]">
        No se pudieron cargar los productos. Intenta nuevamente.
      </td>
    );
  } else if (filtered.length === 0) {
    bodyContent = (
      <td colSpan={7} className="px-6 py-14 text-center text-sm text-[#6A7282]">
        {products.length === 0
          ? 'No hay productos registrados todavía.'
          : 'Ningún producto coincide con los filtros aplicados.'}
      </td>
    );
  }

  return (
    <div data-testid="inventario-panel" className="flex min-h-full flex-1 flex-col bg-[#F9FAFB]">
      <div className="flex-1 space-y-6 px-8 py-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold leading-9 tracking-[0.4px] text-[#101828]">
              Inventario Global
            </h1>
            <p className="mt-1 text-base leading-6 tracking-[-0.31px] text-[#4A5565]">
              Monitoreo en tiempo real de existencias y categorías
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <MetricCard key={s.title} variant="compact" data={s} className="max-w-none" />
          ))}
        </div>

        <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-65 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto por nombre o SKU..."
                className="w-full rounded-[10px] border border-[#D1D5DC] bg-white py-2 pl-10 pr-4 text-base leading-4.75 text-[#0F172A] placeholder-[rgba(10,10,10,0.5)] outline-none focus:ring-2 focus:ring-[#00A63E]/30"
              />
            </div>

            <div className="relative w-65">
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-white py-2 pl-4 pr-9 text-base leading-4.75 text-[#0F172A] outline-none focus:ring-2 focus:ring-[#00A63E]/30"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <ChevronDownIcon />
              </span>
            </div>

            <div className="relative w-55">
              <select
                value={stockState ?? ''}
                onChange={(e) => setStockState((e.target.value as StockState) || null)}
                className="w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-white py-2 pl-4 pr-9 text-base leading-4.75 text-[#0F172A] outline-none focus:ring-2 focus:ring-[#00A63E]/30"
              >
                <option value="">Todos los estados</option>
                <option value="normal">Stock Normal</option>
                <option value="bajo">Stock Bajo</option>
                <option value="critico">Stock Crítico</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <tr>
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-6 py-5 text-left text-xs font-medium uppercase leading-4 tracking-[0.6px] text-[#6A7282]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyContent ? (
                  <tr>{bodyContent}</tr>
                ) : (
                  filtered.map((p) => (
                    <ProductRow
                      key={p.skuSellerId}
                      product={p}
                      categoryColor={categoryColorById.get(p.categoryId) ?? '#94A3B8'}
                      onDelete={handleDelete}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm leading-5 text-[#6A7282]">
          Mostrando {filtered.length} de {products.length} producto{products.length === 1 ? '' : 's'}
          {providersQuery.data?.length ? ` · ${providersQuery.data.length} proveedores` : ''}
          {deleteMutation.isPending ? ' · Eliminando…' : ''}
        </p>
      </div>
    </div>
  );
}

export default InventarioPanel;
