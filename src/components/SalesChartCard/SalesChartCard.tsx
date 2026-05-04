import type { HTMLAttributes } from 'react';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';

export type SalesDay = {
  label: string;
  height: number;
  tone: string;
};

export interface SalesChartCardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  salesData?: SalesDay[];
  timeRangeLabel?: string;
}

const DEFAULT_SALES_DAYS: SalesDay[] = [
  { label: 'Lun', height: 98.4, tone: 'rgba(117, 199, 158, 0.2)' },
  { label: 'Mar', height: 159.9, tone: 'rgba(117, 199, 158, 0.4)' },
  { label: 'Mie', height: 135.3, tone: 'rgba(117, 199, 158, 0.2)' },
  { label: 'Jue', height: 221.4, tone: '#75C79E' },
  { label: 'Vie', height: 110.7, tone: 'rgba(117, 199, 158, 0.3)' },
  { label: 'Sab', height: 184.5, tone: 'rgba(117, 199, 158, 0.5)' },
  { label: 'Dom', height: 209.09, tone: 'rgba(117, 199, 158, 0.6)' },
];

export function SalesChartCard({
  title = 'Rendimiento de Ventas Recientes',
  salesData = DEFAULT_SALES_DAYS,
  timeRangeLabel = 'Últimos 7 días',
  className,
  ...props
}: SalesChartCardProps) {
  return (
    <section
      className={`flex h-98.25 flex-col rounded-xl border border-[#E2E8F0] bg-white p-px shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
        className || ''
      }`}
      data-testid="sales-chart-card"
      {...props}
    >
      <div className="flex h-full flex-col rounded-[11px] bg-white px-6.25 py-6.25">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[18px] font-medium leading-6.75 text-[#0F172A]">{title}</h3>

          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#F1F5F9] px-3 text-[12px] font-medium leading-4.5 text-[#0F172A]"
          >
            {timeRangeLabel}
            <ChevronDownIcon />
          </button>
        </div>

        <div className="mt-6.5 flex h-61.5 items-end gap-2 px-2">
          {salesData.map((day) => (
            <div key={day.label} className="flex flex-1 items-end">
              <div
                className={`w-full rounded-t-lg h-(--bar-h) bg-(--bar-color) [--bar-h:${day.height}px] [--bar-color:${day.tone}]`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <div className="mt-2.75 flex items-center justify-between px-2 text-[10px] uppercase tracking-[0.5px] text-[#94A3B8]">
          {salesData.map((day) => (
            <span key={day.label}>{day.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
