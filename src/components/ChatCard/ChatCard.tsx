import type { HTMLAttributes, ReactNode } from 'react';

import type { CardData, CardFieldMap, ChatMessage } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface ChatCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
  variant?: 'default' | 'alert' | 'stockStatus';
  cardTitle?: ReactNode;
  cardValue?: ReactNode;
  cardDescription?: ReactNode;
  cardTrend?: ReactNode;
  cardMessages?: ChatMessage[];
  cardRightLabel?: ReactNode;
  cardRightValue?: ReactNode;
  stockIcon?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
  trendClassName?: string;
  messageListClassName?: string;
  messageDotClassName?: string;
  rightSectionClassName?: string;
}

export function ChatCard({
  data,
  fieldMap,
  variant = 'default',
  cardTitle,
  cardValue,
  cardDescription,
  cardTrend,
  cardMessages,
  cardRightLabel,
  cardRightValue,
  stockIcon,
  containerClassName,
  headerClassName,
  titleClassName,
  valueClassName,
  descriptionClassName,
  trendClassName,
  messageListClassName,
  messageDotClassName,
  rightSectionClassName,
  className,
  ...props
}: ChatCardProps) {
  const resolvedTitle = cardTitle ?? getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const resolvedValue = cardValue ?? getMappedValue<string | number>(data, 'value', fieldMap);
  const resolvedDescription = cardDescription ?? getMappedValue<ReactNode>(data, 'description', fieldMap);
  const resolvedTrend = cardTrend ?? getMappedValue<ReactNode>(data, 'trend', fieldMap);
  const resolvedMessages = cardMessages ?? getMappedValue<ChatMessage[]>(data, 'messages', fieldMap) ?? [];

  const isAlert = variant === 'alert';
  const isStockStatus = variant === 'stockStatus';

  const resolvedRightLabel = cardRightLabel ?? (typeof data.rightLabel === 'string' ? data.rightLabel : 'Disponible');
  const resolvedRightValue =
    cardRightValue ??
    (typeof data.rightValue === 'string' || typeof data.rightValue === 'number' ? data.rightValue : 85);

  if (isStockStatus) {
    return (
      <section
        className={cx('w-full max-w-[400px] rounded-[10px] border border-[#B9F8CF] bg-[#F0FDF4] px-3 py-3', containerClassName, className)}
        {...props}
      >
        <div className={cx('flex items-center justify-between gap-3', headerClassName)}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-white text-[#00A63E] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              {stockIcon ?? '✓'}
            </div>
            <div>
              <p className={cx('text-xs text-[#62748E]', titleClassName)}>{resolvedTitle}</p>
              <p className={cx('text-sm font-bold text-[#008236]', valueClassName)}>{resolvedValue ?? 'En Stock'}</p>
            </div>
          </div>

          <div className={cx('text-right', rightSectionClassName)}>
            <p className={cx('text-xs text-[#62748E]', descriptionClassName)}>{resolvedRightLabel}</p>
            <p className={cx('text-2xl font-bold text-[#0F172B]', valueClassName)}>{resolvedRightValue}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cx(
        'w-full max-w-[343px] rounded-[10px] px-4 pt-4 pb-3',
        isAlert ? 'border border-[#FFD6A8] bg-[#FFF7ED]' : 'border border-[#B9F8CF] bg-[#F0FDF4]',
        containerClassName,
        className,
      )}
      {...props}
    >
      <header className={cx('flex items-center justify-between gap-3', headerClassName)}>
        <h3 className={cx('text-sm font-bold leading-5 text-[#0F172B]', titleClassName)}>{resolvedTitle}</h3>
        {resolvedTrend ? (
          <span className={cx('text-xs font-medium', isAlert ? 'text-[#F54900]' : 'text-[#00C950]', trendClassName)}>{resolvedTrend}</span>
        ) : null}
      </header>

      {resolvedValue !== undefined ? <p className={cx('mt-1 text-xs font-medium text-[#45556C]', valueClassName)}>{resolvedValue}</p> : null}

      {resolvedDescription ? <p className={cx('mt-2 text-xs leading-4 text-[#62748E]', descriptionClassName)}>{resolvedDescription}</p> : null}

      {resolvedMessages.length > 0 ? (
        <ul className={cx('mt-3 space-y-2 text-xs font-medium leading-4 text-[#45556C]', messageListClassName)}>
          {resolvedMessages.map((message, index) => (
            <li key={`${message.sender}-${index}`} className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className={cx('mt-1 h-2 w-2 rounded-full', isAlert ? 'bg-[#F54900]' : 'bg-[#90A1B9]', messageDotClassName)}
                />
                <span>
                  <strong className="font-semibold">{message.sender}:</strong> {message.text}
                </span>
              </div>

              {message.time ? <span className="text-[#62748E]">{message.time}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
