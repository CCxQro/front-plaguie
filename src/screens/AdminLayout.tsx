import { Outlet, useLocation } from 'react-router-dom';
import { SidebarVerde } from '../components/Sidebar/SidebarVerde';
import useAuthStore from '../services/Contexts/useAuthStore';
import type { SidebarItem } from '../components/Sidebar/Sidebar';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/app/dashboard' },
  { id: 'usuarios', label: 'Gestión de Usuarios', icon: 'usuarios', href: '/app/usuarios' },
  { id: 'inventario', label: 'Inventario Global', icon: 'cubo', href: '/app/inventario' },
  { id: 'validacion', label: 'Validación de Registros', icon: 'validacion', href: '/app/validacion' },
  { id: 'dashboards', label: 'Dashboards', icon: 'dashboards', href: '/app/dashboards' },
];

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AP';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const userName = user?.name ?? 'Admin Plaguie';
  const userInitials = getInitials(userName);

  const pathParts = location.pathname.split('/');
  const activeItemId = pathParts[pathParts.length - 1] || 'usuarios';

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarVerde
        appName="Plaguie"
        appSubtitle="Gestión de plagas"
        roleLabel="Administrador"
        items={SIDEBAR_ITEMS}
        activeItemId={activeItemId}
        footerActionLabel="Cerrar sesión"
        onFooterActionClick={logout}
        userName={userName}
        userDetail={user?.email ?? 'admin@plaguie.com'}
        userInitials={userInitials}
      />

      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        <Outlet />
      </div>
    </div>
  );
}
