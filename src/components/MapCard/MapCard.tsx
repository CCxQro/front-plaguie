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

export interface MapCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
}

export function MapCard({ data, fieldMap, className, ...props }: MapCardProps) {
  const title = getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const value = getMappedValue<string | number>(data, 'value', fieldMap);
  const description = getMappedValue<string>(data, 'description', fieldMap);
  const actionLabel = getMappedValue<string>(data, 'actionLabel', fieldMap) ?? 'Ver mapa completo';
  const locations =
    getMappedValue<MapPin[]>(data, 'locations', fieldMap) ?? [
      { color: '#EF4444', left: '2rem', top: '3.5rem' },
      { color: '#EF4444', left: '6.25rem', top: '1.75rem' },
      { color: '#F97316', left: '10.25rem', top: '7.5rem' },
    ];

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
          <h3 className="text-left text-lg font-medium leading-[22px] text-[#0F172A]">{title}</h3>
          {value !== undefined ? <p className="mt-1 text-sm text-[#64748B]">{String(value)}</p> : null}
        </div>

        <button type="button" className="text-right text-xs font-medium leading-[15px] text-[#75C79E]">
          {actionLabel}
        </button>
      </header>

      <div className="relative mt-4 h-[210px] rounded-lg bg-[#E2E8F0]">
        <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.55),_transparent_40%),_linear-gradient(135deg,_#cbd5e1,_#94a3b8)] opacity-70" />

        {locations.map((pin, index) => (
          <div key={`${pin.left}-${pin.top}-${index}`} className="absolute" style={{ left: pin.left, top: pin.top }}>
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
