import type { Meta, StoryObj } from '@storybook/react-vite';

import { OrderTable, type OrderTableProps } from './OrderTable';
import type { OrderTableRowData } from './OrderTableRow';

const ORDER_ROWS: OrderTableRowData[] = [
  {
    id: '#ORD-2849',
    customer: 'Residencial Los Olivos',
    date: '24 Mayo, 2024',
    total: '$1,250.00',
    status: 'pendiente',
  },
  {
    id: '#ORD-2848',
    customer: 'Hotel Plaza Central',
    date: '23 Mayo, 2024',
    total: '$3,400.00',
    status: 'aceptado',
  },
  {
    id: '#ORD-2847',
    customer: 'Restaurante El Gaucho',
    date: '23 Mayo, 2024',
    total: '$890.00',
    status: 'rechazado',
  },
  {
    id: '#ORD-2846',
    customer: 'Clinica Santa Maria',
    date: '22 Mayo, 2024',
    total: '$2,100.00',
    status: 'aceptado',
  },
  {
    id: '#ORD-2845',
    customer: 'Centro Comercial Norte',
    date: '22 Mayo, 2024',
    total: '$5,750.00',
    status: 'pendiente',
  },
];

const ORDER_ROWS_SOLO_LECTURA: OrderTableRowData[] = ORDER_ROWS.map((row) => ({
  ...row,
  showDecisionActions: false,
}));

const meta = {
  title: 'Components/OrderTable',
  component: OrderTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'object' },
    title: { control: 'text' },
    headerActionText: { control: 'text' },
    pageText: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    onView: { action: 'onView' },
    onApprove: { action: 'onApprove' },
    onReject: { action: 'onReject' },
  },
} satisfies Meta<typeof OrderTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compacta: Story = {
  args: {
    rows: ORDER_ROWS,
    title: 'Pedidos Recientes',
    headerActionText: 'Mostrando 5 de 128 pedidos',
    pageText: 'Pagina 1 de 26',
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    className: 'w-[960px]',
  } satisfies OrderTableProps,
};

export const SoloLectura: Story = {
  args: {
    rows: ORDER_ROWS_SOLO_LECTURA,
    title: 'Pedidos Recientes',
    headerActionText: 'Mostrando 5 de 128 pedidos',
    pageText: 'Pagina 1 de 26',
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    className: 'w-[960px]',
  } satisfies OrderTableProps,
};