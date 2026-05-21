import { useState } from 'react';
import { useStockMovement, type StockMovement } from '../../hooks/useStockMovement';

interface Props {
  skuSellerId: number;
  productName: string;
  currentStock: number;
  unitName: string;
  onClose: () => void;
}

export function AjustarStockModal({
  skuSellerId,
  productName,
  currentStock,
  unitName,
  onClose,
}: Props) {
  const [movement, setMovement] = useState<StockMovement>('add');
  const [quantity, setQuantity] = useState('');
  const { mutate: stockMutation, isPending, error } = useStockMovement();

  const parsed = Number(quantity);
  const validQty = quantity !== '' && !Number.isNaN(parsed) && parsed > 0;
  const validRemove = movement === 'add' ? true : validQty && parsed <= currentStock;
  const valid = validQty && validRemove;

  const projected = !validQty
    ? currentStock
    : movement === 'add'
      ? currentStock + parsed
      : Math.max(0, currentStock - parsed);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    stockMutation(
      { skuSellerId, movement, cantidad: parsed },
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
      <div className="flex w-full max-w-125 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F1F5F9] px-6 pb-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full bg-[#EFF6FF]">
              <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#2563EB]" fill="none" aria-hidden="true">
                <path
                  d="M16.67 5l-6.67 3.33L3.33 5m13.34 0l-6.67-3.33L3.33 5m13.34 0v10l-6.67 3.33m-6.67-13.33v10l6.67 3.33m0-10v10"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold leading-7 text-[#0F172B]">Ajustar Stock</h2>
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
            {/* Current stock card */}
            <div className="flex items-center justify-between rounded-[10px] bg-[#F8FAFC] px-4 py-4">
              <div className="flex flex-col">
                <p className="text-xs leading-4 text-[#62748E]">Stock actual</p>
                <p className="mt-1 text-xs text-[#90A1B9]">unidad: {unitName}</p>
              </div>
              <p className="text-2xl font-bold leading-8 text-[#0F172B] tabular-nums">
                {currentStock}
              </p>
            </div>

            {/* Movement toggle */}
            <div>
              <p className="mb-2 text-sm font-bold leading-5 text-[#314158]">Tipo de movimiento</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMovement('add')}
                  disabled={isPending}
                  className={[
                    'flex items-center justify-center gap-2 rounded-[10px] border-2 px-4 py-3 text-sm font-bold transition-colors disabled:opacity-50',
                    movement === 'add'
                      ? 'border-[#75C79E] bg-[#F0FDF4] text-[#008236]'
                      : 'border-[#E2E8F0] bg-white text-[#62748E] hover:bg-[#F8FAFC]',
                  ].join(' ')}
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M10 4.17v11.66M4.17 10h11.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setMovement('remove')}
                  disabled={isPending}
                  className={[
                    'flex items-center justify-center gap-2 rounded-[10px] border-2 px-4 py-3 text-sm font-bold transition-colors disabled:opacity-50',
                    movement === 'remove'
                      ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]'
                      : 'border-[#E2E8F0] bg-white text-[#62748E] hover:bg-[#F8FAFC]',
                  ].join(' ')}
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M4.17 10h11.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Quitar
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-bold leading-5 text-[#314158]">
                Cantidad<span className="ml-0.5 text-[#E7000B]">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const n = Math.max(0, (Number(quantity) || 0) - 1);
                    setQuantity(String(n));
                  }}
                  disabled={isPending}
                  className="grid h-10 w-10 shrink-0 place-content-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#314158] transition-colors hover:bg-[#F1F5F9] disabled:opacity-50"
                  aria-label="Restar"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M4.17 10h11.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  disabled={isPending}
                  className="flex-1 rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-center text-base font-bold text-[#0F172A] outline-none transition-shadow focus:ring-2 focus:ring-[#75C79E]/40 tabular-nums disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => {
                    const n = (Number(quantity) || 0) + 1;
                    setQuantity(String(n));
                  }}
                  disabled={isPending}
                  className="grid h-10 w-10 shrink-0 place-content-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#314158] transition-colors hover:bg-[#F1F5F9] disabled:opacity-50"
                  aria-label="Sumar"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M10 4.17v11.66M4.17 10h11.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {movement === 'remove' && validQty && !validRemove && (
                <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                  No puedes quitar más de {currentStock} unidades.
                </p>
              )}
            </div>

            {/* Projected stock */}
            <div className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              <div className="flex flex-col">
                <p className="text-xs leading-4 text-[#62748E]">Stock resultante</p>
                <p className="mt-0.5 text-xs text-[#90A1B9]">después del ajuste</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#90A1B9] tabular-nums line-through">{currentStock}</p>
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#62748E]" fill="none" aria-hidden="true">
                  <path d="M4.17 10h11.66M11.67 6.67L15.83 10l-4.16 3.33" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p
                  className={[
                    'text-2xl font-bold leading-8 tabular-nums',
                    movement === 'add' && validQty ? 'text-[#008236]' : '',
                    movement === 'remove' && validQty ? 'text-[#B91C1C]' : '',
                    !validQty ? 'text-[#0F172B]' : '',
                  ].join(' ')}
                >
                  {projected}
                </p>
              </div>
            </div>

            {error && (
              <p className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
                No se pudo registrar el movimiento.
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
              {isPending ? 'Guardando…' : 'Confirmar Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
