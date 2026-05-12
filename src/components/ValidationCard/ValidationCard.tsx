import React from 'react';

export type ValidationStatus = 'Aceptado' | 'Revisión' | 'Rechazado';

export interface ValidationCardProps {
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

function formatDate(iso: string): string {
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

const STATUS_CONFIG: Record<string, { classes: string; icon: string }> = {
  Aceptado: {
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    icon: '✓',
  },
  Accepted: {
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    icon: '✓',
  },
  Revisión: {
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    icon: '⏳',
  },
  Revision: {
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    icon: '⏳',
  },
  Rechazado: {
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    icon: '✕',
  },
  Rejected: {
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    icon: '✕',
  },
};

export function ValidationCard({
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
    classes: 'bg-gray-100 text-gray-700',
    icon: '•',
  };

  const isRevision = statusName === 'Revisión' || statusName === 'Revision';

  const reporterDisplay = reporterName || (reporterId ? `Usuario #${reporterId}` : null);

  return (
    <article
      data-testid="validation-card"
      className={cx(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        isRevision && 'border-l-4 border-l-amber-400',
        className
      )}
    >
      {/* Hover accent bar */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {typeLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <time className="text-xs text-gray-400" dateTime={date}>
              {formatDate(date)}
            </time>
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900 leading-snug">{title}</h3>
          {reporterDisplay && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
              {reporterDisplay}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <span
          data-testid="validation-status-badge"
          className={cx(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
            statusCfg.classes
          )}
        >
          <span className="text-[10px]">{statusCfg.icon}</span>
          {statusName}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{description}</p>
      )}

      {/* Domain-specific details (children) */}
      {children && <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>}

      {/* Validation audit trail */}
      {!isRevision && validatedAt && (
        <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {statusName === 'Aceptado' || statusName === 'Accepted'
              ? 'Validado'
              : 'Rechazado'}{' '}
            {validatedByName ? `por ${validatedByName}` : ''} el {formatDate(validatedAt)}
          </span>
        </div>
      )}

      {/* Validate button */}
      {isRevision && onValidateClick && (
        <div className="mt-6">
          <button
            data-testid="validate-button"
            onClick={onValidateClick}
            className="w-full rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none active:bg-indigo-200"
          >
            Validar Registro
          </button>
        </div>
      )}
    </article>
  );
}
