import type { SidebarItem } from './Sidebar';

export const DEFAULT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'inicio', label: 'Dashboard', icon: 'dashboard', href: '/sales-technician/inicio' },
  { id: 'ventas', label: 'Ventas', icon: 'inventario', href: '/sales-technician/ventas' },
  { id: 'clientes', label: 'Clientes', icon: 'clientes', href: '/sales-technician/clientes' },
  { id: 'productos', label: 'Productos', icon: 'cubo', href: '/sales-technician/productos' },
  { id: 'reportes', label: 'Reportes', icon: 'dashboards', href: '/sales-technician/reportes' },
  { id: 'alertas', label: 'Alertas', icon: 'informacion', href: '/sales-technician/alertas' },
  { id: 'mapa', label: 'Mapa', icon: 'mapa', href: '/sales-technician/mapa' },
];
