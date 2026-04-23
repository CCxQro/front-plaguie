import type { Meta, StoryObj } from '@storybook/react-vite';

import { DataTable, type DataTableProps } from './DataTable';
import type { InventoryTableRowData } from './InventoryTableRow';

const IMG_FUNGICIDA =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22%3E%3Crect width=%2248%22 height=%2248%22 rx=%2210%22 fill=%22%23e2e8f0%22/%3E%3Crect x=%2216%22 y=%228%22 width=%2216%22 height=%2232%22 rx=%223%22 fill=%22%23ffffff%22/%3E%3Crect x=%2219%22 y=%2213%22 width=%2210%22 height=%2210%22 rx=%222%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

const IMG_INSECTICIDA =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22%3E%3Crect width=%2248%22 height=%2248%22 rx=%2210%22 fill=%22%230f172a%22/%3E%3Crect x=%2218%22 y=%228%22 width=%2212%22 height=%2232%22 rx=%222%22 fill=%22%23e2e8f0%22/%3E%3Crect x=%2217%22 y=%2211%22 width=%2214%22 height=%227%22 rx=%221.5%22 fill=%22%2338bdf8%22/%3E%3C/svg%3E';

const IMG_FERTILIZANTE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22%3E%3Crect width=%2248%22 height=%2248%22 rx=%2210%22 fill=%22%23665f2f%22/%3E%3Cpath d=%22M12 12h24l-4 24H16z%22 fill=%22%23e2e8f0%22/%3E%3Crect x=%2218%22 y=%2220%22 width=%2212%22 height=%224%22 rx=%222%22 fill=%22%2300c950%22/%3E%3C/svg%3E';

const IMG_HERBICIDA =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22%3E%3Crect width=%2248%22 height=%2248%22 rx=%2210%22 fill=%22%2316400f%22/%3E%3Crect x=%2215%22 y=%229%22 width=%2218%22 height=%2230%22 rx=%223%22 fill=%22%23066118%22/%3E%3Crect x=%2218%22 y=%2214%22 width=%2212%22 height=%228%22 rx=%222%22 fill=%22%2386efac%22/%3E%3C/svg%3E';

const INVENTORY_ROWS: InventoryTableRowData[] = [
  {
    id: 'FG-100-2024',
    product: 'Fungicida X-100 Pro',
    sku: 'FG-100-2024',
    category: 'Fungicidas',
    categoryTone: 'fungicidas',
    price: '$45.00',
    stock: 85,
    stockMax: 100,
    stockState: 'ok',
    imageUrl: IMG_FUNGICIDA,
  },
  {
    id: 'IG-EG-3321',
    product: 'Insecticida EcoGuard',
    sku: 'IG-EG-3321',
    category: 'Insecticidas',
    categoryTone: 'insecticidas',
    price: '$32.50',
    stock: 12,
    stockMax: 40,
    stockState: 'bajo',
    stockLabel: 'Stock Bajo',
    imageUrl: IMG_INSECTICIDA,
  },
  {
    id: 'FT-NP-996',
    product: 'Fertilizante NitroPlus',
    sku: 'FT-NP-996',
    category: 'Fertilizantes',
    categoryTone: 'fertilizantes',
    price: '$28.00',
    stock: 0,
    stockMax: 100,
    stockState: 'agotado',
    stockLabel: 'Agotado',
    imageUrl: IMG_FERTILIZANTE,
  },
  {
    id: 'HB-MS-1135',
    product: 'Herbicida Max-Strong',
    sku: 'HB-MS-1135',
    category: 'Herbicidas',
    categoryTone: 'herbicidas',
    price: '$55.00',
    stock: 45,
    stockMax: 60,
    stockState: 'ok',
    imageUrl: IMG_HERBICIDA,
  },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['completa', 'compacta'] },
    rows: { control: 'object' },
    title: { control: 'text' },
    headerActionText: { control: 'text' },
    pageText: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    onView: { action: 'onView' },
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'completa',
    rows: INVENTORY_ROWS,
    title: 'Inventario',
    headerActionText: 'Mostrando 4 productos',
    pageText: 'Pagina 1 de 1',
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    className: 'w-[1088px]',
  } satisfies DataTableProps,
};

export const Compacta: Story = {
  args: {
    variant: 'compacta',
    rows: INVENTORY_ROWS,
    title: 'Inventario',
    headerActionText: 'Vista compacta',
    pageText: 'Pagina 1 de 1',
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    className: 'w-[960px]',
  } satisfies DataTableProps,
};
