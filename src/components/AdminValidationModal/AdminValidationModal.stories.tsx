import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AdminValidationModal } from './AdminValidationModal';

const meta = {
  title: 'Components/AdminValidationModal',
  component: AdminValidationModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onAccept: fn(),
    onReject: fn(),
  },
} satisfies Meta<typeof AdminValidationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Gusano Cogollero detectado',
    typeLabel: 'Vigilancia Fitosanitaria',
    recordId: 102,
    description: 'Incidencia del 15% con severidad de 3. Se recomienda aplicar medidas.',
    details: [
      { label: 'Tipo de Plaga', value: 'Gusano Cogollero' },
      { label: 'Incidencia', value: '15%' },
      { label: 'Severidad', value: 3 },
      { label: 'Ubicación ID', value: 7 },
    ],
    isSubmitting: false,
  },
};

export const AlertaWithDetails: Story = {
  args: {
    isOpen: true,
    title: 'Mosca Blanca en Tomate',
    typeLabel: 'Alerta',
    recordId: 55,
    description: 'Presencia masiva de mosca blanca en cultivos de tomate.',
    details: [
      { label: 'Tipo de Plaga', value: 'Mosca Blanca' },
      { label: 'Hectáreas', value: 12 },
      { label: 'Severidad', value: '🔴 Crítico' },
      { label: 'Ubicación ID', value: 3 },
    ],
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isOpen: true,
    title: 'Gusano Cogollero detectado',
    typeLabel: 'Vigilancia Fitosanitaria',
    recordId: 102,
    description: 'Incidencia del 15% con severidad de 3.',
    details: [
      { label: 'Tipo de Plaga', value: 'Gusano Cogollero' },
      { label: 'Incidencia', value: '15%' },
    ],
    isSubmitting: true,
  },
};
