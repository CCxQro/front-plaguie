import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../services/admin/users', () => ({
  getUserById: vi.fn(),
  approveFarmer: vi.fn(),
  rejectFarmer: vi.fn(),
}));

import { getUserById, approveFarmer, rejectFarmer } from '../../../services/admin/users';
import PendingFarmerDetailModal from './PendingFarmerDetailModal';
import { createQueryWrapper } from '../../../test/queryWrapper';

const getUser = vi.mocked(getUserById);
const approve = vi.mocked(approveFarmer);
const reject = vi.mocked(rejectFarmer);

const farmer = { farmerId: 10, statusName: 'Revisión', user: { userId: 5 } };

const detail = {
  userId: 5,
  name: 'Ana López',
  email: 'ana@plaguie.mx',
  isActive: true,
  roleId: 2,
  location: {
    stateName: 'Jalisco',
    municipalityName: 'Zapopan',
    localityName: 'Centro',
    propertyName: 'Predio 1',
    latitude: 20.6,
    longitude: -103.4,
  },
};

function setup() {
  const onClose = vi.fn();
  render(<PendingFarmerDetailModal farmer={farmer as never} onClose={onClose} />, {
    wrapper: createQueryWrapper(),
  });
  return { onClose };
}

beforeEach(() => vi.clearAllMocks());

describe('PendingFarmerDetailModal', () => {
  it('shows the loading state', () => {
    getUser.mockReturnValue(new Promise(() => {}) as never);
    setup();
    expect(screen.getByText(/Cargando información/i)).toBeInTheDocument();
  });

  it('renders the farmer detail with location', async () => {
    getUser.mockResolvedValue(detail as never);
    setup();
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText('ana@plaguie.mx')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Jalisco')).toBeInTheDocument();
    expect(screen.getByText('Revisión')).toBeInTheDocument();
  });

  it('shows the no-location message and inactive state', async () => {
    getUser.mockResolvedValue({ ...detail, isActive: false, location: null } as never);
    setup();
    await screen.findByText('Ana López');
    expect(screen.getByText(/Sin información de ubicación/i)).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('approves the farmer and closes', async () => {
    getUser.mockResolvedValue(detail as never);
    approve.mockResolvedValueOnce(undefined as never);
    const { onClose } = setup();
    await screen.findByText('Ana López');
    fireEvent.click(screen.getByTestId('detail-approve-button'));
    await waitFor(() => expect(approve).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('rejects the farmer and closes', async () => {
    getUser.mockResolvedValue(detail as never);
    reject.mockResolvedValueOnce(undefined as never);
    const { onClose } = setup();
    await screen.findByText('Ana López');
    fireEvent.click(screen.getByTestId('detail-reject-button'));
    await waitFor(() => expect(reject).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
