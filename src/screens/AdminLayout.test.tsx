import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockLogout = vi.fn();
vi.mock('../services/Contexts/useAuthStore', () => ({
  default: () => ({ user: { name: 'Admin Uno', email: 'admin@plaguie.com' }, logout: mockLogout }),
}));

import AdminLayout from './AdminLayout';

function renderLayout(path = '/app/usuarios') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AdminLayout />
    </MemoryRouter>,
  );
}

beforeEach(() => vi.clearAllMocks());

describe('AdminLayout', () => {
  it('renders the admin navigation items', () => {
    renderLayout();
    expect(screen.getAllByText('Gestión de Usuarios').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Inventario Global').length).toBeGreaterThan(0);
  });

  it('logs out from the mobile header button', () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
