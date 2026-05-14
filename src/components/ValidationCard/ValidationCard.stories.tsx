import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValidationCard } from './ValidationCard';

const meta = {
  title: 'Components/ValidationCard',
  component: ValidationCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onValidateClick: { action: 'clicked' },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ValidationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InRevision: Story = {
  args: {
    title: 'Gusano Cogollero en Maíz',
    typeLabel: 'Alerta',
    statusName: 'Revisión',
    date: '2026-05-11T10:00:00Z',
    reporterId: 42,
    reporterName: 'Juan Pérez',
    description: 'Afectación moderada observada en parcelas centrales. Presencia de larvas en tercer estadio.',
  },
};

export const Accepted: Story = {
  args: {
    title: 'Tratamiento con Imidacloprid',
    typeLabel: 'Recomendación',
    statusName: 'Aceptado',
    date: '2026-05-10T14:30:00Z',
    reporterId: 15,
    reporterName: 'María García',
    description: 'Aplicación de imidacloprid a razón de 500ml/ha para control de mosca blanca.',
    validatedByName: 'Admin López',
    validatedAt: '2026-05-10T16:00:00Z',
  },
};

export const Rejected: Story = {
  args: {
    title: 'Monitoreo de Langosta',
    typeLabel: 'Vigilancia',
    statusName: 'Rechazado',
    date: '2026-05-09T08:15:00Z',
    reporterId: 8,
    validatedByName: 'Admin Torres',
    validatedAt: '2026-05-09T12:30:00Z',
  },
};

export const WithCustomContent: Story = {
  args: {
    title: 'Plaga Desconocida',
    typeLabel: 'Alerta',
    statusName: 'Revisión',
    date: '2026-05-11T10:00:00Z',
    children: (
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
          Severidad Alta
        </span>
        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          10 Hectáreas
        </span>
      </div>
    ),
  },
};
