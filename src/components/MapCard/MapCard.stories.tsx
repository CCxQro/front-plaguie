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
    variant: 'incidents',
    data: {
      title: 'Incidentes activos',
      value: 5,
      description: '5 alertas criticas',
      actionLabel: 'Ver mapa completo',
      locations: [
        { color: '#EF4444', left: '2rem', top: '3.5rem' },
        { color: '#EF4444', left: '6.25rem', top: '1.75rem' },
        { color: '#F97316', left: '10.25rem', top: '7.5rem' },
      ],
    },
  },
};

export const CompactWeather: Story = {
  args: {
    variant: 'weather',
    data: {
      title: 'Region Norte',
      value: 'Soleado',
      temperature: '28C',
      humidity: '45% Humedad',
      wind: '12 km/h Viento',
    },
  },
};

export const ParcelSummary: Story = {
  args: {
    variant: 'parcel',
    data: {
      title: 'Parcela Norte A',
      description: 'Activa',
      crop: 'Maiz',
      area: '15 hectareas',
      harvest: 'Cosecha: 15 Jul 2024',
      lastInspection: 'Ultima inspeccion: Hace 3 dias',
    },
  },
};

export const WithFieldMap: Story = {
  args: {
    data: {
      heading: 'Cobertura de rutas',
      incidentsCount: '12 eventos',
      alertText: '3 zonas con riesgo alto',
      cta: 'Explorar zonas',
      pins: [
        { left: '3rem', top: '2rem', color: '#2563EB' },
        { left: '8.5rem', top: '6rem', color: '#16A34A' },
      ],
    },
    fieldMap: {
      title: 'heading',
      value: 'incidentsCount',
      description: 'alertText',
      actionLabel: 'cta',
      locations: 'pins',
    },
  },
};
