import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['sales', 'inventory', 'clients', 'incidentsMap', 'fieldStatus'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'sales',
  },
};

export const Sales: Story = {
  args: {
    variant: 'sales',
  },
};

export const Inventory: Story = {
  args: {
    variant: 'inventory',
  },
};

export const Clients: Story = {
  args: {
    variant: 'clients',
  },
};

export const IncidentsMap: Story = {
  args: {
    variant: 'incidentsMap',
  },
};

export const FieldStatus: Story = {
  args: {
    variant: 'fieldStatus',
  },
};

export const Gallery: Story = {
  args: {
    variant: 'sales',
  },
  render: () => (
    <div className="grid max-w-[760px] gap-4 md:grid-cols-2">
      <Card variant="sales" />
      <Card variant="inventory" />
      <Card variant="clients" />
      <Card variant="incidentsMap" />
      <Card variant="fieldStatus" className="md:col-span-2" />
    </div>
  ),
};
