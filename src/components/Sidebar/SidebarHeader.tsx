import { IconLogoCheck, IconLogoLeaf } from './SidebarIcons';

export type SidebarHeaderVariant = 'normal' | 'green';

export interface SidebarHeaderProps {
  variant: SidebarHeaderVariant;
  appName: string;
  appSubtitle: string;
  roleLabel?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function SidebarHeader({ variant, appName, appSubtitle, roleLabel }: SidebarHeaderProps) {
  const isGreen = variant === 'green';

  return (
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
  );
}