import { useProduct } from '../../hooks/useProduct';
import { useCategories } from '../../hooks/useCategories';
import { useFirebaseImageUrl } from '../../hooks/useFirebaseImageUrl';
import CategoryBadge from '../CategoryBadge/CategoryBadge';
import {
  getDisplayPrice,
  getStockState,
  type StockState,
} from '../../services/products/inventoryHelpers';

interface Props {
  skuSellerId: number;
  onClose: () => void;
}

interface StockTheme {
  container: string;
  iconColor: string;
  label: string;
  labelColor: string;
  icon: 'check' | 'warning' | 'cross';
}

const STOCK_THEMES: Record<StockState | 'agotado', StockTheme> = {
  normal: {
    container: 'border-[#B9F8CF] bg-[#F0FDF4]',
    iconColor: 'text-[#00A63E]',
    label: 'En Stock',
    labelColor: 'text-[#008236]',
    icon: 'check',
  },
  bajo: {
    container: 'border-[#FED7AA] bg-[#FFF7ED]',
    iconColor: 'text-[#EA580C]',
    label: 'Stock Bajo',
    labelColor: 'text-[#C2410C]',
    icon: 'warning',
  },
  critico: {
    container: 'border-[#FECACA] bg-[#FEF2F2]',
    iconColor: 'text-[#DC2626]',
    label: 'Stock Crítico',
    labelColor: 'text-[#B91C1C]',
    icon: 'warning',
  },
  agotado: {
    container: 'border-[#FECACA] bg-[#FEF2F2]',
    iconColor: 'text-[#DC2626]',
    label: 'Agotado',
    labelColor: 'text-[#B91C1C]',
    icon: 'cross',
  },
};

function pluralUnit(unit: string | undefined, count: number): string {
  if (!unit) return '';
  return count === 1 ? unit : `${unit}s`;
}

function StockIcon({ kind, className }: { kind: StockTheme['icon']; className: string }) {
  if (kind === 'cross') {
    return (
      <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.34" stroke="currentColor" strokeWidth="1.67" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'warning') {
    return (
      <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
        <path d="M10 2.5l8.34 14.17H1.66L10 2.5z" stroke="currentColor" strokeWidth="1.67" strokeLinejoin="round" />
        <path d="M10 8v3.33M10 14.17h.01" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.34" stroke="currentColor" strokeWidth="1.67" />
      <path d="M6.67 10.42l2.5 2.5 4.16-5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductImage({ path, alt }: { path: string | null | undefined; alt: string }) {
  const { data: url } = useFirebaseImageUrl(path || undefined);
  return (
    <div className="grid h-32 w-32 shrink-0 place-content-center overflow-hidden rounded-[10px] bg-[#F1F5F9]">
      {url ? (
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-3xl text-[#94A3B8]">📦</span>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs leading-4 text-[#62748E]">{label}</p>
      <p className="text-sm font-bold leading-5 text-[#0F172B]">{value}</p>
    </div>
  );
}

export function VerProductoModal({ skuSellerId, onClose }: Props) {
  const { data: product, isLoading, error } = useProduct(skuSellerId);
  const { data: categories = [] } = useCategories();

  const categoryColor =
    (product && categories.find((c) => c.categoryId === product.categoryId)?.colorHexa) ?? '#94A3B8';

  const stockState: keyof typeof STOCK_THEMES = product
    ? product.stock <= 0
      ? 'agotado'
      : getStockState(product.stock)
    : 'normal';
  const theme = STOCK_THEMES[stockState];

  const unitPlural = product ? pluralUnit(product.unitName, product.unitValue) : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-150 max-h-[90vh] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] px-6 pb-6 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-7 text-[#0F172B]">Detalles del Producto</h2>
            <p className="text-sm leading-5 text-[#62748E]">
              SKU: {product?.sku ?? '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-content-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#314158]"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pt-6">
          {isLoading && (
            <p className="py-12 text-center text-sm text-[#62748E]">Cargando producto…</p>
          )}

          {error && !isLoading && (
            <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
              No se pudo cargar el producto.
            </p>
          )}

          {product && (
            <div className="flex flex-col gap-6">
              {/* Image + name + stock card */}
              <div className="flex gap-6">
                <ProductImage path={product.firebaseImageId} alt={product.name} />

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <h3 className="text-2xl font-bold leading-8 text-[#0F172B]">
                    {product.name}
                  </h3>

                  <div className={`flex items-center gap-3 rounded-[10px] border px-3 py-3 ${theme.container}`}>
                    <StockIcon kind={theme.icon} className={`h-5 w-5 shrink-0 ${theme.iconColor}`} />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs leading-4 text-[#62748E]">Estado de Stock</p>
                      <p className={`text-sm font-bold leading-5 ${theme.labelColor}`}>
                        {theme.label}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <p className="text-xs leading-4 text-[#62748E]">Disponible</p>
                      <p className="text-2xl font-bold leading-8 text-[#0F172B] tabular-nums">
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two cards row: Categoría | Precio */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 rounded-[10px] bg-[#F8FAFC] px-4 py-4">
                  <p className="text-xs leading-4 text-[#62748E]">Categoría</p>
                  <div>
                    <CategoryBadge label={product.categoryName} color={categoryColor} />
                  </div>
                </div>

                <div className="flex flex-col gap-1 rounded-[10px] bg-[#F8FAFC] px-4 py-4">
                  <p className="text-xs leading-4 text-[#62748E]">Precio</p>
                  <p className="text-2xl font-bold leading-8 text-[#0F172B]">
                    {getDisplayPrice(product)}
                  </p>
                </div>
              </div>

              {/* Info list (only real Product fields) */}
              <div className="flex flex-col gap-3">
                <DetailRow label="Proveedor" value={product.providerName || '—'} />
                <DetailRow label="Vendedor" value={product.sellerName || '—'} />
                <DetailRow
                  label="Unidad de Medida"
                  value={
                    unitPlural
                      ? `${product.unitValue} ${unitPlural}`
                      : String(product.unitValue)
                  }
                />
                <DetailRow label="Estado" value={product.statusName || '—'} />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 border-t border-[#F1F5F9] pt-4">
                <p className="text-xs leading-4 text-[#62748E]">Descripción</p>
                <p className="text-sm leading-[23px] text-[#45556C]">
                  {product.description || 'Sin descripción.'}
                </p>
              </div>

              <div className="h-2" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] px-6 pb-6 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[10px] bg-[#75C79E] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6ab080]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
