import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '../Icons/CloseIcon';
import { HumidityIcon } from '../Icons/HumidityIcon';
import { RainDropIcon } from '../Icons/RainDropIcon';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { WindIcon } from '../Icons/WindIcon';
import type { WeatherData } from '../../services/weather/weatherService';
import { weatherService } from '../../services/weather/weatherService';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

function getWeatherEmoji(icon: string) {
  if (icon === 'sun') return '☀️';
  if (icon === 'cloud') return '☁️';
  if (icon === 'rain') return '🌧️';
  if (icon === 'storm') return '⛈️';
  return '☁️';
}

export interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeatherModal({ isOpen, onClose }: WeatherModalProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const loadWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError('Error al cargar datos del clima');
      console.error('Weather data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather data on mount or when modal opens
  useEffect(() => {
    if (isOpen && !weatherData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadWeatherData();
    }
  }, [isOpen, weatherData]);

  // Handle backdrop click to close modal
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

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherService.refreshWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError('Error al actualizar datos del clima');
      console.error('Weather data refresh error:', err);
    } finally {
      setIsLoading(false);
    }
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
            <p className="mt-1 text-sm leading-5 text-[#62748E]">Información relevante para la planificación de servicios</p>
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
        <div className="flex-1 min-h-0 px-6 py-6">
          {isLoading && !weatherData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <RefreshIcon />
              </div>
              <span className="ml-2 text-sm text-[#62748B]">Cargando datos...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">{error}</div>
          ) : weatherData ? (
            <div className="max-h-[calc(90vh-220px)] overflow-y-auto pr-1">
              <div className="space-y-4">
                {/* Regions */}
                {weatherData.regions.map((region) => (
                  <div key={region.id} className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-5">
                    {/* Weather Icon */}
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-content-center rounded-full bg-white shadow-sm">
                        <span className="text-2xl">{getWeatherEmoji(region.icon)}</span>
                      </div>

                      {/* Region Info */}
                      <div>
                        <h3 className="font-bold text-[#0F172A]">{region.name}</h3>
                        <p className="text-sm text-[#62748E]">{region.condition}</p>
                      </div>
                    </div>

                    {/* Temperature & Details */}
                    <div className="flex items-center gap-6">
                      <span className="text-[24px] font-bold text-[#0F172A]">{region.temperature}°C</span>

                      <div className="border-l border-[#E2E8F0] pl-6">
                        <div className="flex items-center gap-1 text-[12px] text-[#62748E]">
                          <HumidityIcon />
                          <span>{region.humidity}% Humedad</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#62748E]">
                          <WindIcon />
                          <span>{region.windSpeed} km/h Viento</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Alerts Section */}
                {weatherData.alerts.length > 0 && (
                  <div className="rounded-2xl border-t border-[#F1F5F9] bg-[#EFF6FF] px-4 py-6">
                    {weatherData.alerts.map((alert) => (
                      <div key={alert.id} className="flex gap-4">
                        <div className="mt-1 shrink-0">
                          <div className="h-5 w-5 text-[#155DFC]">
                            <RainDropIcon />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1C398E]">{alert.title}</h4>
                          <p className="mt-1 text-[12px] leading-4 text-[#1447E6]">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer with Refresh Button */}
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className={cx(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
              isLoading
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'cursor-pointer bg-[#75C79E] text-white hover:bg-[#6ab080]'
            )}
          >
            <RefreshIcon />
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
