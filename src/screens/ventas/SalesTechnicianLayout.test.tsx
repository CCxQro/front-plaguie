import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockLogout = vi.fn();
vi.mock('../../services/Contexts/useAuthStore', () => ({
  default: () => ({ user: { name: 'Carlos Ruiz', email: 'carlos@plaguie.com' }, logout: mockLogout }),
}));

import SalesTechnicianLayout from './SalesTechnicianLayout';

beforeEach(() => vi.clearAllMocks());

describe('SalesTechnicianLayout', () => {
  it('renders the sales sidebar with the user name', () => {
    render(
      <MemoryRouter initialEntries={['/sales-technician/inicio']}>
        <SalesTechnicianLayout />
      </MemoryRouter>,
    );
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
  });
});
