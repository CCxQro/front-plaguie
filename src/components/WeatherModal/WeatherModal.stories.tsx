import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { WeatherModal } from './WeatherModal';

const meta = {
  title: 'Components/WeatherModal',
  component: WeatherModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WeatherModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to manage state for Storybook
function WeatherModalDemo() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Weather Modal Demo</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Abrir Modal de Clima
        </button>
      </div>

      <WeatherModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

export const Default: Story = {
  render: () => <WeatherModalDemo />,
  parameters: {
    layout: 'fullscreen',
  },
};

export const OpenedState: Story = {
  render: () => {
    const [isOpen] = useState(true);
    return (
      <div className="min-h-screen bg-gray-100">
        <WeatherModal isOpen={isOpen} onClose={() => console.log('Modal closed')} />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const ClosedState: Story = {
  render: () => {
    const [isOpen] = useState(false);
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Abrir Modal de Clima
        </button>
        <WeatherModal isOpen={isOpen} onClose={() => console.log('Modal closed')} />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
