import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NuevoPrecioModal } from './NuevoPrecioModal';
import { MOCK_SKU_SELLER_ID } from '../../test/productFixtures';
import { withProductData } from '../../test/withProductData';

const meta = {
  title: 'Components/NuevoPrecioModal',
  component: NuevoPrecioModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [withProductData],
  args: {
    onClose: fn(),
  },
  argTypes: {
    skuSellerId: { control: 'number' },
    productName: { control: 'text' },
    currentPrice: { control: 'number' },
    unitName: { control: 'text' },
  },
} satisfies Meta<typeof NuevoPrecioModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skuSellerId: MOCK_SKU_SELLER_ID,
    productName: 'Fertilizante NPK 20-20-20',
    currentPrice: 250,
    unitName: 'Litro',
  },
};

export const ProductoPremium: Story = {
  args: {
    skuSellerId: MOCK_SKU_SELLER_ID,
    productName: 'Semilla Maíz Híbrido H-318',
    currentPrice: 890,
    unitName: 'Kilogramo',
  },
};
