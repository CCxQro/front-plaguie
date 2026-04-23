import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import CheckButton from './CheckButton';

const meta = {
  title: 'Components/CheckButton',
  component: CheckButton,
  tags: ['autodocs'],
  argTypes: {
    remember: { control: 'boolean' },
    text: { control: 'text' },
  },
} satisfies Meta<typeof CheckButton>;

export default meta;
type Story = StoryObj<typeof CheckButton>;

type CheckButtonStoryArgs = Omit<ComponentProps<typeof CheckButton>, 'setRemember'> & {
  setRemember?: (value: boolean) => void;
};

const CheckButtonWrapper = (args: CheckButtonStoryArgs) => {
  const [remember, setRemember] = useState(args.remember);

  return (
    <CheckButton 
      {...args} 
      remember={remember} 
      setRemember={(val) => {
        setRemember(val);
        // Opcional: Esto permite que la pestaña "Actions" de Storybook registre el cambio
        args.setRemember?.(val);
      }} 
    />
  );
};

export const Default: Story = {
  render: (args) => <CheckButtonWrapper {...args} />,
  args: {
    remember: false,
    text: 'Recordar sesión',
    width: 'w-4',
    height: 'h-4',
  },
};

export const CustomSize: Story = {
  render: (args) => <CheckButtonWrapper {...args} />,
  args: {
    remember: true,
    text: 'Aceptar términos',
    width: 'w-6',
    height: 'h-6',
  },
};