import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Navbar from './Navbar';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    links: [
      { title: 'Inicio', href: '#' },
      { title: 'Enfermedades', href: '#' },
      { title: 'Soluciones', href: '#' },
      { title: 'Contacto', href: '#' },
    ],
    onLogin: fn(),
    onSignUp: fn(),
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
