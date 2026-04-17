import type { Meta, StoryObj } from '@storybook/react-vite';

import { MetricCard } from './MetricCard';

const meta = {
  title: 'Components/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      title: 'Ventas totales',
      value: '$12,430',
      description: '+20% vs mes anterior',
      trend: '+8.4%',
      icon: '$',
    },
  },
};

export const WithFieldMap: Story = {
  args: {
    data: {
      heading: 'Nuevos clientes',
      amount: 32,
      note: '6 en la ultima semana',
      delta: '+12%',
      badge: 'N',
    },
    fieldMap: {
      title: 'heading',
      value: 'amount',
      description: 'note',
      trend: 'delta',
      icon: 'badge',
    },
  },
};
