import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import GestionUsuariosPanel from './GestionUsuariosPanel';
import type { AdminUser } from '../types/AdminUser';

vi.mock('../services/admin/users', () => ({
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  registerUser: vi.fn(),
  updateUserById: vi.fn(),
  deactivateUserById: vi.fn(),
}));

import {
  getUsers,
  getUserById,
  registerUser,
  updateUserById,
  deactivateUserById,
} from '../services/admin/users';

const mockGetUsers = vi.mocked(getUsers);
const mockGetUserById = vi.mocked(getUserById);
const mockRegisterUser = vi.mocked(registerUser);
const mockUpdateUserById = vi.mocked(updateUserById);
const mockDeactivateUserById = vi.mocked(deactivateUserById);

const ACTIVE_USER: AdminUser = {
  userId: 1,
  firebaseUuid: 'firebase-uuid-001',
  name: 'Ana García',
  email: 'ana@example.com',
  roleId: 3,
  isActive: true,
};

const INACTIVE_USER: AdminUser = {
  userId: 2,
  firebaseUuid: 'firebase-uuid-002',
  name: 'Carlos López',
  email: 'carlos@example.com',
  roleId: 1,
  isActive: false,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetUsers.mockResolvedValue([ACTIVE_USER, INACTIVE_USER]);
});

