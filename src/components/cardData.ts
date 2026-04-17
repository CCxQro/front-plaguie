import type { ReactNode } from 'react';

export type CardFieldKey =
  | 'title'
  | 'value'
  | 'description'
  | 'icon'
  | 'trend'
  | 'messages'
  | 'actionLabel'
  | 'locations';

export type CardData = Record<string, unknown>;

export type CardFieldMap = Partial<Record<CardFieldKey, string>>;

export interface ChatMessage {
  sender: string;
  text: string;
  time?: string;
}

export interface MapPin {
  color?: string;
  top: string;
  left: string;
}

export interface MetricCardStandardData {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: string;
}

export interface ChatCardStandardData extends MetricCardStandardData {
  messages?: ChatMessage[];
}

export interface MapCardStandardData extends MetricCardStandardData {
  actionLabel?: string;
  locations?: MapPin[];
}

export function getMappedValue<T = unknown>(
  data: CardData,
  key: CardFieldKey,
  fieldMap?: CardFieldMap,
): T | undefined {
  const resolvedKey = fieldMap?.[key] ?? key;

  return data[resolvedKey] as T | undefined;
}
