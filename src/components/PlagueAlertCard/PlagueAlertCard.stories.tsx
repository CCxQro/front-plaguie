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
    hectareas: '50 hectareas',
    etiquetaSeveridad: 'CRITICO',
    className: 'w-[644px]',
  } satisfies PlagueAlertCardProps,
};

export const Advertencia: Story = {
  args: {
    variant: 'advertencia',
    titulo: 'Infestacion de Pulgon',
    ubicacion: 'Ciudad de Mexico',
    tiempo: 'Hace 2 horas',
    tipoPlaga: 'Pulgon',
    hectareas: '15 hectareas',
    etiquetaSeveridad: 'ADVERTENCIA',
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
    hectareas: '8 hectareas',
    etiquetaSeveridad: 'INFORMACION',
    className: 'w-[644px]',
  } satisfies PlagueAlertCardProps,
};

export const ListaVariantes: Story = {
  render: () => (
    <div className="w-161 space-y-4">
      <PlagueAlertCard
        variant="critico"
        titulo="Plaga de Langosta Detectada"
        ubicacion="Monterrey, N.L."
        tiempo="Hace 15 min"
        tipoPlaga="Langosta"
        hectareas="50 hectareas"
        etiquetaSeveridad="CRITICO"
      />

      <PlagueAlertCard
        variant="critico"
        titulo="Gusano Cogollero Activo"
        ubicacion="Puebla, Pue."
        tiempo="Hace 30 min"
        tipoPlaga="Gusano Cogollero"
        hectareas="35 hectareas"
        etiquetaSeveridad="CRITICO"
      />

      <PlagueAlertCard
        variant="advertencia"
        titulo="Infestacion de Pulgon"
        ubicacion="Ciudad de Mexico"
        tiempo="Hace 2 horas"
        tipoPlaga="Pulgon"
        hectareas="15 hectareas"
        etiquetaSeveridad="ADVERTENCIA"
      />

      <PlagueAlertCard
        variant="advertencia"
        titulo="Trips en Cultivos Protegidos"
        ubicacion="Tijuana, B.C."
        tiempo="Hace 1 dia"
        tipoPlaga="Trips"
        hectareas="12 hectareas"
        etiquetaSeveridad="ADVERTENCIA"
      />

      <PlagueAlertCard
        variant="informacion"
        titulo="Mosca Blanca en Hortalizas"
        ubicacion="Guadalajara, Jal."
        tiempo="Hace 4 horas"
        tipoPlaga="Mosca Blanca"
        hectareas="8 hectareas"
        etiquetaSeveridad="INFORMACION"
      />
    </div>
  ),
};