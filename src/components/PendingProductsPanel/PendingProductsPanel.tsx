import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, validateProduct } from '../../services/products/productsService';
import type { Product } from '../../types/Product';
import { VerProductoModal } from '../VerProductoModal/VerProductoModal';

type PendingAction = 'approve' | 'reject';

export function PendingProductsPanel() {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<{ product: Product; action: PendingAction } | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Status 2 = Revision
  const { data: pending = [], isLoading, error: queryError } = useQuery({
    queryKey: ['pendingProducts'],
    queryFn: () => getProducts({ statusId: 2 }),
    staleTime: 60 * 1000,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['pendingProducts'] });
    void queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const approveMutation = useMutation({
    mutationFn: (skuSellerId: number) => validateProduct(skuSellerId, 1),
    onSuccess: () => {
      invalidate();
      setConfirm(null);
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'No se pudo aprobar el producto'),
  });

  const rejectMutation = useMutation({
    mutationFn: (skuSellerId: number) => validateProduct(skuSellerId, 3),
    onSuccess: () => {
      invalidate();
      setConfirm(null);
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'No se pudo rechazar el producto'),
  });

  const isMutating = approveMutation.isPending || rejectMutation.isPending;
  const queryErrorMessage = queryError instanceof Error ? queryError.message : null;

  const handleConfirm = () => {
    if (!confirm?.product) return;
    const skuSellerId = confirm.product.skuSellerId;
    if (confirm.action === 'approve') {
      approveMutation.mutate(skuSellerId);
    } else {
      rejectMutation.mutate(skuSellerId);
    }
  };

  if (pending.length === 0 && !isLoading && !queryError) {
    return null;
  }

  return (
    <section
      data-testid="pending-products-panel"
      className="mb-6 rounded-[14px] border border-[#FEF08A] bg-[#FEFCE8] p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">⏳</span>
        <h2 className="text-lg font-bold text-[#101828]">Productos pendientes de aprobación</h2>
        <span
          data-testid="pending-products-count"
          className="ml-1 inline-flex items-center rounded-full bg-[#FACC15] px-2.5 py-0.5 text-xs font-semibold text-[#713F12]"
        >
          {pending.length}
        </span>
      </div>

      {error ? <p className="mb-3 text-sm text-[#E7000B]">{error}</p> : null}

      {queryErrorMessage ? (
        <p className="text-sm text-[#E7000B]">{queryErrorMessage}</p>
      ) : isLoading ? (
        <p className="text-sm text-[#6A7282]">Cargando productos pendientes...</p>
      ) : pending.length === 0 ? (
        <p data-testid="pending-products-empty" className="text-sm text-[#6A7282]">
          No hay productos pendientes de aprobación.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.map((product) => (
            <li
              key={product.skuSellerId}
              data-testid="pending-product-row"
              className="flex flex-col gap-3 rounded-[10px] border border-[#FDE68A] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 shrink-0 place-content-center overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  {product.firebaseImageId ? (
                    <img
                      src={product.firebaseImageId}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#90A1B9]" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-medium text-[#101828]">
                      {product.name}
                    </p>
                    <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 font-mono text-xs font-medium text-[#4A5565]">
                      SKU: {product.sku}
                    </span>
                  </div>
                  <p className="text-sm text-[#6A7282]">{product.sellerName ?? 'Vendedor desconocido'}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#1D4ED8]">
                      {product.categoryName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF9C3] px-2.5 py-0.5 text-xs font-medium text-[#854D0E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" />
                      En Revisión
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="view-pending-product-button"
                  aria-label={`Ver detalle de ${product.name}`}
                  onClick={() => setDetailProduct(product)}
                  className="h-9 rounded-[10px] border border-[#D1D5DC] px-4 text-sm font-medium text-[#364153] hover:bg-[#F3F4F6]"
                >
                  Ver detalle
                </button>
                <button
                  type="button"
                  data-testid="approve-product-button"
                  aria-label={`Aprobar ${product.name}`}
                  disabled={isMutating}
                  onClick={() => {
                    setError(null);
                    setConfirm({ product, action: 'approve' });
                  }}
                  className="h-9 rounded-[10px] bg-[#00A63E] px-4 text-sm font-medium text-white hover:bg-[#008c35] disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  data-testid="reject-product-button"
                  aria-label={`Rechazar ${product.name}`}
                  disabled={isMutating}
                  onClick={() => {
                    setError(null);
                    setConfirm({ product, action: 'reject' });
                  }}
                  className="h-9 rounded-[10px] border border-[#E7000B] px-4 text-sm font-medium text-[#E7000B] hover:bg-[#FEF2F2] disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {detailProduct ? (
        <VerProductoModal
          skuSellerId={detailProduct.skuSellerId}
          onClose={() => setDetailProduct(null)}
        />
      ) : null}

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            data-testid="confirm-product-modal"
          >
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">
              {confirm.action === 'approve' ? 'Aprobar producto' : 'Rechazar producto'}
            </h2>
            <p className="mt-4 text-base text-[#4A5565]">
              ¿Está seguro que desea {confirm.action === 'approve' ? 'aprobar' : 'rechazar'} el producto{' '}
              <span className="font-medium text-[#101828]">{confirm.product.name}</span>?{' '}
              {confirm.action === 'approve'
                ? 'El producto será visible para todos en el marketplace.'
                : 'El producto no se publicará y su estado cambiará a Rechazado.'}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
              >
                Cancelar
              </button>
              <button
                type="button"
                data-testid="confirm-product-action"
                onClick={handleConfirm}
                disabled={isMutating}
                className={`h-10.5 flex-1 rounded-[10px] text-base font-medium text-white disabled:opacity-60 ${
                  confirm.action === 'approve'
                    ? 'bg-[#00A63E] hover:bg-[#008c35]'
                    : 'bg-[#E7000B] hover:bg-[#c40009]'
                }`}
              >
                {isMutating ? 'Procesando...' : confirm.action === 'approve' ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
