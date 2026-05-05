import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryBadge from './CategoryBadge';

const meta: Meta<typeof CategoryBadge> = {
  title: 'Components/CategoryBadge',
  component: CategoryBadge,
  argTypes: {
    color: { control: 'color' },
    width: { control: 'text' },
    height: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CategoryBadge>;

export const Fungicidas: Story = {
  args: {
    label: 'Fungicidas',
    color: '#8200DB',
    width: 'w-auto',
    height: 'h-6',
  },
};

export const Herbicidas: Story = {
  args: {
    label: 'Herbicidas',
    color: '#0077B6',
    width: 'w-auto',
    height: 'h-6',
  },
};

export const Insecticidas: Story = {
  args: {
    label: 'Insecticidas',
    color: '#D4500C',
    width: 'w-auto',
    height: 'h-6',
  },
};

export const Fertilizantes: Story = {
  args: {
    label: 'Fertilizantes',
    color: '#008236',
    width: 'w-auto',
    height: 'h-6',
  },
};
