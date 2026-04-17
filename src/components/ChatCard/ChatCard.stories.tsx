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
