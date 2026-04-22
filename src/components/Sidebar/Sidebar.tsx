import { IconLogoCheck, IconLogoLeaf, SidebarIcon, type SidebarIconName } from './SidebarIcons';

export type SidebarVariant = 'claro' | 'verde';

export interface SidebarItem {
  id: string;
  label: string;
  icon: SidebarIconName;
}

export interface SidebarProps {
  variant: SidebarVariant;
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

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function Sidebar({
  variant,
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
}: SidebarProps) {
  const isGreen = variant === 'verde';

  return (
    <aside
      className={cx(
        'relative flex h-240 min-h-240 w-64 flex-col overflow-hidden',
        isGreen
          ? 'bg-[linear-gradient(180deg,#008236_0%,#016630_100%)] text-white'
          : 'border-r border-[#E2E8F0] bg-white text-[#475569]',
        className,
      )}
      aria-label="Barra lateral"
    >
      <div
        className={cx(
          'flex h-22 items-center gap-3 px-6',
          isGreen && 'h-23.25 border-b border-[#00A63E] pb-px',
        )}
      >
        <div
          className={cx(
            'grid h-10 w-10 place-content-center rounded-[10px]',
            isGreen ? 'bg-white/20 text-white' : 'rounded-lg bg-[#75C79E] text-white',
          )}
        >
          {isGreen ? <IconLogoCheck className="h-6 w-6" /> : <IconLogoLeaf className="h-4.25 w-4.25" />}
        </div>

        <div className="flex flex-col gap-1">
          <p
            className={cx(
              'leading-none',
              isGreen ? 'text-[18px] font-bold leading-7 tracking-[-0.439px]' : 'text-[20px] font-normal leading-5 tracking-[-0.5px]',
            )}
          >
            {appName}
          </p>
          <p className={cx('text-xs leading-4', isGreen ? 'text-[#B9F8CF]' : 'text-[#64748B]')}>
            {isGreen ? roleLabel || appSubtitle : appSubtitle}
          </p>
        </div>
      </div>

      <nav className={cx('flex-1 px-4', isGreen ? 'space-y-1 pt-6' : 'space-y-1 pt-5')} aria-label="Navegacion principal">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item.id)}
              className={cx(
                'flex w-full items-center gap-3 rounded-[10px] pl-4 text-left transition-colors',
                isGreen ? 'h-11' : 'h-10.25',
                isGreen
                  ? isActive
                    ? 'bg-white/20 text-white'
                    : 'text-[#DCFCE7] hover:bg-white/10'
                  : isActive
                    ? 'bg-[#75C79E1A] text-[#75C79E]'
                    : 'text-[#475569] hover:bg-slate-100',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <SidebarIcon
                icon={item.icon}
                className={cx('h-5 w-5 shrink-0', isGreen ? (isActive ? 'text-white' : 'text-[#DCFCE7]') : 'text-[#0A0A0A]')}
              />
              <span className={cx('text-[14px] leading-5', isGreen ? 'font-medium tracking-[-0.15px]' : 'font-normal')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div
        className={cx(
          'mt-auto border-t px-4',
          isGreen ? 'h-30.25 border-[#00A63E] pb-4 pt-4.25' : 'h-34.75 border-[#E2E8F0] pb-4 pt-4.25',
        )}
      >
        {!isGreen ? (
          <button
            type="button"
            onClick={onFooterActionClick}
            className="mb-4 flex h-10.25 w-full items-center gap-3 rounded-[10px] pl-3 text-left text-[#475569] hover:bg-slate-100"
          >
            <SidebarIcon icon="ajustes" className="h-5 w-5 text-[#0A0A0A]" />
            <span className="text-[14px] leading-5.25">{footerActionLabel}</span>
          </button>
        ) : null}

        <div className="flex h-12 items-center gap-3 rounded-[10px]">
          <div
            className={cx(
              'grid h-10 w-10 place-content-center rounded-full text-[14px] font-medium leading-5 tracking-[-0.15px]',
              isGreen ? 'bg-[#00A63E] text-white' : 'bg-[#E2E8F0] text-[#475569]',
            )}
          >
            {userInitials}
          </div>

          <div className="min-w-0">
            <p className={cx('truncate text-[12px] leading-3.75 font-medium', isGreen ? 'text-white' : 'text-[#0F172A]')}>
              {userName}
            </p>
            <p className={cx('truncate text-[10px] leading-3 font-medium', isGreen ? 'text-[#B9F8CF]' : 'text-[#64748B]')}>
              {userDetail}
            </p>
          </div>
        </div>

        {isGreen ? (
          <button
            type="button"
            onClick={onFooterActionClick}
            className="mt-3 flex h-9 w-full items-center gap-2 rounded-[10px] pl-4 text-left text-[#DCFCE7] hover:bg-white/10"
          >
            <SidebarIcon icon="salir" className="h-4 w-4" />
            <span className="text-[14px] font-medium leading-5 tracking-[-0.15px]">{footerActionLabel}</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}
