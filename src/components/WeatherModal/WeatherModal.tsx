import { useEffect, useRef } from 'react';
import { CloseIcon } from '../Icons/CloseIcon';
import { HumidityIcon } from '../Icons/HumidityIcon';
import { RainDropIcon } from '../Icons/RainDropIcon';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { WindIcon } from '../Icons/WindIcon';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useQueryClient } from '@tanstack/react-query';

type WeatherIconType = 'sun' | 'cloud' | 'rain' | 'storm';

function getWeatherEmoji(icon: WeatherIconType) {
  if (icon === 'sun') return '☀️';
  if (icon === 'cloud') return '☁️';
  if (icon === 'rain') return '🌧️';
  return '⛈️';
}

export interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeatherModal({ isOpen, onClose }: WeatherModalProps) {
  const { locations, isLoading, isError, errorMessage } = useWeatherData();
  const queryClient = useQueryClient();
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

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['weather'] });
    void queryClient.invalidateQueries({ queryKey: ['client-locations'] });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="weather-modal-title"
    >
      <div className="flex max-h-[90vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-6">
          <div className="flex-1">
            <h2 id="weather-modal-title" className="text-[20px] font-bold leading-7 text-[#0F172B]">
              Reporte Climático por Región
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#62748E]">
              Información relevante para la planificación de servicios
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
          {isLoading && locations.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-[#75C79E]">
                <RefreshIcon />
              </div>
              <span className="ml-2 text-sm text-[#62748E]">Cargando datos del clima...</span>
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
              {errorMessage}
            </div>
          ) : (
            <div className="max-h-[calc(90vh-220px)] overflow-y-auto pr-1">
              <div className="space-y-4">
                {locations.map((loc) => (
                  <div
                    key={loc.clientId}
                    className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-content-center rounded-full bg-white shadow-sm">
                        <span className="text-2xl">{getWeatherEmoji(loc.icon)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A]">{loc.clientName}</h3>
                        <p className="text-sm text-[#62748E]">{loc.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-[24px] font-bold text-[#0F172A]">{loc.temperature}°C</span>
                      <div className="border-l border-[#E2E8F0] pl-6">
                        <div className="flex items-center gap-1 text-[12px] text-[#62748E]">
                          <HumidityIcon />
                          <span>{loc.humidity}% Humedad</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#62748E]">
                          <WindIcon />
                          <span>{loc.windSpeed} km/h Viento</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Weather alerts derived from rainy/stormy locations */}
                {locations.some((l) => l.icon === 'rain' || l.icon === 'storm') && (
                  <div className="rounded-2xl border-t border-[#F1F5F9] bg-[#EFF6FF] px-4 py-6">
                    {locations
                      .filter((l) => l.icon === 'rain' || l.icon === 'storm')
                      .map((l) => (
                        <div key={`alert-${l.clientId}`} className="flex gap-4">
                          <div className="mt-1 shrink-0">
                            <div className="h-5 w-5 text-[#155DFC]">
                              <RainDropIcon />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1C398E]">
                              {l.icon === 'storm' ? 'Tormenta eléctrica' : 'Alerta de precipitaciones'} — {l.clientName}
                            </h4>
                            <p className="mt-1 text-[12px] leading-4 text-[#1447E6]">
                              {l.condition}. Se recomienda revisar la planificación de servicios en esta zona.
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className={
              isLoading
                ? 'inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500'
                : 'inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#75C79E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6ab080]'
            }
          >
            <RefreshIcon />
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
