import type { Meta, StoryObj } from '@storybook/react';
import { CardImageSuperLink } from './CardImageSuperLink';

const meta: Meta<typeof CardImageSuperLink> = {
  title: 'Components/CardImageSuperLink',
  component: CardImageSuperLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    title: 'Visualización de Datos',
    description: 'Dashboard interactivo con métricas clave para decisiones rápidas basadas en evidencia técnica.',
    linkHref: '/dashboard',
    linkText: 'Ver más',
  },
};

export const Wide: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop',
    title: 'Análisis de Datos Expandido',
    description: 'Esta es una versión de la card que utiliza un contenedor mucho más ancho para mostrar cómo el contenido se adapta a espacios horizontales mayores.',
    linkHref: '/analytics',
    linkText: 'Explorar reporte completo',
    width: 'w-[600px]',
  },
};
