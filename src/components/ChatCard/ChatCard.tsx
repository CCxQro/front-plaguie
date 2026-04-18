import type { HTMLAttributes } from 'react';

import type { CardData, CardFieldMap, ChatMessage } from '../cardData';
import { getMappedValue } from '../cardData';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface ChatCardProps extends HTMLAttributes<HTMLElement> {
  data: CardData;
  fieldMap?: CardFieldMap;
}

export function ChatCard({ data, fieldMap, className, ...props }: ChatCardProps) {
  const title = getMappedValue<string>(data, 'title', fieldMap) ?? '';
  const value = getMappedValue<string | number>(data, 'value', fieldMap);
  const description = getMappedValue<string>(data, 'description', fieldMap);
  const trend = getMappedValue<string>(data, 'trend', fieldMap);
  const messages = getMappedValue<ChatMessage[]>(data, 'messages', fieldMap) ?? [];

  return (
    <section
      className={cx('w-full max-w-[343px] rounded-[10px] border border-[#B9F8CF] bg-[#F0FDF4] px-4 pt-4 pb-3', className)}
      {...props}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold leading-5 text-[#0F172B]">{title}</h3>
        {trend ? <span className="text-xs font-medium text-[#00C950]">{trend}</span> : null}
      </header>

      {value !== undefined ? <p className="mt-1 text-xs font-medium text-[#45556C]">{String(value)}</p> : null}

      {description ? <p className="mt-2 text-xs leading-4 text-[#62748E]">{description}</p> : null}

      {messages.length > 0 ? (
        <ul className="mt-3 space-y-2 text-xs font-medium leading-4 text-[#45556C]">
          {messages.map((message, index) => (
            <li key={`${message.sender}-${index}`} className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-[#90A1B9]" />
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
