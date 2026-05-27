import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AjustarStockModal } from './AjustarStockModal';
import { MOCK_SKU_SELLER_ID } from '../../test/productFixtures';
import { withProductData } from '../../test/withProductData';

const meta = {
  title: 'Components/AjustarStockModal',
  component: AjustarStockModal,
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
    currentStock: { control: 'number' },
    unitName: { control: 'text' },
  },
} satisfies Meta<typeof AjustarStockModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skuSellerId: MOCK_SKU_SELLER_ID,
    productName: 'Fertilizante NPK 20-20-20',
    currentStock: 85,
    unitName: 'Litro',
  },
};

export const StockBajo: Story = {
  args: {
    skuSellerId: MOCK_SKU_SELLER_ID,
    productName: 'Herbicida Glifosato 36%',
    currentStock: 6,
    unitName: 'Litro',
  },
};
