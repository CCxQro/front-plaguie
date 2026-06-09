import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const authState: { user: { roleId: number } | null; isAuthenticated: boolean } = {
  user: null,
  isAuthenticated: false,
};
vi.mock('../../services/Contexts/useAuthStore', () => ({ default: () => authState }));

import ProtectedRoute from './ProtectedRoute';

function renderAt(allowedRoles: number[]) {
  return render(
    <MemoryRouter initialEntries={['/secure']}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/app" element={<div>app page</div>} />
        <Route
          path="/secure"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    authState.user = null;
    authState.isAuthenticated = false;
    renderAt([3]);
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('redirects authenticated users with the wrong role to their default route', () => {
    authState.user = { roleId: 1 };
    authState.isAuthenticated = true;
    renderAt([3]);
    expect(screen.getByText('app page')).toBeInTheDocument();
  });

  it('renders the children when the role is allowed', () => {
    authState.user = { roleId: 3 };
    authState.isAuthenticated = true;
    renderAt([3]);
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });
});
