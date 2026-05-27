import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NuevoProductoModal } from './NuevoProductoModal';
import { withProductData } from '../../test/withProductData';

const meta = {
  title: 'Components/NuevoProductoModal',
  component: NuevoProductoModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [withProductData],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof NuevoProductoModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
