import { PlagueAlertCardIcon } from './PlagueAlertCardIcons';

export type PlagueAlertVariant = 'critico' | 'advertencia' | 'informacion';

export interface PlagueAlertCardProps {
  variant: PlagueAlertVariant;
  titulo: string;
  ubicacion: string;
  tiempo: string;
  tipoPlaga: string;
  hectareas: string;
  etiquetaSeveridad?: string;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const VARIANT_STYLES: Record<
  PlagueAlertVariant,
  {
    card: string;
    alertIcon: string;
    badge: string;
    badgeText: string;
    defaultLabel: string;
  }
> = {
  critico: {
    card: 'border-[#FFC9C9] bg-[#FEF2F2]',
    alertIcon: 'text-[#FB2C36]',
    badge: 'bg-[#FFE2E2]',
    badgeText: 'text-[#C10007]',
    defaultLabel: 'Crítico',
  },
  advertencia: {
    card: 'border-[#FFD6A8] bg-[#FFF7ED]',
    alertIcon: 'text-[#FF6900]',
    badge: 'bg-[#FFEDD4]',
    badgeText: 'text-[#CA3500]',
    defaultLabel: 'Advertencia',
  },
  informacion: {
    card: 'border-[#BEDBFF] bg-[#EFF6FF]',
    alertIcon: 'text-[#2B7FFF]',
    badge: 'bg-[#DBEAFE]',
    badgeText: 'text-[#1447E6]',
    defaultLabel: 'Información',
  },
};

export function PlagueAlertCard({
  variant,
  titulo,
  ubicacion,
  tiempo,
  tipoPlaga,
  hectareas,
  etiquetaSeveridad,
  className,
}: PlagueAlertCardProps) {
  const styles = VARIANT_STYLES[variant];
  const severidadTexto = etiquetaSeveridad ?? styles.defaultLabel;

  return (
    <article className={cx('rounded-[14px] border px-4.25 py-4.25', styles.card, className)} aria-label={titulo}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <PlagueAlertCardIcon icon="alerta" className={cx('mt-0.5 h-5 w-5 shrink-0', styles.alertIcon)} />

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium leading-5.5 text-[#0F172B]">{titulo}</h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-normal leading-5 text-[#45556C]">
              <span className="inline-flex items-center gap-1.5">
                <PlagueAlertCardIcon icon="ubicacion" className="h-3.5 w-3.5 text-[#90A1B9]" />
                {ubicacion}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <PlagueAlertCardIcon icon="tiempo" className="h-3.5 w-3.5 text-[#90A1B9]" />
                {tiempo}
              </span>
            </div>
          </div>
        </div>

        <span className={cx('inline-flex h-6 items-center rounded-full px-3 text-xs font-bold leading-4 uppercase', styles.badge, styles.badgeText)}>
          {severidadTexto}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 text-sm font-normal leading-5 text-[#45556C]">
        <span className="inline-flex items-center gap-1.5">
          <PlagueAlertCardIcon icon="plaga" className="h-3.5 w-3.5 text-[#62748E]" />
          {tipoPlaga}
        </span>

        <span className="text-[#62748E]">•</span>

        <span>{hectareas}</span>
      </div>
    </article>
  );
}