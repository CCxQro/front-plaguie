import type { Meta, StoryObj } from '@storybook/react-vite';

import { InventoryTableRow, type InventoryTableRowData } from './InventoryTableRow';
import { MOCK_PRODUCT_IMAGE } from '../../test/productFixtures';
import { withProductData } from '../../test/withProductData';

const baseRow: InventoryTableRowData = {
  id: '1001',
  product: 'Fertilizante NPK 20-20-20',
  sku: 'PLG-001',
  category: 'Fertilizantes',
  categoryColor: '#008236',
  price: '$250.00',
  unitValue: 25,
  stock: 85,
  stockMax: 100,
  stockState: 'ok',
  stockLabel: 'Stock normal',
  unitName: 'Litros',
  imageUrl: MOCK_PRODUCT_IMAGE,
};

const meta = {
  title: 'Components/InventoryTableRow',
  component: InventoryTableRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    withProductData,
    (Story) => (
      <table className="w-full max-w-4xl border-separate border-spacing-0 rounded-2xl border border-[#E2E8F0] bg-white">
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
  argTypes: {
    row: { control: 'object' },
    onView: { action: 'onView' },
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
  },
} satisfies Meta<typeof InventoryTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StockNormal: Story = {
  args: {
    row: baseRow,
  },
};

export const StockBajo: Story = {
  args: {
    row: {
      ...baseRow,
      id: '1002',
      product: 'Herbicida Glifosato 36%',
      sku: 'PLG-002',
      category: 'Herbicidas',
      categoryColor: '#CA3500',
      price: '$180.00',
      stock: 12,
      stockMax: 100,
      stockState: 'bajo',
      stockLabel: 'Stock bajo',
    },
  },
};

export const Agotado: Story = {
  args: {
    row: {
      ...baseRow,
      id: '1003',
      product: 'Insecticida Clorpirifos 48E',
      sku: 'PLG-003',
      category: 'Insecticidas',
      categoryColor: '#1447E6',
      price: '$320.00',
      stock: 0,
      stockMax: 100,
      stockState: 'agotado',
      stockLabel: 'Agotado',
    },
  },
};
