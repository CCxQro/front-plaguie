import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Sidebar, type SidebarItem, type SidebarProps } from './Sidebar';

const ITEMS_CLARO: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'clientes', label: 'Clientes', icon: 'clientes' },
  { id: 'inventario', label: 'Inventario', icon: 'inventario' },
  { id: 'mapa', label: 'Mapa de Incidentes', icon: 'mapa' },
  { id: 'informacion', label: 'Informacion de Venta', icon: 'informacion' },
];

const ITEMS_VERDE: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'usuarios', label: 'Gestion de Usuarios', icon: 'usuarios' },
  { id: 'inventarioGlobal', label: 'Inventario Global', icon: 'cubo' },
  { id: 'validacion', label: 'Validacion de Registros', icon: 'validacion' },
  { id: 'dashboards', label: 'Dashboards', icon: 'dashboards' },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['claro', 'verde'],
    },
    appName: { control: 'text' },
    appSubtitle: { control: 'text' },
    roleLabel: { control: 'text' },
    items: { control: 'object' },
    activeItemId: { control: 'text' },
    footerActionLabel: { control: 'text' },
    userName: { control: 'text' },
    userDetail: { control: 'text' },
    userInitials: { control: 'text' },
    onItemClick: { action: 'onItemClick' },
    onFooterActionClick: { action: 'onFooterActionClick' },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function SidebarWrapper(args: SidebarProps) {
  const [activeItemId, setActiveItemId] = useState(args.activeItemId);

  return (
    <div className="h-240 w-64">
      <Sidebar
        {...args}
        activeItemId={activeItemId}
        onItemClick={(itemId) => {
          setActiveItemId(itemId);
          args.onItemClick?.(itemId);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SidebarWrapper {...args} />,
  args: {
    variant: 'claro',
    appName: 'Plaguie',
    appSubtitle: 'Gestion de Ventas',
    roleLabel: 'Administrador',
    items: ITEMS_CLARO,
    activeItemId: 'dashboard',
    footerActionLabel: 'Ajustes',
    userName: 'Carlos Mendez',
    userDetail: 'Ejecutivo Senior',
    userInitials: '',
  },
};

export const AdminVerde: Story = {
  render: (args) => <SidebarWrapper {...args} />,
  args: {
    variant: 'verde',
    appName: 'Plaguie',
    appSubtitle: 'Gestion de Ventas',
    roleLabel: 'Administrador',
    items: ITEMS_VERDE,
    activeItemId: 'dashboard',
    footerActionLabel: 'Cerrar Sesion',
    userName: 'Admin Plaguie',
    userDetail: 'admin@plaguie.com',
    userInitials: 'AP',
  },
};
