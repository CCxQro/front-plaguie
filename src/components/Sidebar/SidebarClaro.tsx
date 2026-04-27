import { Link } from 'react-router-dom';
import { SidebarHeader } from './SidebarHeader';
import { SidebarIcon } from './SidebarIcons';
import type { SidebarItem } from './Sidebar';

export interface SidebarClaroProps {
  appName: string;
  appSubtitle: string;
  roleLabel?: string;
  items?: SidebarItem[];
  activeItemId: string;
  footerActionLabel: string;
  userName: string;
  userDetail: string;
  userInitials: string;
  onItemClick?: (itemId: string) => void;
  onFooterActionClick?: () => void;
  className?: string;
}

export const DEFAULT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'inicio', label: 'Inicio', icon: 'dashboard', href: '/sales-technician/inicio' },
  { id: 'ventas', label: 'Ventas', icon: 'inventario', href: '/sales-technician/ventas' },
  { id: 'clientes', label: 'Clientes', icon: 'clientes', href: '/sales-technician/clientes' },
  { id: 'productos', label: 'Productos', icon: 'cubo', href: '/sales-technician/productos' },
  { id: 'reportes', label: 'Reportes', icon: 'dashboards', href: '/sales-technician/reportes' },
];

export function SidebarClaro({
  appName,
  appSubtitle,
  roleLabel,
  items = DEFAULT_SIDEBAR_ITEMS,
  activeItemId,
  footerActionLabel,
  userName,
  userDetail,
  userInitials,
  onItemClick,
  onFooterActionClick,
  className,
}: SidebarClaroProps) {
  return (
    <aside
      className={`relative flex h-screen w-1/6 flex-col overflow-hidden border-r border-[#E2E8F0] bg-white text-[#475569]${className ? ` ${className}` : ''}`}
      aria-label="Barra lateral"
    >
      <SidebarHeader
        variant="normal"
        appName={appName}
        appSubtitle={appSubtitle}
        roleLabel={roleLabel}
      />

      <nav className="flex-1 space-y-1 px-4 pt-5" aria-label="Navegacion principal">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          const isLink = !!item.href;
          const Component = isLink ? Link : 'button';
          return (
            <Component
              key={item.id}
              to={item.href as string}
              type={isLink ? undefined : "button"}
              onClick={() => onItemClick?.(item.id)}
              className={`flex w-full items-center gap-3 rounded-[10px] pl-4 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-[#75C79E1A] text-[#75C79E]'
                  : 'text-[#475569] hover:bg-slate-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <SidebarIcon icon={item.icon} className="h-5 w-5 shrink-0 text-[#0A0A0A]" />
              <span className="text-[14px] font-normal leading-5">
                {item.label}
              </span>
            </Component>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#E2E8F0] px-4 pb-4 pt-4.25">
        <button
          type="button"
          onClick={onFooterActionClick}
          className="mb-4 flex w-full items-center gap-3 rounded-[10px] pl-3 py-2.5 text-left text-[#475569] hover:bg-slate-100"
        >
          <SidebarIcon icon="ajustes" className="h-5 w-5 text-[#0A0A0A]" />
          <span className="text-[14px] leading-5.25">{footerActionLabel}</span>
        </button>

        <div className="flex items-center gap-3 rounded-[10px] py-1">
          <div className="grid h-10 w-10 place-content-center rounded-full bg-[#E2E8F0] text-[14px] font-medium leading-5 tracking-[-0.15px] text-[#475569]">
            {userInitials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium leading-3.75 text-[#0F172A]">
              {userName}
            </p>
            <p className="truncate text-[10px] font-medium leading-3 text-[#64748B]">
              {userDetail}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
