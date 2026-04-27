import type { Meta, StoryObj } from '@storybook/react-vite';

import { SalesChartCard } from './SalesChartCard';

const meta = {
  title: 'Components/SalesChartCard',
  component: SalesChartCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SalesChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Rendimiento de Ventas Recientes',
    timeRangeLabel: 'Últimos 7 días',
    salesData: [
      { label: 'Lun', height: 98.4, tone: 'rgba(117, 199, 158, 0.2)' },
      { label: 'Mar', height: 159.9, tone: 'rgba(117, 199, 158, 0.4)' },
      { label: 'Mie', height: 135.3, tone: 'rgba(117, 199, 158, 0.2)' },
      { label: 'Jue', height: 221.4, tone: '#75C79E' },
      { label: 'Vie', height: 110.7, tone: 'rgba(117, 199, 158, 0.3)' },
      { label: 'Sab', height: 184.5, tone: 'rgba(117, 199, 158, 0.5)' },
      { label: 'Dom', height: 209.09, tone: 'rgba(117, 199, 158, 0.6)' },
    ],
  },
};

export const MonthlyView: Story = {
  args: {
    title: 'Rendimiento de Ventas Mensual',
    timeRangeLabel: 'Últimos 30 días',
    salesData: [
      { label: 'Sem 1', height: 120, tone: 'rgba(117, 199, 158, 0.2)' },
      { label: 'Sem 2', height: 180, tone: 'rgba(117, 199, 158, 0.4)' },
      { label: 'Sem 3', height: 150, tone: 'rgba(117, 199, 158, 0.3)' },
      { label: 'Sem 4', height: 240, tone: '#75C79E' },
    ],
  },
};
