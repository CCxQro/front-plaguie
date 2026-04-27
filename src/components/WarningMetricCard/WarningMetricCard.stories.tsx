import type { Meta, StoryObj } from '@storybook/react-vite';

import { WarningMetricCard } from './WarningMetricCard';

const meta = {
  title: 'Components/WarningMetricCard',
  component: WarningMetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WarningMetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Alertas Inventario',
    value: '3',
    unit: 'items',
    status: 'Bajo Stock',
    statusBgColor: '#FEE2E2',
    statusTextColor: '#DC2626',
  },
};

export const CriticalAlert: Story = {
  args: {
    title: 'Alertas Críticas',
    value: '5',
    unit: 'productos',
    status: 'Crítico',
    statusBgColor: '#FEE2E2',
    statusTextColor: '#DC2626',
  },
};

export const WarningAlert: Story = {
  args: {
    title: 'Advertencias',
    value: '8',
    unit: 'items',
    status: 'Advertencia',
    statusBgColor: '#FFEDD5',
    statusTextColor: '#EA580C',
  },
};
