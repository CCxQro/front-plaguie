import type { HTMLAttributes } from 'react';

export type CardVariant =
  | 'sales'
  | 'inventory'
  | 'clients'
  | 'incidentsMap'
  | 'fieldStatus';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant: CardVariant;
}
