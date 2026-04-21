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
    variant: 'default',
    data: {
      title: 'Ventas totales',
      value: '$12,430',
      description: '+20% vs mes anterior',
      trend: '+8.4%',
      icon: '$',
    },
  },
};

export const Highlight: Story = {
  args: {
    variant: 'highlight',
    data: {
      title: 'Ventas Totales',
      value: '$487,500',
      description: 'Ano 2026',
      trend: '+12.5%',
      icon: '⦿',
    },
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    data: {
      title: 'Total Productos',
      value: 8,
      icon: '◈',
    },
  },
};

export const Progress: Story = {
  args: {
    variant: 'progress',
    data: {
      title: 'Tasa de Aceptacion',
      value: '92%',
      progress: 92,
      progressLabel: 'Objetivo mensual',
    },
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    data: {
      title: 'Stock Bajo',
      value: '1 Producto',
      icon: '!',
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
