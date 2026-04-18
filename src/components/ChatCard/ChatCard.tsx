import type { HTMLAttributes } from 'react';

import type { CardData, CardFieldMap, ChatMessage } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface ChatCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
  variant?: 'default' | 'alert' | 'stockStatus';
}

export function ChatCard({ data, fieldMap, variant = 'default', className, ...props }: ChatCardProps) {
  const title = getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const value = getMappedValue<string | number>(data, 'value', fieldMap);
  const description = getMappedValue<string>(data, 'description', fieldMap);
  const trend = getMappedValue<string>(data, 'trend', fieldMap);
  const messages = getMappedValue<ChatMessage[]>(data, 'messages', fieldMap) ?? [];

  const isAlert = variant === 'alert';
  const isStockStatus = variant === 'stockStatus';

  const rightLabel = typeof data.rightLabel === 'string' ? data.rightLabel : 'Disponible';
  const rightValue = typeof data.rightValue === 'string' || typeof data.rightValue === 'number' ? data.rightValue : 85;

  if (isStockStatus) {
    return (
      <section
        className={cx('w-full max-w-[400px] rounded-[10px] border border-[#B9F8CF] bg-[#F0FDF4] px-3 py-3', className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-white text-[#00A63E] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              ✓
            </div>
            <div>
              <p className="text-xs text-[#62748E]">{title}</p>
              <p className="text-sm font-bold text-[#008236]">{String(value ?? 'En Stock')}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#62748E]">{rightLabel}</p>
            <p className="text-2xl font-bold text-[#0F172B]">{String(rightValue)}</p>
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
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold leading-5 text-[#0F172B]">{title}</h3>
        {trend ? <span className={cx('text-xs font-medium', isAlert ? 'text-[#F54900]' : 'text-[#00C950]')}>{trend}</span> : null}
      </header>

      {value !== undefined ? <p className="mt-1 text-xs font-medium text-[#45556C]">{String(value)}</p> : null}

      {description ? <p className="mt-2 text-xs leading-4 text-[#62748E]">{description}</p> : null}

      {messages.length > 0 ? (
        <ul className="mt-3 space-y-2 text-xs font-medium leading-4 text-[#45556C]">
          {messages.map((message, index) => (
            <li key={`${message.sender}-${index}`} className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span aria-hidden="true" className={cx('mt-1 h-2 w-2 rounded-full', isAlert ? 'bg-[#F54900]' : 'bg-[#90A1B9]')} />
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
