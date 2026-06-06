import { Outlet, useLocation } from 'react-router-dom';
import { SidebarClaro } from '../components/Sidebar/SidebarClaro';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import useAuthStore from '../services/Contexts/useAuthStore';

export default function SalesTechnicianLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  
  const userName = user?.name ?? 'Técnico';
  const userInitials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const pathParts = location.pathname.split('/');
  const activeItemId = pathParts[pathParts.length - 1] || 'inicio';

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarClaro
        appName="Plaguie"
        appSubtitle="Gestión de plagas"
        roleLabel="Técnico de Ventas"
        activeItemId={activeItemId}
        footerActionLabel="Cerrar sesión"
        onFooterActionClick={logout}
        userName={userName}
        userDetail={user?.email ?? 'tecnico@plaguie.com'}
        userInitials={userInitials}
      />

      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
