import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChatCard } from './ChatCard';

const meta = {
  title: 'Components/ChatCard',
  component: ChatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    data: {
      title: 'Chat de soporte',
      value: '3 conversaciones activas',
      description: 'Nuevos mensajes en los ultimos 10 minutos',
      trend: 'En linea',
      messages: [
        { sender: 'Laura', text: 'Necesito actualizar mi pedido', time: '10:25' },
        { sender: 'Diego', text: 'Confirmado, gracias', time: '10:27' },
      ],
    },
  },
};

export const Alert: Story = {
  args: {
    variant: 'alert',
    data: {
      title: 'Incidentes de stock',
      value: '4 conversaciones urgentes',
      description: 'Mensajes pendientes con prioridad alta',
      trend: 'Urgente',
      messages: [
        { sender: 'Bodega', text: 'Producto critico agotado', time: '11:10' },
        { sender: 'Ventas', text: 'Cliente esperando confirmacion', time: '11:12' },
      ],
    },
  },
};

export const StockStatus: Story = {
  args: {
    variant: 'stockStatus',
    data: {
      title: 'Estado de Stock',
      value: 'En Stock',
      rightLabel: 'Disponible',
      rightValue: 85,
    },
  },
};

export const WithFieldMap: Story = {
  args: {
    data: {
      header: 'Conversaciones',
      unreadCount: 5,
      helperText: '2 pendientes de respuesta',
      statusText: 'Alta actividad',
      chatItems: [
        { sender: 'Ana', text: 'Podemos reagendar?', time: '09:48' },
      ],
    },
    fieldMap: {
      title: 'header',
      value: 'unreadCount',
      description: 'helperText',
      trend: 'statusText',
      messages: 'chatItems',
    },
  },
};
