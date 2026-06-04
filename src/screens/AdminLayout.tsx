import { Link, Outlet, useLocation } from 'react-router-dom';
import { SidebarVerde } from '../components/Sidebar/SidebarVerde';
import useAuthStore from '../services/Contexts/useAuthStore';
import { getInitials } from '../utils/getInitials';
import type { SidebarItem } from '../components/Sidebar/Sidebar';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/app/dashboard' },
  { id: 'usuarios', label: 'Gestión de Usuarios', icon: 'usuarios', href: '/app/usuarios' },
  { id: 'inventario', label: 'Inventario Global', icon: 'cubo', href: '/app/inventario' },
  { id: 'validacion', label: 'Validación de Registros', icon: 'validacion', href: '/app/validacion' },
  { id: 'dashboards', label: 'Dashboards', icon: 'dashboards', href: '/app/dashboards' },
  { id: 'actualizaciones', label: 'Actualización de Datos', icon: 'informacion', href: '/app/actualizaciones' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const userName = user?.name ?? 'Admin Plaguie';
  const userInitials = getInitials(userName);

  const pathParts = location.pathname.split('/');
  const activeItemId = pathParts[pathParts.length - 1] || 'usuarios';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
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
        className="hidden shrink-0 lg:flex"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">Plaguie</p>
                <p className="text-xs text-slate-500">{userName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
            >
              Salir
            </button>
          </div>

          <nav className="mt-3 grid grid-cols-2 gap-2" aria-label="Navegacion principal movil">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <Link
                  key={item.id}
                  to={item.href ?? '#'}
                  className={`rounded-lg px-3 py-2 text-center text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
