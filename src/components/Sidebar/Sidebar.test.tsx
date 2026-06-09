import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Sidebar, type SidebarItem, type SidebarVariant } from './Sidebar';

const items: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/app' },
  { id: 'usuarios', label: 'Usuarios', icon: 'usuarios', href: '/app/usuarios' },
];

function renderSidebar(variant: SidebarVariant, handlers = {}) {
  return render(
    <Sidebar
      variant={variant}
      appName="Plaguie"
      appSubtitle="Gestión de plagas"
      roleLabel="Administrador"
      items={items}
      activeItemId="dashboard"
      footerActionLabel="Cerrar sesión"
      userName="Admin Uno"
      userDetail="admin@plaguie.com"
      userInitials="AU"
      {...handlers}
    />,
  );
}

describe('Sidebar', () => {
  it.each(['verde', 'claro'] as const)('renders the %s variant with items and user', (variant) => {
    renderSidebar(variant);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Admin Uno')).toBeInTheDocument();
    expect(screen.getByText('AU')).toBeInTheDocument();
    // active item is marked
    expect(screen.getByRole('button', { name: /Dashboard/ })).toHaveAttribute('aria-current', 'page');
  });

  it('fires item and footer callbacks (verde)', () => {
    const onItemClick = vi.fn();
    const onFooterActionClick = vi.fn();
    renderSidebar('verde', { onItemClick, onFooterActionClick });
    fireEvent.click(screen.getByRole('button', { name: /Usuarios/ }));
    expect(onItemClick).toHaveBeenCalledWith('usuarios');
    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/ }));
    expect(onFooterActionClick).toHaveBeenCalled();
  });

  it('fires the footer action in the claro variant', () => {
    const onFooterActionClick = vi.fn();
    renderSidebar('claro', { onFooterActionClick });
    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/ }));
    expect(onFooterActionClick).toHaveBeenCalled();
  });
});