describe('GestionUsuariosPanel', () => {
  it('renders the panel with data-testid', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    expect(screen.getByTestId('gestion-usuarios-panel')).toBeInTheDocument();
  });

  it('renders the page heading', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
  });

  it('shows loading state before users arrive', () => {
    mockGetUsers.mockReturnValue(new Promise(() => {}));
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });

  it('renders user rows after data loads', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Carlos López')).toBeInTheDocument();
  });

  it('renders the users table', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    expect(screen.getByTestId('users-table')).toBeInTheDocument();
  });

  it('filters users by name search', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    const searchInput = screen.getByTestId('users-search-input');
    await userEvent.type(searchInput, 'ana');

    expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.queryByText('Carlos López')).not.toBeInTheDocument();
  });

  it('filters users by email search', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.type(screen.getByTestId('users-search-input'), 'carlos@');

    expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    expect(screen.getByText('Carlos López')).toBeInTheDocument();
  });

  it('shows empty results when search matches nothing', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.type(screen.getByTestId('users-search-input'), 'zzznotfound');

    expect(screen.queryAllByTestId('user-row')).toHaveLength(0);
  });

  it('shows create user modal when button is clicked', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByTestId('create-user-button'));
    expect(screen.getByTestId('create-user-modal')).toBeInTheDocument();
    expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument();
  });

  it('closes create modal on cancel', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByTestId('create-user-button'));
    await userEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('create-user-modal')).not.toBeInTheDocument();
  });

  it('shows form validation error when creating with empty fields', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByTestId('create-user-button'));
    await userEvent.click(screen.getByText('Guardar Usuario'));
    expect(
      screen.getByText('Nombre, correo y contraseña son obligatorios'),
    ).toBeInTheDocument();
  });

  it('calls registerUser and closes modal on successful create', async () => {
    const newUser: AdminUser = { ...ACTIVE_USER, userId: 3, name: 'Nuevo Usuario', email: 'nuevo@example.com' };
    mockRegisterUser.mockResolvedValue(newUser);
    mockGetUsers.mockResolvedValue([ACTIVE_USER, INACTIVE_USER, newUser]);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByTestId('create-user-button'));

    await userEvent.type(screen.getByPlaceholderText('Ej. Juan Pérez'), 'Nuevo Usuario');
    await userEvent.type(screen.getByPlaceholderText('juan.perez@empresa.com'), 'nuevo@example.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    await userEvent.click(screen.getByText('Guardar Usuario'));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        name: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        password: 'password123',
        roleId: 3,
      });
      expect(screen.queryByTestId('create-user-modal')).not.toBeInTheDocument();
    });
  });

  it('opens edit modal with user data when edit button is clicked', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ana García')).toBeInTheDocument();
  });

  it('closes edit modal on cancel', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);
    await userEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('edit-user-modal')).not.toBeInTheDocument();
  });

  it('calls updateUserById on save edit', async () => {
    const updated = { ...ACTIVE_USER, name: 'Ana Modificada' };
    mockUpdateUserById.mockResolvedValue(updated);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Ana García');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Ana Modificada');
    await userEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => {
      expect(mockUpdateUserById).toHaveBeenCalledWith(ACTIVE_USER.userId, expect.objectContaining({ name: 'Ana Modificada' }));
      expect(screen.queryByTestId('edit-user-modal')).not.toBeInTheDocument();
    });
  });

  it('opens user detail modal when view button is clicked', async () => {
    mockGetUserById.mockResolvedValue(ACTIVE_USER);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('view-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('view-user-button')[0]);

    expect(screen.getByTestId('user-detail-modal')).toBeInTheDocument();
    expect(screen.getByText('Detalle del Usuario')).toBeInTheDocument();
  });

  it('shows user detail data in modal', async () => {
    mockGetUserById.mockResolvedValue(ACTIVE_USER);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('view-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('view-user-button')[0]);

    await waitFor(() => {
      expect(screen.getByText(ACTIVE_USER.firebaseUuid)).toBeInTheDocument();
    });
    expect(screen.getAllByText('Ana García').length).toBeGreaterThan(0);
  });

  it('closes detail modal on close button', async () => {
    mockGetUserById.mockResolvedValue(ACTIVE_USER);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('view-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('view-user-button')[0]);
    expect(screen.getByTestId('user-detail-modal')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Cerrar detalle'));
    expect(screen.queryByTestId('user-detail-modal')).not.toBeInTheDocument();
  });

  it('opens confirm deactivate modal when toggle is clicked on active user', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('toggle-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getByLabelText(`Desactivar ${ACTIVE_USER.name}`));

    expect(screen.getByTestId('confirm-deactivate-modal')).toBeInTheDocument();
    expect(screen.getByText('Desactivar Usuario')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-deactivate-modal')).toHaveTextContent(ACTIVE_USER.name);
  });

  it('calls deactivateUserById on confirm deactivate', async () => {
    mockDeactivateUserById.mockResolvedValue(undefined);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Desactivar ${ACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Desactivar ${ACTIVE_USER.name}`));
    await userEvent.click(screen.getByText('Desactivar'));

    await waitFor(() => {
      expect(mockDeactivateUserById).toHaveBeenCalledWith(ACTIVE_USER.userId);
      expect(screen.queryByTestId('confirm-deactivate-modal')).not.toBeInTheDocument();
    });
  });

  it('cancels deactivate confirm dialog', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Desactivar ${ACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Desactivar ${ACTIVE_USER.name}`));
    await userEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByTestId('confirm-deactivate-modal')).not.toBeInTheDocument();
    expect(mockDeactivateUserById).not.toHaveBeenCalled();
  });

  it('calls updateUserById to reactivate when toggle is clicked on inactive user', async () => {
    mockUpdateUserById.mockResolvedValue({ ...INACTIVE_USER, isActive: true });

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`));

    await waitFor(() => {
      expect(mockUpdateUserById).toHaveBeenCalledWith(INACTIVE_USER.userId, { isActive: true });
    });
    expect(screen.queryByTestId('confirm-deactivate-modal')).not.toBeInTheDocument();
  });

  it('shows active/inactive status badges', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('shows role badges for each user', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    expect(screen.getByText('Técnico Vendedor')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('shows error message when getUsers fails', async () => {
    mockGetUsers.mockRejectedValue(new Error('Error de red'));
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('Error de red')).toBeInTheDocument();
    });
  });

  it('disables role select for Agricultor in edit modal', async () => {
    mockGetUsers.mockResolvedValue([{ ...ACTIVE_USER, roleId: 2 }]);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(1);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect).toBeDisabled();
    expect(
      screen.getByText('El rol Agricultor no puede ser modificado.'),
    ).toBeInTheDocument();
  });
});
