import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { EditarProductoModal } from './EditarProductoModal';
import { MOCK_SKU_SELLER_ID } from '../../test/productFixtures';
import { withProductData } from '../../test/withProductData';

const meta = {
  title: 'Components/EditarProductoModal',
  component: EditarProductoModal,
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
  },
} satisfies Meta<typeof EditarProductoModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skuSellerId: MOCK_SKU_SELLER_ID,
  },
};
