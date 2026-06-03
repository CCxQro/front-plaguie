import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import GestionUsuariosPanel from './GestionUsuariosPanel';
import type { DataUser, UserListParams, UsersPage } from '../types/DataUser';

vi.mock('../services/admin/users', () => ({
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  registerUser: vi.fn(),
  updateUserById: vi.fn(),
  deactivateUserById: vi.fn(),
  getPendingFarmers: vi.fn(),
  approveFarmer: vi.fn(),
  rejectFarmer: vi.fn(),
}));

import {
  getUsers,
  getUserById,
  registerUser,
  updateUserById,
  deactivateUserById,
  getPendingFarmers,
} from '../services/admin/users';

const mockGetUsers = vi.mocked(getUsers);
const mockGetUserById = vi.mocked(getUserById);
const mockRegisterUser = vi.mocked(registerUser);
const mockUpdateUserById = vi.mocked(updateUserById);
const mockDeactivateUserById = vi.mocked(deactivateUserById);
const mockGetPendingFarmers = vi.mocked(getPendingFarmers);

const ACTIVE_USER: DataUser = {
  userId: 1,
  firebaseUuid: 'firebase-uuid-001',
  name: 'Ana García',
  email: 'ana@example.com',
  roleId: 3,
  isActive: true,
};

const INACTIVE_USER: DataUser = {
  userId: 2,
  firebaseUuid: 'firebase-uuid-002',
  name: 'Carlos López',
  email: 'carlos@example.com',
  roleId: 1,
  isActive: false,
};

