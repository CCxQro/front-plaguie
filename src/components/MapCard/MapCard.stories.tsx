import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapCard } from './MapCard';

const meta = {
  title: 'Components/MapCard',
  component: MapCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MapCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'locations',
    data: {
      title: 'Incidentes activos',
      value: 5,
      description: '5 alertas criticas',
      actionLabel: 'Ver mapa completo',
    },
    locationPoints: [
      { color: '#EF4444', left: '2rem', top: '3.5rem' },
      { color: '#EF4444', left: '6.25rem', top: '1.75rem' },
      { color: '#F97316', left: '10.25rem', top: '7.5rem' },
    ],
  },
};

export const Weather: Story = {
  args: {
    variant: 'weather',
    data: {
      title: 'Clima por regiones',
      value: '3 zonas activas',
      description: 'actualizado hace 10 min',
      actionLabel: 'Ver pronostico',
    },
    weatherPoints: [
      { left: '62px', top: '52px', icon: 'sun', temperature: '28°' },
      { left: '135px', top: '73px', icon: 'cloud', temperature: '22°' },
      { left: '83px', top: '146px', icon: 'rain', temperature: '18°' },
    ],
  },
};

export const WithFieldMap: Story = {
  args: {
    variant: 'weather',
    data: {
      heading: 'Mini mapa de clima',
      summary: '3 regiones monitoreadas',
      note: 'actualizado en tiempo real',
      cta: 'Abrir panel',
      markers: [
        { left: '58px', top: '48px', icon: 'sun', temperature: '26°' },
        { left: '140px', top: '74px', icon: 'cloud', temperature: '20°' },
        { left: '86px', top: '152px', icon: 'storm', temperature: '17°' },
      ],
    },
    fieldMap: {
      title: 'heading',
      value: 'summary',
      description: 'note',
      actionLabel: 'cta',
      weatherPoints: 'markers',
    },
  },
};
