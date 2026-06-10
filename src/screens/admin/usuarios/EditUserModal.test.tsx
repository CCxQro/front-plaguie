import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../services/admin/users', () => ({ getUserById: vi.fn() }));

// Stub the Leaflet picker; expose a button that clears the location via onChange.
vi.mock('../../../components/LocationPicker/LocationPicker', () => ({
  LocationPicker: ({
    onChange,
    readOnly,
  }: {
    onChange?: (v: unknown) => void;
    readOnly?: boolean;
  }) =>
    readOnly ? (
      <div data-testid="location-picker-readonly" />
    ) : (
      <button
        type="button"
        data-testid="mock-clear-location"
        onClick={() =>
          onChange?.({
            latitude: null,
            longitude: null,
            stateName: '',
            municipalityName: '',
            localityName: '',
          })
        }
      >
        clear
      </button>
    ),
}));

let currentUserId: number | undefined = 99;
vi.mock('../../../services/Contexts/useAuthStore', () => ({
  default: (selector: (s: { user: { userId: number | undefined } }) => unknown) =>
    selector({ user: { userId: currentUserId } }),
}));

import { getUserById } from '../../../services/admin/users';
import EditUserModal from './EditUserModal';
import { createQueryWrapper } from '../../../test/queryWrapper';

const getUser = vi.mocked(getUserById);

const farmer = {
  userId: 5,
  name: 'Ana',
  email: 'ana@p.mx',
  roleId: 2,
  isActive: true,
  location: {
    stateName: 'Jalisco',
    municipalityName: 'Zapopan',
    localityName: 'Centro',
    propertyName: 'Predio 1',
    latitude: 20.6,
    longitude: -103.4,
  },
};

function setup(props: Partial<Parameters<typeof EditUserModal>[0]> = {}) {
  const onSave = vi.fn();
  const onClose = vi.fn();
  render(
    <EditUserModal userId={5} formError={null} isPending={false} onSave={onSave} onClose={onClose} {...props} />,
    { wrapper: createQueryWrapper() },
  );
  return { onSave, onClose };
}

beforeEach(() => {
  vi.clearAllMocks();
  currentUserId = 99;
});

describe('EditUserModal', () => {
  it('shows the loading state', () => {
    getUser.mockReturnValue(new Promise(() => {}) as never);
    setup();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('saves a farmer with a valid location', async () => {
    getUser.mockResolvedValue(farmer as never);
    const { onSave } = setup();
    await screen.findByDisplayValue('Ana');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][0]).toMatchObject({
      name: 'Ana',
      roleId: 2,
      location: expect.objectContaining({ stateName: 'Jalisco' }),
    });
  });

  it('blocks saving a non-admin without a complete location', async () => {
    getUser.mockResolvedValue(farmer as never);
    const { onSave } = setup();
    await screen.findByDisplayValue('Ana');
    fireEvent.click(screen.getByTestId('mock-clear-location'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(screen.getByText(/ubicación es obligatoria/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves an admin without requiring a location', async () => {
    getUser.mockResolvedValue({ ...farmer, roleId: 1, location: null } as never);
    const { onSave } = setup();
    await screen.findByDisplayValue('Ana');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][0]).toMatchObject({ roleId: 1 });
  });

  it('disables the role selector when editing yourself', async () => {
    currentUserId = 5; // same as userId -> isSelf
    getUser.mockResolvedValue({ ...farmer, roleId: 1, location: null } as never);
    setup();
    await screen.findByDisplayValue('Ana');
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('closes via cancel', async () => {
    getUser.mockResolvedValue(farmer as never);
    const { onClose } = setup();
    await screen.findByDisplayValue('Ana');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
