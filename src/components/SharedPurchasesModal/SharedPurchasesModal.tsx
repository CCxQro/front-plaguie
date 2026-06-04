import { useEffect, useRef } from 'react';
import { CloseIcon } from '../Icons/CloseIcon';
import { useSharedPurchases } from '../../hooks/useSharedPurchases';
import { MetricMoneyIcon } from '../Icons/MetricMoneyIcon';

export interface SharedPurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SharedPurchasesModal({ isOpen, onClose }: SharedPurchasesModalProps) {
  const { data: sharedPurchases, isLoading, isError, error } = useSharedPurchases();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBackdropClick = (e: MouseEvent) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleBackdropClick);
      return () => document.removeEventListener('mousedown', handleBackdropClick);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="shared-purchases-modal-title"
      data-testid="shared-purchases-modal"
    >
      <div className="flex max-h-[90vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-6">
          <div className="flex-1">
            <h2 id="shared-purchases-modal-title" className="text-[20px] font-bold leading-7 text-[#0F172B]">
              Pedidos Compartidos
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#62748E]">
              Información de compras que los agricultores han compartido contigo
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#90A1B9] transition hover:bg-slate-100"
            aria-label="Cerrar modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2B7FFF]" />
              <span className="ml-2 text-sm text-[#62748E]">Cargando pedidos compartidos...</span>
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
              {error instanceof Error ? error.message : 'Error al cargar pedidos compartidos'}
            </div>
          ) : sharedPurchases.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#0F172A]">No hay pedidos compartidos</p>
              <p className="mt-1 text-xs text-[#62748E]">
                Aún no han compartido pedidos contigo.
              </p>
            </div>
          ) : (
            <div className="max-h-[calc(90vh-180px)] overflow-y-auto pr-1">
              <div className="space-y-4">
                {sharedPurchases.map((purchase) => (
                  <div
                    key={purchase.orderId}
                    className="flex flex-col gap-3 rounded-2xl bg-[#F8FAFC] px-5 py-5 border border-[#F1F5F9]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-content-center rounded-full bg-white shadow-sm text-[#75C79E]">
                          <MetricMoneyIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0F172A]">{purchase.farmer.name}</h3>
                          <p className="text-xs text-[#62748E]">Pedido #{purchase.orderId} • {new Date(purchase.orderDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[18px] font-bold text-[#0F172A]">${purchase.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pl-13 space-y-2">
                      <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Productos</h4>
                      <div className="space-y-1">
                        {purchase.details.map((detail, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-[#0F172A]">{detail.quantity}x {detail.productName}</span>
                            <span className="text-[#64748B]">${detail.unitPrice.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
