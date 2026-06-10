import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

const mockAuthLogin = vi.fn();
vi.mock('../../services/Contexts/useAuthStore', () => ({
  default: (selector: (s: { login: typeof mockAuthLogin }) => unknown) =>
    selector({ login: mockAuthLogin }),
}));

vi.mock('../../services/auth/login', () => ({ login: vi.fn() }));

import { login } from '../../services/auth/login';
import Login from './Login';

const mockedLogin = vi.mocked(login);

function fillCredentials(email = 'ana@plaguie.mx', password = 'secret123') {
  fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: password } });
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('Login', () => {
  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('does not call login when fields are empty', () => {
    render(<Login />);
    fireEvent.submit(screen.getByTestId('login-form'));
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('logs in, stores the session and navigates on success', async () => {
    mockedLogin.mockResolvedValueOnce({
      user: { userId: 1, name: 'Ana', roleId: 2 } as never,
      token: 'tok',
    });

    render(<Login />);
    fillCredentials();
    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(mockedLogin).toHaveBeenCalledWith('ana@plaguie.mx', 'secret123'));
    expect(mockAuthLogin).toHaveBeenCalledWith({ userId: 1, name: 'Ana', roleId: 2 }, 'tok');
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('shows a generic error message on failure', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('bad credentials'));
    render(<Login />);
    fillCredentials();
    fireEvent.submit(screen.getByTestId('login-form'));

    expect(await screen.findByTestId('login-error')).toHaveTextContent(/incorrectos/i);
  });

  it('shows the deactivated-account message', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('La cuenta de usuario está desactivada'));
    render(<Login />);
    fillCredentials();
    fireEvent.submit(screen.getByTestId('login-form'));

    expect(await screen.findByTestId('login-error')).toHaveTextContent(/desactivada/i);
  });

  it('shows the flash message from sessionStorage on mount', () => {
    sessionStorage.setItem('login-flash', 'Tu sesión ha finalizado.');
    render(<Login />);
    expect(screen.getByTestId('login-error')).toHaveTextContent('Tu sesión ha finalizado.');
    expect(sessionStorage.getItem('login-flash')).toBeNull();
  });

  it('toggles password visibility', () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
    fireEvent.click(passwordInput.parentElement!.querySelector('button')!);
    expect(passwordInput.type).toBe('text');
  });
});
