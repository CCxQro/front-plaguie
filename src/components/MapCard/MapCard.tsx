import type { HTMLAttributes } from 'react';

import type { CardData, CardFieldMap, MapPin } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

function LocationPin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 24" aria-hidden="true" className="h-5 w-5" style={{ color }}>
      <path
        fill="currentColor"
        d="M10 0C5.4 0 1.66 3.7 1.66 8.25 1.66 14.5 10 24 10 24s8.34-9.5 8.34-15.75C18.34 3.7 14.6 0 10 0Zm0 11.33a3.08 3.08 0 1 1 0-6.16 3.08 3.08 0 0 1 0 6.16Z"
      />
    </svg>
  );
}

type WeatherIconType = 'sun' | 'cloud' | 'rain' | 'storm';

export interface WeatherMapPoint {
  left: string;
  top: string;
  icon: WeatherIconType;
  temperature?: string;
}

function getWeatherEmoji(icon: WeatherIconType) {
  if (icon === 'sun') return '☀️';
  if (icon === 'cloud') return '☁️';
  if (icon === 'rain') return '🌧️';

  return '⛈️';
}

function WeatherMarker({ point }: { point: WeatherMapPoint }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_3px_6px_rgba(0,0,0,0.12)]"
      style={{ left: point.left, top: point.top }}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="grid h-5 w-5 place-content-center text-sm" aria-hidden="true">
          {getWeatherEmoji(point.icon)}
        </div>

        {point.temperature ? (
          <span className="inline-flex h-4.75 min-w-6.75 items-center justify-center rounded bg-white/90 px-1 text-[10px] font-bold leading-[15px] text-[#1D293D]">
            {point.temperature}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export interface MapCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
  variant?: 'weather' | 'locations';
  weatherPoints?: WeatherMapPoint[];
  locationPoints?: MapPin[];
  onWeatherClick?: () => void;
  onLocationsClick?: () => void;
}

export function MapCard({
  data,
  fieldMap,
  variant = 'locations',
  weatherPoints: weatherPointsProp,
  locationPoints: locationPointsProp,
  className,
  onWeatherClick,
  onLocationsClick,
  ...props
}: MapCardProps) {
  const title = getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const value = getMappedValue<string | number>(data, 'value', fieldMap);
  const description = getMappedValue<string>(data, 'description', fieldMap);
  const actionLabel = getMappedValue<string>(data, 'actionLabel', fieldMap) ?? 'Ver mapa completo';

  const locationPoints =
    locationPointsProp ??
    getMappedValue<MapPin[]>(data, 'locationPoints', fieldMap) ??
    getMappedValue<MapPin[]>(data, 'locations', fieldMap) ??
    [
      { color: '#EF4444', left: '2rem', top: '3.5rem' },
      { color: '#EF4444', left: '6.25rem', top: '1.75rem' },
      { color: '#F97316', left: '10.25rem', top: '7.5rem' },
    ];

  const weatherPoints =
    weatherPointsProp ??
    getMappedValue<WeatherMapPoint[]>(data, 'weatherPoints', fieldMap) ??
    [
      { left: '62px', top: '52px', icon: 'sun', temperature: '28°' },
      { left: '135px', top: '73px', icon: 'cloud', temperature: '22°' },
      { left: '83px', top: '146px', icon: 'rain', temperature: '18°' },
    ];

  const isWeather = variant === 'weather';
  const isLocations = variant === 'locations';
  const handleClick = isWeather ? onWeatherClick : isLocations ? onLocationsClick : undefined;

  return (
    <section
      className={cx(
        'w-full max-w-[262px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        className,
      )}
      {...props}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-left text-lg font-medium leading-5.5 text-[#0F172A]">{title}</h3>
          {value !== undefined ? <p className="mt-1 text-sm text-[#64748B]">{String(value)}</p> : null}
        </div>

        <button
          type="button"
          className={cx('text-right text-xs font-medium leading-3.75 text-[#75C79E]', !!handleClick && 'cursor-pointer hover:text-[#6ab080] transition')}
          onClick={() => handleClick?.()}
        >
          {actionLabel}
        </button>
      </header>

      <div
        className={cx(
          'relative mt-4 h-52.5 overflow-hidden rounded-lg border border-[#D7E1EA] bg-[#E7EEF3]',
          !!handleClick && 'cursor-pointer transition hover:opacity-90',
        )}
        onClick={() => handleClick?.()}
        role={handleClick ? 'button' : undefined}
        tabIndex={handleClick ? 0 : undefined}
        onKeyDown={(e) => handleClick && (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.45),transparent_42%),linear-gradient(135deg,#EAF1F6,#D8E4ED)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(28deg,transparent_0_18px,rgba(255,255,255,0.45)_18px_22px,transparent_22px_52px),repeating-linear-gradient(-34deg,transparent_0_24px,rgba(255,255,255,0.4)_24px_28px,transparent_28px_58px)] opacity-70" />
        <div className="absolute left-4.5 top-7.5 h-14 w-17.5 rounded-2xl bg-[#CDECCF]/70" />
        <div className="absolute right-4 top-21.5 h-12 w-15.5 rounded-[14px] bg-[#CDECCF]/70" />
        <div className="absolute left-18.5 bottom-4.5 h-10 w-19.5 rounded-[14px] bg-[#CDECCF]/60" />

        {isWeather
          ? weatherPoints.map((point, index) => (
              <WeatherMarker
                key={`${point.left}-${point.top}-${index}`}
                point={point}
              />
            ))
          : locationPoints.map((pin, index) => (
              <div
                key={`${pin.left}-${pin.top}-${index}`}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ left: pin.left, top: pin.top }}
              >
                <LocationPin color={pin.color ?? '#EF4444'} />
              </div>
            ))}

        {description ? (
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[-0.5px] text-[#DC2626]">{description}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
