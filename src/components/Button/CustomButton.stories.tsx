import type { Meta, StoryObj } from '@storybook/react-vite';

import CustomButton from './CustomButton';

const meta = {
  title: 'Components/CustomButton',
  component: CustomButton,
  tags: ['autodocs'],
  argTypes: {
    bgColor: {
      control: 'text',
      description: 'Clase de Tailwind para el fondo',
    },
    fgColor: {
      control: 'text',
      description: 'Clase de Tailwind para el color del texto',
    },
  },
  args: {
    title: 'Iniciar Sesión',
    onPress: () => undefined,
    enabled: true,
    bgColor: 'bg-[#75C79E]',
    fgColor: 'text-[#0F172A]',
  },
} satisfies Meta<typeof CustomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    bgColor: 'bg-[#0F172A]',
    fgColor: 'text-white',
    title: 'Iniciar Sesión',
    enabled: false,
  },
};
