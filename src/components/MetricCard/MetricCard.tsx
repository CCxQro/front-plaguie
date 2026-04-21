import type { HTMLAttributes, ReactNode } from 'react';

import type { CardData, CardFieldMap } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface MetricCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
  variant?: 'default' | 'highlight' | 'compact' | 'progress' | 'warning';
  cardTitle?: ReactNode;
  cardValue?: ReactNode;
  cardDescription?: ReactNode;
  cardIcon?: ReactNode;
  cardTrend?: ReactNode;
  cardProgress?: number;
  cardProgressLabel?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  iconWrapperClassName?: string;
  trendClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
  progressTrackClassName?: string;
  progressFillClassName?: string;
}

export function MetricCard({
  data,
  fieldMap,
  variant = 'default',
  cardTitle,
  cardValue,
  cardDescription,
  cardIcon,
  cardTrend,
  cardProgress,
  cardProgressLabel,
  containerClassName,
  headerClassName,
  iconWrapperClassName,
  trendClassName,
  titleClassName,
  valueClassName,
  descriptionClassName,
  progressTrackClassName,
  progressFillClassName,
  className,
  ...props
}: MetricCardProps) {
  const resolvedTitle = cardTitle ?? getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const resolvedValue = cardValue ?? getMappedValue<string | number>(data, 'value', fieldMap) ?? '';
  const resolvedDescription = cardDescription ?? getMappedValue<ReactNode>(data, 'description', fieldMap);
  const resolvedIcon = cardIcon ?? getMappedValue<ReactNode>(data, 'icon', fieldMap);
  const resolvedTrend = cardTrend ?? getMappedValue<ReactNode>(data, 'trend', fieldMap);
  const resolvedProgress =
    typeof cardProgress === 'number' ? cardProgress : Number(data.progress ?? 0);
  const resolvedProgressLabel =
    cardProgressLabel ??
    (typeof data.progressLabel === 'string' ? data.progressLabel : undefined);

  const isHighlight = variant === 'highlight';
  const isCompact = variant === 'compact';
  const isProgress = variant === 'progress';
  const isWarning = variant === 'warning';

  if (isProgress) {
    const safeProgress = Math.max(0, Math.min(100, resolvedProgress));

    return (
      <section
        className={cx(
          'w-full max-w-[228px] rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
          containerClassName,
          className,
        )}
        {...props}
      >
        <p className={cx('text-xs font-medium uppercase tracking-wide text-[#64748B]', titleClassName)}>{resolvedTitle}</p>
        <p className={cx('mt-2 text-2xl font-bold leading-8 text-[#0F172A]', valueClassName)}>{resolvedValue}</p>
        <div className={cx('mt-3 h-1.5 w-full rounded-full bg-[#F1F5F9]', progressTrackClassName)}>
          <div
            className={cx('h-1.5 rounded-full bg-[#75C79E]', progressFillClassName)}
            style={{ width: `${safeProgress}%` }}
            aria-hidden="true"
          />
        </div>
        {resolvedProgressLabel ? <p className={cx('mt-2 text-xs text-[#64748B]', descriptionClassName)}>{resolvedProgressLabel}</p> : null}
      </section>
    );
  }

  if (isWarning) {
    return (
      <section
        className={cx(
          'w-full max-w-[346px] rounded-[14px] border border-[#FFD6A8] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
          containerClassName,
          className,
        )}
        {...props}
      >
        <div className={cx('flex items-center gap-3', headerClassName)}>
          <div className={cx('grid h-11 w-11 place-content-center rounded-xl bg-[#FFF7ED] text-[#F54900]', iconWrapperClassName)}>
            {resolvedIcon ?? '!'}
          </div>
          <div>
            <p className={cx('text-xs uppercase tracking-wide text-[#62748E]', titleClassName)}>{resolvedTitle}</p>
            <p className={cx('mt-1 text-2xl font-bold leading-8 text-[#F54900]', valueClassName)}>{resolvedValue}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isCompact) {
    return (
      <section
        className={cx(
          'w-full max-w-[266px] rounded-[14px] border border-[#E5E7EB] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]',
          containerClassName,
          className,
        )}
        {...props}
      >
        <div className={cx('flex items-center gap-3', headerClassName)}>
          <div className={cx('grid h-10 w-10 place-content-center rounded-[10px] bg-[#DBEAFE] text-[#155DFC]', iconWrapperClassName)}>
            {resolvedIcon ?? '◈'}
          </div>
          <div>
            <p className={cx('text-sm text-[#4A5565]', titleClassName)}>{resolvedTitle}</p>
            <p className={cx('text-2xl font-bold leading-8 text-[#101828]', valueClassName)}>{resolvedValue}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cx(
        'w-full max-w-[260px] rounded-xl p-6',
        isHighlight
          ? 'border border-[#00A63E] bg-[linear-gradient(135deg,#00C950_0%,#00A63E_100%)] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'
          : 'border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        containerClassName,
        className,
      )}
      {...props}
    >
      <header className={cx('flex items-start justify-between gap-3', headerClassName)}>
        <div
          className={cx(
            'grid h-9 min-w-9 place-content-center rounded-xl',
            isHighlight ? 'bg-white/20 text-white' : 'bg-[#EFF6FF] text-[#155DFC]',
            iconWrapperClassName,
          )}
        >
          {resolvedIcon}
        </div>

        {resolvedTrend ? (
          <span
            className={cx(
              'rounded-full px-2 py-1 text-xs leading-[18px]',
              isHighlight ? 'bg-white/20 text-white' : 'bg-[#DCFCE7] text-[#16A34A]',
              trendClassName,
            )}
          >
            {resolvedTrend}
          </span>
        ) : null}
      </header>

      <p className={cx('mt-4 text-sm leading-[21px]', isHighlight ? 'text-[#DCFCE7]' : 'text-[#64748B]', titleClassName)}>{resolvedTitle}</p>

      <p className={cx('mt-1 text-2xl leading-9 font-bold', isHighlight ? 'text-white' : 'text-[#0F172A]', valueClassName)}>
        {resolvedValue}
      </p>

      {resolvedDescription ? (
        <p className={cx('mt-1 text-sm leading-[21px]', isHighlight ? 'text-[#DCFCE7]' : 'text-[#94A3B8]', descriptionClassName)}>{resolvedDescription}</p>
      ) : null}
    </section>
  );
}
