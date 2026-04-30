import type { Meta, StoryObj } from '@storybook/react-vite';

import { SidebarHeader, type SidebarHeaderProps } from './SidebarHeader';

const meta = {
  title: 'Components/SidebarHeader',
  component: SidebarHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['normal', 'green'],
    },
    appName: { control: 'text' },
    appSubtitle: { control: 'text' },
    roleLabel: { control: 'text' },
  },
} satisfies Meta<typeof SidebarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function HeaderFrame(args: SidebarHeaderProps) {
  const isGreen = args.variant === 'green';

  return (
    <div
      className={isGreen ? 'w-64 rounded-t-xl bg-[linear-gradient(180deg,#008236_0%,#016630_100%)] text-white' : 'w-64 rounded-t-xl border border-[#E2E8F0] bg-white'}
    >
      <SidebarHeader {...args} />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <HeaderFrame {...args} />,
  args: {
    variant: 'normal',
    appName: 'Plaguie',
    appSubtitle: 'Gestion de Ventas',
    roleLabel: 'Administrador',
  },
};

export const Verde: Story = {
  render: (args) => <HeaderFrame {...args} />,
  args: {
    variant: 'green',
    appName: 'Plaguie',
    appSubtitle: 'Gestion de Ventas',
    roleLabel: 'Administrador',
  },
};