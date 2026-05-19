import React from 'react';

export type ValidationStatus = 'Aceptado' | 'Revisión' | 'Rechazado';

export interface ValidationCardProps {
  recordId?: number | string;
  title: string;
  typeLabel: string; // e.g., 'Alerta', 'Recomendación', 'Vigilancia'
  statusName: ValidationStatus | string;
  date: string;
  reporterId?: number | string;
  reporterName?: string;
  description?: string;
  validatedByName?: string;
  validatedAt?: string;
  onValidateClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

function formatDate(iso?: string): string {
  if (!iso) return 'Sin fecha';

  try {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  Aceptado: {
    label: 'Aceptado',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  Accepted: {
    label: 'Aceptado',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  Revisión: {
    label: 'En revisión',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  Revision: {
    label: 'En revisión',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  Rechazado: {
    label: 'Rechazado',
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
  },
  Rejected: {
    label: 'Rechazado',
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
  },
};

export function ValidationCard({
  recordId,
  title,
  typeLabel,
  statusName,
  date,
  reporterId,
  reporterName,
  description,
  validatedByName,
  validatedAt,
  onValidateClick,
  className,
  children,
}: ValidationCardProps) {
  const statusCfg = STATUS_CONFIG[statusName] ?? {
    label: statusName || 'Sin estado',
    classes: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-400',
  };

  const isRevision = statusName === 'Revisión' || statusName === 'Revision';
  const isRejected = statusName === 'Rechazado' || statusName === 'Rejected';

  const reporterDisplay = reporterName || (reporterId ? `Usuario #${reporterId}` : null);

  return (
    <article
      data-testid="validation-card"
      className={cx(
        'group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md',
        isRevision && 'border-l-4 border-l-amber-400',
        !isRevision && !isRejected && 'border-l-4 border-l-emerald-400',
        isRejected && 'border-l-4 border-l-red-400',
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
                {recordId ? `#${recordId}` : 'Sin ID'}
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              {typeLabel}
              </span>
            </div>
            <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-950">
              {title}
            </h3>
          </div>

          <span
            data-testid="validation-status-badge"
            className={cx(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
              statusCfg.classes
            )}
          >
            <span className={cx('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
            {statusCfg.label}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <time dateTime={date}>{formatDate(date)}</time>
          {reporterDisplay && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
              {reporterDisplay}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>
        )}

        {children && <div className="mt-4 border-t border-slate-100 pt-4">{children}</div>}

        <div className="mt-auto pt-5">
          {!isRevision && validatedAt ? (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <svg className="h-3.5 w-3.5 shrink-0 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.86-9.88a.75.75 0 00-1.22-.87l-3.24 4.53-1.63-1.63a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.14-.09l3.76-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {statusCfg.label} {validatedByName ? `por ${validatedByName}` : ''} el{' '}
                {formatDate(validatedAt)}
              </span>
            </div>
          ) : null}

          {isRevision && onValidateClick ? (
            <button
              data-testid="validate-button"
              onClick={onValidateClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none active:bg-emerald-800"
            >
              Validar Registro
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3.75A.75.75 0 013 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
