import type { HTMLAttributes, ReactNode } from 'react';

import type { CardData, CardFieldMap } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface MetricCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
}

export function MetricCard({ data, fieldMap, className, ...props }: MetricCardProps) {
  const title = getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const value = getMappedValue<string | number>(data, 'value', fieldMap) ?? '';
  const description = getMappedValue<string>(data, 'description', fieldMap);
  const icon = getMappedValue<ReactNode>(data, 'icon', fieldMap);
  const trend = getMappedValue<string>(data, 'trend', fieldMap);

  return (
    <section
      className={cx(
        'w-full max-w-[260px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        className,
      )}
      {...props}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="grid h-9 min-w-9 place-content-center rounded-xl bg-[#EFF6FF] text-[#155DFC]">{icon}</div>

        {trend ? (
          <span className="rounded-full bg-[#DCFCE7] px-2 py-1 text-xs leading-[18px] text-[#16A34A]">{trend}</span>
        ) : null}
      </header>

      <p className="mt-4 text-sm leading-[21px] text-[#64748B]">{title}</p>

      <p className="mt-1 text-2xl leading-9 text-[#0F172A]">{String(value)}</p>

      {description ? <p className="mt-1 text-sm leading-[21px] text-[#94A3B8]">{description}</p> : null}
    </section>
  );
}
