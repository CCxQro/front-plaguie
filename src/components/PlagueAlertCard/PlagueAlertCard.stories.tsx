import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlagueAlertCard, type PlagueAlertCardProps } from './PlagueAlertCard';

const meta = {
  title: 'Components/PlagueAlertCard',
  component: PlagueAlertCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['critico', 'advertencia', 'informacion'] },
    titulo: { control: 'text' },
    ubicacion: { control: 'text' },
    tiempo: { control: 'text' },
    tipoPlaga: { control: 'text' },
    hectareas: { control: 'text' },
    etiquetaSeveridad: { control: 'text' },
  },
} satisfies Meta<typeof PlagueAlertCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'critico',
    titulo: 'Plaga de Langosta Detectada',
    ubicacion: 'Monterrey, N.L.',
    tiempo: 'Hace 15 min',
    tipoPlaga: 'Langosta',
    hectareas: '50 hectáreas',
    className: 'w-[644px]',
  } satisfies PlagueAlertCardProps,
};

export const Advertencia: Story = {
  args: {
    variant: 'advertencia',
    titulo: 'Infestación de Pulgón',
    ubicacion: 'Ciudad de México',
    tiempo: 'Hace 2 horas',
    tipoPlaga: 'Pulgón',
    hectareas: '15 hectáreas',
    className: 'w-[644px]',
  } satisfies PlagueAlertCardProps,
};

export const Informacion: Story = {
  args: {
    variant: 'informacion',
    titulo: 'Mosca Blanca en Hortalizas',
    ubicacion: 'Guadalajara, Jal.',
    tiempo: 'Hace 4 horas',
    tipoPlaga: 'Mosca Blanca',
    hectareas: '8 hectáreas',
    className: 'w-[644px]',
  } satisfies PlagueAlertCardProps,
};

export const ListaVariantes: Story = {
  args: {
    variant: 'critico',
    titulo: '',
    ubicacion: '',
    tiempo: '',
    tipoPlaga: '',
    hectareas: '',
  },
  render: () => (
    <div className="w-161 space-y-4">
      <PlagueAlertCard
        variant="critico"
        titulo="Plaga de Langosta Detectada"
        ubicacion="Monterrey, N.L."
        tiempo="Hace 15 min"
        tipoPlaga="Langosta"
        hectareas="50 hectáreas"
      />

      <PlagueAlertCard
        variant="critico"
        titulo="Gusano Cogollero Activo"
        ubicacion="Puebla, Pue."
        tiempo="Hace 30 min"
        tipoPlaga="Gusano Cogollero"
        hectareas="35 hectáreas"
      />

      <PlagueAlertCard
        variant="advertencia"
        titulo="Infestación de Pulgón"
        ubicacion="Ciudad de México"
        tiempo="Hace 2 horas"
        tipoPlaga="Pulgón"
        hectareas="15 hectáreas"
      />

      <PlagueAlertCard
        variant="advertencia"
        titulo="Trips en Cultivos Protegidos"
        ubicacion="Tijuana, B.C."
        tiempo="Hace 1 día"
        tipoPlaga="Trips"
        hectareas="12 hectáreas"
      />

      <PlagueAlertCard
        variant="informacion"
        titulo="Mosca Blanca en Hortalizas"
        ubicacion="Guadalajara, Jal."
        tiempo="Hace 4 horas"
        tipoPlaga="Mosca Blanca"
        hectareas="8 hectáreas"
      />
    </div>
  ),
};