function makePage(content: DataUser[], params?: Partial<UserListParams>): UsersPage {
  return {
    content,
    totalElements: content.length,
    totalPages: Math.max(1, Math.ceil(content.length / (params?.size ?? 10))),
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };
}

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
  mockGetPendingFarmers.mockResolvedValue([]);
  mockGetUsers.mockImplementation(async (params: UserListParams) => {
    const all = [ACTIVE_USER, INACTIVE_USER];
    const nameQ = params.name?.toLowerCase();
    let results = all;
    if (nameQ) {
      results = results.filter(
        (u) => u.name.toLowerCase().includes(nameQ) || u.email.toLowerCase().includes(nameQ),
      );
    }
    if (params.roleId !== undefined) {
      results = results.filter((u) => u.roleId === params.roleId);
    }
    if (params.isActive !== undefined) {
      results = results.filter((u) => u.isActive === params.isActive);
    }
    return makePage(results, params);
  });
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

    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    });
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.queryByText('Carlos López')).not.toBeInTheDocument();
  });

  it('filters users by email search', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.type(screen.getByTestId('users-search-input'), 'carlos@');

    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    });
    expect(screen.getByText('Carlos López')).toBeInTheDocument();
  });

  it('shows empty results when search matches nothing', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.type(screen.getByTestId('users-search-input'), 'zzznotfound');

    await waitFor(() => {
      expect(screen.queryAllByTestId('user-row')).toHaveLength(0);
    });
  });

  it('filters users by role', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.selectOptions(screen.getByTestId('role-filter-select'), '1');

    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    });
    expect(screen.getByText('Carlos López')).toBeInTheDocument();
    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();
  });

  it('shows all users when role filter is reset to all', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(2));

    await userEvent.selectOptions(screen.getByTestId('role-filter-select'), '1');
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(1));

    await userEvent.selectOptions(screen.getByTestId('role-filter-select'), '');
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(2));
  });

  it('filters users by active status', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.selectOptions(screen.getByTestId('status-filter-select'), 'true');

    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    });
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.queryByText('Carlos López')).not.toBeInTheDocument();
  });

  it('filters users by inactive status', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    await userEvent.selectOptions(screen.getByTestId('status-filter-select'), 'false');

    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    });
    expect(screen.getByText('Carlos López')).toBeInTheDocument();
  });

  it('passes combined name and role filters to getUsers', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(2));

    await userEvent.type(screen.getByTestId('users-search-input'), 'ana');
    await userEvent.selectOptions(screen.getByTestId('role-filter-select'), '3');

    await waitFor(() => {
      expect(mockGetUsers).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'ana', roleId: 3 }),
      );
    });
  });

  it('shows pagination summary', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByTestId('pagination-summary')).toHaveTextContent('Mostrando');
    });
  });

  it('shows pagination info with page number', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByTestId('pagination-info')).toHaveTextContent('Página 1 de 1');
    });
  });

  it('disables prev button on first page', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(2));
    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('disables next button when on last page', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(2));
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
  });

  it('enables next button and navigates when multiple pages exist', async () => {
    const page0Users = Array.from({ length: 10 }, (_, i) => ({
      ...ACTIVE_USER,
      userId: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));
    const page1Users = [{ ...INACTIVE_USER, userId: 11 }];

    mockGetUsers.mockImplementation(async (params: UserListParams) => ({
      content: params.page === 0 ? page0Users : page1Users,
      totalElements: 11,
      totalPages: 2,
      page: params.page,
      size: 10,
    }));

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(10));

    expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
    expect(screen.getByTestId('pagination-info')).toHaveTextContent('Página 1 de 2');

    await userEvent.click(screen.getByTestId('pagination-next'));

    await waitFor(() => {
      expect(screen.getByTestId('pagination-info')).toHaveTextContent('Página 2 de 2');
    });
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
    expect(screen.getByTestId('pagination-prev')).not.toBeDisabled();
  });

  it('resets to page 1 when search filter changes', async () => {
    const page0Users = Array.from({ length: 10 }, (_, i) => ({
      ...ACTIVE_USER,
      userId: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    mockGetUsers.mockImplementation(async (params: UserListParams) => {
      if (params.name) {
        return makePage([ACTIVE_USER], params);
      }
      return { content: page0Users, totalElements: 15, totalPages: 2, page: params.page, size: 10 };
    });

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => expect(screen.getAllByTestId('user-row')).toHaveLength(10));

    await userEvent.click(screen.getByTestId('pagination-next'));
    await waitFor(() =>
      expect(screen.getByTestId('pagination-info')).toHaveTextContent('Página 2 de 2'),
    );

    await userEvent.type(screen.getByTestId('users-search-input'), 'ana');
    await waitFor(() =>
      expect(screen.getByTestId('pagination-info')).toHaveTextContent('Página 1'),
    );
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
    const newUser: DataUser = { ...ACTIVE_USER, userId: 3, name: 'Nuevo Usuario', email: 'nuevo@example.com' };
    mockRegisterUser.mockResolvedValue(newUser);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await userEvent.click(screen.getByTestId('create-user-button'));

    await userEvent.type(screen.getByPlaceholderText('Ej. Juan Pérez'), 'Nuevo Usuario');
    await userEvent.type(screen.getByPlaceholderText('juan.perez@empresa.com'), 'nuevo@example.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Repite la contraseña'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Ej. Nuevo León'), 'Nuevo León');
    await userEvent.type(screen.getByPlaceholderText('Ej. Monterrey'), 'Monterrey');
    await userEvent.type(screen.getByPlaceholderText('Ej. Centro'), 'Centro');
    await userEvent.type(screen.getByPlaceholderText('Ej. Rancho San Pedro'), 'Rancho San Pedro');
    await userEvent.type(screen.getByPlaceholderText('25.6866'), '25.6866');
    await userEvent.type(screen.getByPlaceholderText('-100.3161'), '-100.3161');
    await userEvent.click(screen.getByText('Guardar Usuario'));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        name: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        password: 'password123',
        roleId: 3,
        location: {
          stateName: 'Nuevo León',
          municipalityName: 'Monterrey',
          localityName: 'Centro',
          propertyName: 'Rancho San Pedro',
          latitude: 25.6866,
          longitude: -100.3161,
        },
      });
      expect(screen.queryByTestId('create-user-modal')).not.toBeInTheDocument();
    });
  });

  it('opens edit modal with user data when edit button is clicked', async () => {
    mockGetUserById.mockResolvedValue(ACTIVE_USER);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Ana García')).toBeInTheDocument();
    });
  });

  it('closes edit modal on cancel', async () => {
    mockGetUserById.mockResolvedValue(ACTIVE_USER);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);
    await waitFor(() => screen.getByDisplayValue('Ana García'));
    await userEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('edit-user-modal')).not.toBeInTheDocument();
  });

  it('calls updateUserById on save edit', async () => {
    const adminUser = { ...ACTIVE_USER, roleId: 1 };
    const updated = { ...adminUser, name: 'Ana Modificada' };
    mockGetUserById.mockResolvedValue(adminUser);
    mockUpdateUserById.mockResolvedValue(updated);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(2);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    const nameInput = await screen.findByDisplayValue('Ana García');
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
      expect(
        within(screen.getByTestId('user-detail-modal')).getByText(ACTIVE_USER.email),
      ).toBeInTheDocument();
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

  it('opens confirm activate modal when toggle is clicked on inactive user', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`));

    expect(screen.getByTestId('confirm-activate-modal')).toBeInTheDocument();
    expect(screen.getByText('Aprobar Usuario')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-activate-modal')).toHaveTextContent(INACTIVE_USER.name);
    expect(mockUpdateUserById).not.toHaveBeenCalled();
  });

  it('calls updateUserById to approve on confirm activate', async () => {
    mockUpdateUserById.mockResolvedValue({ ...INACTIVE_USER, isActive: true });

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`));
    await userEvent.click(screen.getByText('Aprobar'));

    await waitFor(() => {
      expect(mockUpdateUserById).toHaveBeenCalledWith(INACTIVE_USER.userId, { isActive: true });
      expect(screen.queryByTestId('confirm-activate-modal')).not.toBeInTheDocument();
    });
  });

  it('cancels activate confirm dialog without approving', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(`Activar ${INACTIVE_USER.name}`));
    await userEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByTestId('confirm-activate-modal')).not.toBeInTheDocument();
    expect(mockUpdateUserById).not.toHaveBeenCalled();
  });

  it('shows active/inactive status badges', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    // getAllByText because filter dropdowns also contain these strings as option labels
    expect(screen.getAllByText('Activo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Inactivo').length).toBeGreaterThan(0);
  });

  it('shows role badges for each user', async () => {
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('user-row')).toHaveLength(2);
    });

    // getAllByText because role filter dropdown also contains these strings as option labels
    expect(screen.getAllByText('Técnico Vendedor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Administrador').length).toBeGreaterThan(0);
  });

  it('shows error message when getUsers fails', async () => {
    mockGetUsers.mockRejectedValue(new Error('Error de red'));
    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('Error de red')).toBeInTheDocument();
    });
  });

  it('disables role select for Agricultor in edit modal', async () => {
    const agricultorUser = { ...ACTIVE_USER, roleId: 2 };
    mockGetUsers.mockImplementation(async (params: UserListParams) =>
      makePage([agricultorUser], params),
    );
    mockGetUserById.mockResolvedValue(agricultorUser);

    render(<GestionUsuariosPanel />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByTestId('edit-user-button')).toHaveLength(1);
    });

    await userEvent.click(screen.getAllByTestId('edit-user-button')[0]);

    await waitFor(() => {
      const roleSelect = within(screen.getByTestId('edit-user-modal')).getByRole('combobox');
      expect(roleSelect).toBeDisabled();
      expect(
        screen.getByText('El rol Agricultor no puede ser modificado.'),
      ).toBeInTheDocument();
    });
  });
});
