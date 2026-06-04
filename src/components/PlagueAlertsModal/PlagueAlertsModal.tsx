import { useRef, useEffect } from 'react';
import { CloseIcon } from '../Icons/CloseIcon';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { PlagueAlertCard } from '../PlagueAlertCard/PlagueAlertCard';
import type { PlagueAlertCardProps, PlagueAlertVariant } from '../PlagueAlertCard/PlagueAlertCard';
import { useNearbyAlerts } from '../../hooks/useNearbyAlerts';
import type { EarlyAlert } from '../../types/EarlyAlert';

export interface PlagueAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerMapaCompleto?: () => void;
}

const mapAlertToCardProps = (alert: EarlyAlert): PlagueAlertCardProps => {
  const date = alert.createdAt ? new Date(alert.createdAt) : new Date();
  
  return {
    variant: (alert.severidad as PlagueAlertVariant) || 'informacion',
    titulo: alert.titulo || 'Alerta de Plaga',
    ubicacion: `${alert.stateName || 'Ubicación desconocida'} (a ${alert.distanceKm?.toFixed(1) ?? '?'} km)`,
    tiempo: date.toLocaleDateString('es-MX'),
    tipoPlaga: alert.tipoPlaga || 'Desconocida',
    hectareas: alert.hectareas ? `${alert.hectareas} hectáreas` : 'Área no especificada',
  };
};

export function PlagueAlertsModal({ isOpen, onClose, onVerMapaCompleto }: PlagueAlertsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Usar radio de 100km por defecto, desactivar fetch si modal cerrado
  const { data: alertsData, isLoading, error } = useNearbyAlerts(100, { enabled: isOpen });
  const alerts = alertsData || [];

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

  const count = alerts.length;
  const subtitle =
    count === 1
      ? '1 incidente reportado que requiere atención'
      : `${count} incidentes reportados que requieren atención`;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="plague-alerts-modal-title"
      data-testid="plague-alerts-modal"
    >
      <div className="flex max-h-[90vh] min-h-0 w-full max-w-[700px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <h2 id="plague-alerts-modal-title" className="text-[20px] font-bold leading-7 text-[#0F172B]">
              Alertas de Plagas Detectadas
            </h2>
            {!isLoading && !error && (
              <p className="mt-1 text-sm leading-5 text-[#62748E]">{subtitle}</p>
            )}
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
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-6 pr-5">
          {isLoading && alerts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-[#75C79E]">
                <RefreshIcon />
              </div>
              <span className="ml-2 text-sm text-[#62748E]">Cargando alertas...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">{error.message}</div>
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              {alerts.map((alert, index) => (
                <PlagueAlertCard key={alert.alertaId || index} {...mapAlertToCardProps(alert)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#F1F5F9] px-6 py-4">
          <button
            type="button"
            onClick={onVerMapaCompleto}
            className="cursor-pointer rounded-[10px] bg-[#75C79E] px-5 py-2.5 text-sm font-bold leading-5 text-white transition hover:bg-[#6ab080]"
          >
            Ver Mapa Completo
          </button>
        </div>
      </div>
    </div>
  );
}
