import CategoryBadge from '../CategoryBadge/CategoryBadge';
import { DataTableActionIcon } from './DataTableIcons';

export type InventoryTableRowVariant = 'completa' | 'compacta';
export type InventoryCategoryTone = 'fungicidas' | 'insecticidas' | 'fertilizantes' | 'herbicidas';
export type InventoryStockState = 'ok' | 'bajo' | 'agotado';

export interface InventoryTableRowData {
  id: string;
  product: string;
  sku: string;
  category: string;
  categoryTone: InventoryCategoryTone;
  price: string;
  stock: number;
  stockMax: number;
  stockState: InventoryStockState;
  stockLabel?: string;
  imageUrl?: string;
}

export interface InventoryTableRowProps {
  row: InventoryTableRowData;
  variant?: InventoryTableRowVariant;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const STOCK_STYLES: Record<InventoryStockState, { bar: string; helper: string }> = {
  ok: { bar: 'bg-[#00C950]', helper: 'text-[#008236]' },
  bajo: { bar: 'bg-[#FF6900]', helper: 'text-[#F54900]' },
  agotado: { bar: 'bg-[#FB2C36]', helper: 'text-[#E7000B]' },
};

function ActionButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-content-center rounded-[10px] bg-transparent transition-colors hover:bg-[#F8FAFC]"
    >
      {children}
    </button>
  );
}

export function InventoryTableRow({ row, variant = 'completa', onView, onEdit, onDelete }: InventoryTableRowProps) {
  const stockStyles = STOCK_STYLES[row.stockState];
  const fillWidth = row.stockMax > 0 ? Math.max(0, Math.min(100, (row.stock / row.stockMax) * 100)) : 0;
  const compact = variant === 'compacta';

  return (
    <tr className={cx('border-b border-[#F1F5F9]', compact && 'h-18.5')} data-testid="inventory-table-row">
      {!compact ? (
        <td className="px-6 py-4 align-middle">
          <div className="grid h-12 w-12 place-content-center overflow-hidden rounded-[10px] bg-[#F1F5F9]">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.product} className="h-12 w-12 object-cover" />
            ) : (
              <span className="text-lg text-[#94A3B8]">📦</span>
            )}
          </div>
        </td>
      ) : null}

      <td className={cx('align-middle', compact ? 'px-6 py-4' : 'px-6 py-4')}>
        <p className="text-sm font-bold leading-5 text-[#0F172B]">{row.product}</p>
        <p className="text-xs leading-4 text-[#62748E]">SKU: {row.sku}</p>
      </td>

      <td className="px-6 py-4 align-middle">
        <CategoryBadge
          label={row.category}
          color={
            row.categoryTone === 'fungicidas'
              ? '#8200DB'
              : row.categoryTone === 'insecticidas'
                ? '#1447E6'
                : row.categoryTone === 'fertilizantes'
                  ? '#008236'
                  : '#CA3500'
          }
          width={compact ? 'w-auto' : 'w-auto'}
          height={compact ? 'h-5' : 'h-6'}
        />
      </td>

      <td className="px-6 py-4 align-middle text-sm font-bold leading-5 text-[#0F172B]">{row.price}</td>

      <td className={cx('px-6 py-4 align-middle', compact ? 'min-w-55' : '')}>
        <div className={cx('flex items-center gap-3', compact && 'flex-col items-start gap-1')}>
          <div className={cx('h-2 overflow-hidden rounded-full bg-[#F1F5F9]', compact ? 'w-28.75' : 'w-28.75')}>
            <div className={cx('h-2 rounded-full w-(--fill)', stockStyles.bar, `[--fill:${fillWidth}%]`)} />
          </div>
          <span className="text-sm font-bold leading-5 text-[#0F172B]">{row.stock}</span>
        </div>
        {row.stockLabel ? <p className={cx('mt-1 text-xs leading-4', stockStyles.helper)}>{row.stockLabel}</p> : null}
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex justify-end gap-2">
          <ActionButton onClick={() => onView?.(row.id)}>
            <DataTableActionIcon icon="ver" className="block h-4 w-4 text-[#475569]" />
          </ActionButton>
          <ActionButton onClick={() => onEdit?.(row.id)}>
            <DataTableActionIcon icon="editar" className="block h-4 w-4 text-[#475569]" />
          </ActionButton>
          <ActionButton onClick={() => onDelete?.(row.id)}>
            <DataTableActionIcon icon="eliminar" className="block h-4 w-4 text-[#475569]" />
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}
