import { SidebarHeader } from './SidebarHeader';
import { SidebarIcon } from './SidebarIcons';
import type { SidebarItem } from './Sidebar';

export interface SidebarVerdeProps {
  appName: string;
  appSubtitle: string;
  roleLabel?: string;
  items: SidebarItem[];
  activeItemId: string;
  footerActionLabel: string;
  userName: string;
  userDetail: string;
  userInitials: string;
  onItemClick?: (itemId: string) => void;
  onFooterActionClick?: () => void;
  className?: string;
}

export function SidebarVerde({
  appName,
  appSubtitle,
  roleLabel,
  items,
  activeItemId,
  footerActionLabel,
  userName,
  userDetail,
  userInitials,
  onItemClick,
  onFooterActionClick,
  className,
}: SidebarVerdeProps) {
  return (
    <aside
      className={`relative flex h-screen w-64 flex-col overflow-hidden bg-[linear-gradient(180deg,#008236_0%,#016630_100%)] text-white${className ? ` ${className}` : ''}`}
      aria-label="Barra lateral"
    >
      <SidebarHeader
        variant="green"
        appName={appName}
        appSubtitle={appSubtitle}
        roleLabel={roleLabel}
      />

      <nav className="flex-1 space-y-1 px-4 pt-6" aria-label="Navegacion principal">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item.id)}
              className={`flex h-11 w-full items-center gap-3 rounded-[10px] pl-4 text-left transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-[#DCFCE7] hover:bg-white/10'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <SidebarIcon
                icon={item.icon}
                className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-[#DCFCE7]'}`}
              />
              <span className="text-[14px] font-medium leading-5 tracking-[-0.15px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto h-30.25 border-t border-[#00A63E] px-4 pb-4 pt-4.25">
        <div className="flex h-12 items-center gap-3 rounded-[10px]">
          <div className="grid h-10 w-10 place-content-center rounded-full bg-[#00A63E] text-[14px] font-medium leading-5 tracking-[-0.15px] text-white">
            {userInitials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium leading-3.75 text-white">
              {userName}
            </p>
            <p className="truncate text-[10px] font-medium leading-3 text-[#B9F8CF]">
              {userDetail}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onFooterActionClick}
          className="mt-3 flex h-9 w-full items-center gap-2 rounded-[10px] pl-4 text-left text-[#DCFCE7] hover:bg-white/10"
        >
          <SidebarIcon icon="salir" className="h-4 w-4" />
          <span className="text-[14px] font-medium leading-5 tracking-[-0.15px]">{footerActionLabel}</span>
        </button>
      </div>
    </aside>
  );
}
