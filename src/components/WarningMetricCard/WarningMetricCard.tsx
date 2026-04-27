import type { HTMLAttributes } from 'react';
import { WarningTriangleIcon } from '../Icons/WarningTriangleIcon';

export interface WarningMetricCardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  value?: string | number;
  unit?: string;
  status?: string;
  statusBgColor?: string;
  statusTextColor?: string;
}

export function WarningMetricCard({
  title = 'Alertas Inventario',
  value = '3',
  unit = 'items',
  status = 'Bajo Stock',
  statusBgColor = '#FEE2E2',
  statusTextColor = '#DC2626',
  className,
  ...props
}: WarningMetricCardProps) {
  return (
    <section
      className={`flex h-40.5 flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white px-6.25 py-6.25 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
        className || ''
      }`}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-9 w-9 place-content-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
          <WarningTriangleIcon />
        </div>

        <span
          className="rounded-full px-3 py-1 text-[12px] leading-4.5"
          style={{ backgroundColor: statusBgColor, color: statusTextColor }}
        >
          {status}
        </span>
      </div>

      <div>
        <p className="text-[14px] leading-5.25 text-[#64748B]">{title}</p>
        <div className="mt-1 flex items-end gap-1.5">
          <span className="text-[24px] leading-9 text-[#0F172A]">{value}</span>
          <span className="pb-1.75 text-[14px] leading-5.25 text-[#94A3B8]">{unit}</span>
        </div>
      </div>
    </section>
  );
}
