import type { HTMLAttributes, ReactNode } from 'react';

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

export interface MapCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
  variant?: 'incidents' | 'weather' | 'parcel';
  cardTitle?: ReactNode;
  cardValue?: ReactNode;
  cardDescription?: ReactNode;
  cardActionLabel?: ReactNode;
  cardLocations?: MapPin[];
  cardHumidity?: ReactNode;
  cardWind?: ReactNode;
  cardTemperature?: ReactNode;
  cardCrop?: ReactNode;
  cardArea?: ReactNode;
  cardHarvest?: ReactNode;
  cardLastInspection?: ReactNode;
  cardWeatherIcon?: ReactNode;
  pinRenderer?: (pin: MapPin, index: number) => ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  mapAreaClassName?: string;
  weatherStatsClassName?: string;
}

export function MapCard({
  data,
  fieldMap,
  variant = 'incidents',
  cardTitle,
  cardValue,
  cardDescription,
  cardActionLabel,
  cardLocations,
  cardHumidity,
  cardWind,
  cardTemperature,
  cardCrop,
  cardArea,
  cardHarvest,
  cardLastInspection,
  cardWeatherIcon,
  pinRenderer,
  containerClassName,
  headerClassName,
  titleClassName,
  valueClassName,
  descriptionClassName,
  actionClassName,
  mapAreaClassName,
  weatherStatsClassName,
  className,
  ...props
}: MapCardProps) {
  const resolvedTitle = cardTitle ?? getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const resolvedValue = cardValue ?? getMappedValue<string | number>(data, 'value', fieldMap);
  const resolvedDescription = cardDescription ?? getMappedValue<ReactNode>(data, 'description', fieldMap);
  const resolvedActionLabel = cardActionLabel ?? getMappedValue<string>(data, 'actionLabel', fieldMap) ?? 'Ver mapa completo';
  const resolvedLocations =
    cardLocations ??
    getMappedValue<MapPin[]>(data, 'locations', fieldMap) ?? [
      { color: '#EF4444', left: '2rem', top: '3.5rem' },
      { color: '#EF4444', left: '6.25rem', top: '1.75rem' },
      { color: '#F97316', left: '10.25rem', top: '7.5rem' },
    ];

  const resolvedHumidity = cardHumidity ?? (typeof data.humidity === 'string' ? data.humidity : '45% Humedad');
  const resolvedWind = cardWind ?? (typeof data.wind === 'string' ? data.wind : '12 km/h Viento');
  const resolvedTemperature =
    cardTemperature ?? (typeof data.temperature === 'string' ? data.temperature : '28C');
  const resolvedCrop = cardCrop ?? (typeof data.crop === 'string' ? data.crop : 'Maiz');
  const resolvedArea = cardArea ?? (typeof data.area === 'string' ? data.area : '15 hectareas');
  const resolvedHarvest =
    cardHarvest ?? (typeof data.harvest === 'string' ? data.harvest : 'Cosecha: 15 Jul 2024');
  const resolvedLastInspection =
    cardLastInspection ??
    (typeof data.lastInspection === 'string' ? data.lastInspection : 'Ultima inspeccion: Hace 3 dias');

  if (variant === 'weather') {
    return (
      <section
        className={cx(
          'w-full max-w-[544px] rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3',
          containerClassName,
          className,
        )}
        {...props}
      >
        <div className={cx('flex items-center justify-between gap-4', headerClassName)}>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-content-center rounded-full bg-white text-lg shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              {cardWeatherIcon ?? '☀'}
            </div>
            <div>
              <h3 className={cx('text-[15px] font-bold text-[#0F172B]', titleClassName)}>{resolvedTitle}</h3>
              <p className={cx('text-sm text-[#62748E]', valueClassName)}>{resolvedValue ?? 'Soleado'}</p>
            </div>
          </div>

          <div className={cx('flex items-center gap-4', weatherStatsClassName)}>
            <p className={cx('text-2xl font-bold text-[#0F172B]', valueClassName)}>{resolvedTemperature}</p>
            <div className={cx('border-l border-[#E2E8F0] pl-4 text-xs text-[#62748E]', descriptionClassName)}>
              <p>{resolvedHumidity}</p>
              <p>{resolvedWind}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'parcel') {
    return (
      <section
        className={cx('w-full max-w-[343px] rounded-[10px] border border-[#B9F8CF] bg-[#F0FDF4] p-4', containerClassName, className)}
        {...props}
      >
        <header className={cx('flex items-center justify-between', headerClassName)}>
          <h3 className={cx('text-sm font-bold text-[#0F172B]', titleClassName)}>{resolvedTitle}</h3>
          {resolvedDescription ? <span className={cx('text-xs text-[#00A63E]', descriptionClassName)}>{resolvedDescription}</span> : null}
        </header>

        <div className={cx('mt-3 space-y-2 text-xs text-[#45556C]', valueClassName)}>
          <p>{resolvedCrop}</p>
          <p>{resolvedArea}</p>
          <p>{resolvedHarvest}</p>
        </div>

        <div className={cx('mt-3 border-t border-[#E2E8F0] pt-3 text-xs text-[#62748E]', descriptionClassName)}>{resolvedLastInspection}</div>
      </section>
    );
  }

  return (
    <section
      className={cx(
        'w-full max-w-[262px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        containerClassName,
        className,
      )}
      {...props}
    >
      <header className={cx('flex items-start justify-between gap-4', headerClassName)}>
        <div>
          <h3 className={cx('text-left text-lg font-medium leading-[22px] text-[#0F172A]', titleClassName)}>{resolvedTitle}</h3>
          {resolvedValue !== undefined ? <p className={cx('mt-1 text-sm text-[#64748B]', valueClassName)}>{resolvedValue}</p> : null}
        </div>

        <button type="button" className={cx('text-right text-xs font-medium leading-[15px] text-[#75C79E]', actionClassName)}>
          {resolvedActionLabel}
        </button>
      </header>

      <div className={cx('relative mt-4 h-[210px] rounded-lg bg-[#E2E8F0]', mapAreaClassName)}>
        <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.55),_transparent_40%),_linear-gradient(135deg,_#cbd5e1,_#94a3b8)] opacity-70" />

        {resolvedLocations.map((pin, index) => (
          <div key={`${pin.left}-${pin.top}-${index}`} className="absolute" style={{ left: pin.left, top: pin.top }}>
            {pinRenderer ? pinRenderer(pin, index) : <LocationPin color={pin.color ?? '#EF4444'} />}
          </div>
        ))}

        {resolvedDescription ? (
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className={cx('flex items-center gap-1 text-[10px] uppercase tracking-[-0.5px] text-[#DC2626]', descriptionClassName)}>{resolvedDescription}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
