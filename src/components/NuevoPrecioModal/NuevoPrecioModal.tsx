import { useState } from 'react';
import { useRegisterPrice } from '../../hooks/useRegisterPrice';

interface Props {
  skuSellerId: number;
  productName: string;
  currentPrice: number;
  unitName: string;
  onClose: () => void;
}

export function NuevoPrecioModal({
  skuSellerId,
  productName,
  currentPrice,
  unitName,
  onClose,
}: Props) {
  const [newPrice, setNewPrice] = useState('');
  const { mutate: registerPriceMutation, isPending, error } = useRegisterPrice();

  const parsed = Number(newPrice);
  const valid = newPrice !== '' && !Number.isNaN(parsed) && parsed > 0;
  const delta = valid ? parsed - currentPrice : 0;
  const deltaPct = valid && currentPrice > 0 ? (delta / currentPrice) * 100 : 0;
  const deltaUp = delta > 0;
  const deltaDown = delta < 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    registerPriceMutation(
      { skuSellerId, price: parsed.toFixed(5) },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-115 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] px-6 pb-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-[#F0FDF4]">
              <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#00A63E]" fill="none" aria-hidden="true">
                <path
                  d="M10 1.67v16.66M14.17 5H7.92a2.71 2.71 0 0 0 0 5.42h4.16a2.71 2.71 0 0 1 0 5.41H5"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold leading-7 text-[#0F172B]">Actualizar Precio</h2>
              <p className="text-sm leading-5 text-[#62748E]">{productName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="grid h-7 w-7 place-content-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#314158] disabled:opacity-50"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-5 px-6 pt-6">
            {/* Current price card */}
            <div className="flex items-center justify-between rounded-[10px] bg-[#F8FAFC] px-4 py-4">
              <div className="flex flex-col">
                <p className="text-xs leading-4 text-[#62748E]">Precio actual</p>
                <p className="mt-1 text-xs text-[#90A1B9]">por {unitName}</p>
              </div>
              <p className="text-2xl font-bold leading-8 text-[#0F172B] tabular-nums">
                ${currentPrice.toFixed(2)}
              </p>
            </div>

            {/* New price input */}
            <div>
              <label className="mb-2 block text-sm font-bold leading-5 text-[#314158]">
                Nuevo precio<span className="ml-0.5 text-[#E7000B]">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-[#62748E]">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={isPending}
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-8 pr-4 text-sm text-[#0F172A] outline-none transition-shadow focus:ring-2 focus:ring-[#75C79E]/40 disabled:opacity-60"
                />
              </div>
              <p className="mt-1.5 text-xs text-[#90A1B9]">El precio se aplicará a las próximas ventas.</p>
            </div>

            {/* Delta summary */}
            {valid && (
              <div
                className={[
                  'flex items-center justify-between rounded-[10px] border px-4 py-3',
                  deltaUp && 'border-[#FED7AA] bg-[#FFF7ED]',
                  deltaDown && 'border-[#BBF7D0] bg-[#F0FDF4]',
                  !deltaUp && !deltaDown && 'border-[#E2E8F0] bg-[#F8FAFC]',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="flex flex-col">
                  <p className="text-xs leading-4 text-[#62748E]">Diferencia</p>
                  <p
                    className={[
                      'text-sm font-bold leading-5',
                      deltaUp && 'text-[#C2410C]',
                      deltaDown && 'text-[#008236]',
                      !deltaUp && !deltaDown && 'text-[#314158]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {deltaUp ? 'Subida' : deltaDown ? 'Bajada' : 'Sin cambio'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {deltaUp && (
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#EA580C]" fill="none" aria-hidden="true">
                      <path d="M10 15.83V4.17M4.17 10L10 4.17 15.83 10" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {deltaDown && (
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#00A63E]" fill="none" aria-hidden="true">
                      <path d="M10 4.17v11.66M15.83 10L10 15.83 4.17 10" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <p className="text-base font-bold leading-6 text-[#0F172B] tabular-nums">
                    {delta >= 0 ? '+' : ''}${delta.toFixed(2)}
                  </p>
                  <span className="text-xs font-medium text-[#62748E] tabular-nums">
                    ({deltaPct >= 0 ? '+' : ''}{deltaPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
                No se pudo actualizar el precio.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3 border-t border-[#F1F5F9] bg-[#F8FAFC] px-6 py-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 text-sm font-bold text-[#314158] transition-colors hover:bg-[#F1F5F9] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid || isPending}
              className="flex-1 rounded-[10px] bg-[#75C79E] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6ab080] disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Actualizar Precio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
