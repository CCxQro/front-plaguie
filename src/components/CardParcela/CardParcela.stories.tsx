import type { Meta, StoryObj } from '@storybook/react';
import CardParcela from './CardParcela';

const meta: Meta<typeof CardParcela> = {
  title: 'Components/CardParcela',
  component: CardParcela,
};

export default meta;

type Story = StoryObj<typeof CardParcela>;

export const Maiz: Story = {
  args: {
    nombre: 'Parcela Norte A',
    tipoSiembra: 'Maíz',
    hectareas: 15,
    cosecha: new Date(2024, 6, 15),
    inspeccion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),       
  },
};

export const Trigo: Story = {
  args: {
    nombre: 'Parcela Sur B',
    tipoSiembra: 'Trigo',
    hectareas: 32,
    cosecha: new Date(2024, 10, 20), 
    inspeccion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
  },
};
