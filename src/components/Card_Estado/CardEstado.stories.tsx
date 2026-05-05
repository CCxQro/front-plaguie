import type { Meta, StoryObj } from '@storybook/react-vite';
import CardEstado from './CardEstado';

const meta: Meta<typeof CardEstado> = {
  title: 'Components/CardEstado',
  component: CardEstado,
};

export default meta;

type Story = StoryObj<typeof CardEstado>;

export const Default: Story = {};
