import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PlagueAlertsModal } from './PlagueAlertsModal';

const meta = {
  title: 'Components/PlagueAlertsModal',
  component: PlagueAlertsModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlagueAlertsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlagueAlertsModalDemo() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Plague Alerts Modal Demo</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-[10px] bg-[#75C79E] px-4 py-2 font-bold text-white hover:bg-[#6ab080]"
        >
          Abrir Alertas de Plagas
        </button>
      </div>
      <PlagueAlertsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onVerMapaCompleto={() => console.log('Ver mapa completo')}
      />
    </div>
  );
}

const STUB_ARGS = {
  isOpen: true,
  onClose: () => {},
};

export const Default: Story = {
  args: STUB_ARGS,
  render: () => <PlagueAlertsModalDemo />,
  parameters: { layout: 'fullscreen' },
};

export const Abierto: Story = {
  args: STUB_ARGS,
  render: () => (
    <div className="min-h-screen bg-gray-100">
      <PlagueAlertsModal
        isOpen={true}
        onClose={() => console.log('cerrado')}
        onVerMapaCompleto={() => console.log('Ver mapa completo')}
      />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
