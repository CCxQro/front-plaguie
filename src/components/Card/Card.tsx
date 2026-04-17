import type { ReactNode } from 'react';

import type { CardProps } from './Card.types';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

function SalesIcon() {
  return (
    <div className="grid h-9 w-9 place-content-center rounded-xl bg-[#75C79E1A]">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-[#75C79E]">
        <path
          fill="currentColor"
          d="M10 2a1 1 0 0 1 1 1v1.07a4 4 0 0 1 2.72 1.53 1 1 0 1 1-1.56 1.24A2 2 0 0 0 10.6 6H9.4c-.8 0-1.4.58-1.4 1.25s.6 1.25 1.4 1.25h1.2c1.9 0 3.4 1.43 3.4 3.25a3.2 3.2 0 0 1-3 3.18V16a1 1 0 1 1-2 0v-1.07a4 4 0 0 1-2.72-1.53 1 1 0 1 1 1.56-1.24c.4.5 1.02.84 1.64.84h1.2c.8 0 1.4-.58 1.4-1.25s-.6-1.25-1.4-1.25H9.4C7.5 10.5 6 9.07 6 7.25A3.2 3.2 0 0 1 9 4.07V3a1 1 0 0 1 1-1Z"
        />
      </svg>
    </div>
  );
}

function AlertIcon() {
  return (
    <div className="grid h-9 w-9 place-content-center rounded-xl bg-[#FFEDD5]">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-[#EA580C]">
        <path
          fill="currentColor"
          d="M10 2c.46 0 .88.3 1.03.74l6 14A1.12 1.12 0 0 1 15.98 18H4.02c-.77 0-1.3-.78-1.04-1.26l6-14C9.12 2.3 9.54 2 10 2Zm0 5a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z"
        />
      </svg>
    </div>
  );
}

function UsersIcon() {
  return (
    <div className="grid h-11 w-11 place-content-center rounded-[10px] bg-[#EFF6FF]">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 text-[#155DFC]">
        <path
          fill="currentColor"
          d="M10 10a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 10 10ZM4 16.5c0-2.18 2.46-3.5 6-3.5s6 1.32 6 3.5a1 1 0 1 1-2 0c0-.68-1.38-1.5-4-1.5s-4 .82-4 1.5a1 1 0 1 1-2 0Z"
        />
      </svg>
    </div>
  );
}

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

function MetricCard({
  icon,
  badge,
  badgeClassName,
  badgeTextClassName,
  title,
  value,
  trailing,
}: {
  icon: ReactNode;
  badge: string;
  badgeClassName: string;
  badgeTextClassName: string;
  title: string;
  value: string;
  trailing?: string;
}) {
  return (
    <section className="w-full max-w-[260px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <header className="flex items-start justify-between">
        {icon}
        <span className={cx('rounded-full px-2 py-1 text-xs leading-[18px]', badgeClassName)}>
          <span className={badgeTextClassName}>{badge}</span>
        </span>
      </header>

      <p className="mt-4 text-sm leading-[21px] text-[#64748B]">{title}</p>

      <p className="mt-1 flex items-end gap-1 text-2xl leading-9 text-[#0F172A]">
        {value}
        {trailing ? <span className="pb-1 text-sm leading-[21px] text-[#94A3B8]">{trailing}</span> : null}
      </p>
    </section>
  );
}

function IncidentsMapCard() {
  return (
    <section className="w-full max-w-[262px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <header className="flex items-start justify-between gap-4">
        <h3 className="text-left text-lg font-medium leading-[22px] text-[#0F172A]">
          Incidentes
          <br />
          Activos
        </h3>
        <button type="button" className="text-right text-xs font-medium leading-[15px] text-[#75C79E]">
          Ver mapa
          <br />
          completo
        </button>
      </header>

      <div className="relative mt-4 h-[210px] rounded-lg bg-[#E2E8F0]">
        <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.55),_transparent_40%),_linear-gradient(135deg,_#cbd5e1,_#94a3b8)] opacity-70" />

        <div className="absolute left-8 top-14"><LocationPin color="#EF4444" /></div>
        <div className="absolute left-[102px] top-[28px]"><LocationPin color="#EF4444" /></div>
        <div className="absolute right-12 top-[120px]"><LocationPin color="#F97316" /></div>

        <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-[-0.5px] text-[#DC2626]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
            5 alertas criticas
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldStatusCard() {
  return (
    <article className="w-full max-w-[343px] rounded-[10px] border border-[#B9F8CF] bg-[#F0FDF4] px-4 pt-4 pb-1">
      <header className="flex items-center gap-2 text-sm font-bold leading-5 text-[#0F172B]">
        <span className="h-2 w-2 rounded-full bg-[#00C950]" />
        Parcela Sur B
      </header>

      <ul className="mt-3 space-y-2 text-xs font-medium leading-4 text-[#45556C]">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#90A1B9]" />
          Trigo
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#90A1B9]" />
          20 hectareas
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#90A1B9]" />
          Cosecha: 10 Jun 2024
        </li>
      </ul>

      <footer className="mt-4 border-t border-[#E2E8F0] pt-3 pb-2 text-left text-xs font-medium leading-4 text-[#62748E]">
        Ultima inspeccion: Hace 5 dias
      </footer>
    </article>
  );
}

function ClientsCard() {
  return (
    <section className="w-full max-w-[260px] rounded-[14px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <header className="flex items-center justify-between">
        <UsersIcon />
      </header>

      <p className="mt-4 text-left text-sm leading-5 text-[#62748E]">Total Clientes</p>
      <p className="mt-1 text-left text-3xl font-bold leading-9 text-[#0F172B]">5</p>
    </section>
  );
}

export function Card({ variant, className, ...props }: CardProps) {
  if (variant === 'sales') {
    return (
      <div className={className} {...props}>
        <MetricCard
          icon={<SalesIcon />}
          badge="+8.4%"
          badgeClassName="bg-[#DCFCE7]"
          badgeTextClassName="text-[#16A34A]"
          title="Ventas del Mes"
          value="$12,500.00"
        />
      </div>
    );
  }

  if (variant === 'inventory') {
    return (
      <div className={className} {...props}>
        <MetricCard
          icon={<AlertIcon />}
          badge="Bajo Stock"
          badgeClassName="bg-[#FEE2E2]"
          badgeTextClassName="text-[#DC2626]"
          title="Alertas Inventario"
          value="3"
          trailing="items"
        />
      </div>
    );
  }

  if (variant === 'incidentsMap') {
    return (
      <div className={className} {...props}>
        <IncidentsMapCard />
      </div>
    );
  }

  if (variant === 'fieldStatus') {
    return (
      <div className={className} {...props}>
        <FieldStatusCard />
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      <ClientsCard />
    </div>
  );
}
