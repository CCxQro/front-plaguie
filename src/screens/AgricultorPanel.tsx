import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../services/Contexts/useAuthStore';

const REDIRECT_SECONDS = 15;

function AgricultorPanel() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      logout();
      navigate('/login', { replace: true });
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [logout, navigate]);

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-sans px-4"
      data-testid="agricultor-panel"
    >
      <div className="max-w-md text-center space-y-5">
        <div className="w-16 h-16 mx-auto bg-[#DCFCE7] rounded-full flex items-center justify-center">
          <span className="text-3xl">🌱</span>
        </div>
        <h1 className="text-3xl font-bold text-[#101828]">
          Hola, {user?.name ?? 'Agricultor'}
        </h1>
        <p className="text-base text-[#4A5565]">
          Existe una versión móvil disponible para{' '}
          <span className="font-semibold">Agricultores</span>. Por favor
          descarga la aplicación para acceder a la gestión de cultivos y
          monitoreo de plagas.
        </p>
        <p className="text-sm text-[#6A7282]">
          Serás redirigido al inicio de sesión en{' '}
          <span className="font-semibold text-[#101828]">{secondsLeft}</span>{' '}
          {secondsLeft === 1 ? 'segundo' : 'segundos'}.
        </p>
      </div>
    </div>
  );
}

export default AgricultorPanel;
