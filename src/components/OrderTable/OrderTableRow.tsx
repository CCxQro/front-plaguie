import CategoryBadge from '../CategoryBadge/CategoryBadge';
import { OrderTableIcon } from './OrderTableIcons';

export type OrderStatus = 'pendiente' | 'aceptado' | 'rechazado';

export interface OrderTableRowData {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: OrderStatus | string;
  showDecisionActions?: boolean;
}

export interface OrderTableRowProps {
  row: OrderTableRowData;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const STATUS_STYLES: Record<OrderStatus, { label: string; color: string }> = {
  pendiente: {
    label: 'Pendiente',
    color: '#B45309',
  },
  aceptado: {
    label: 'Aceptado',
    color: '#166534',
  },
  rechazado: {
    label: 'Rechazado',
    color: '#B91C1C',
  },
};

function normalizeStatus(status: string): OrderStatus {
  const value = status.trim().toLowerCase();

  if (value === 'aceptado') {
    return 'aceptado';
  }

  if (value === 'rechazado') {
    return 'rechazado';
  }

  return 'pendiente';
}

function IconButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-content-center rounded-lg bg-transparent transition-colors hover:bg-[#F8FAFC]"
    >
      {children}
    </button>
  );
}

function ToneButton({ onClick, tone, children }: { onClick?: () => void; tone: 'success' | 'danger'; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === 'success'
          ? 'grid h-8 w-8 place-content-center rounded-lg bg-[#DCFCE7]'
          : 'grid h-8 w-8 place-content-center rounded-lg bg-[#FEE2E2]'
      }
    >
      {children}
    </button>
  );
}

export function OrderTableRow({ row, onView, onApprove, onReject }: OrderTableRowProps) {
  const statusKey = normalizeStatus(row.status);
  const status = STATUS_STYLES[statusKey];
  const showDecisionActions = row.showDecisionActions ?? statusKey === 'pendiente';

  return (
    <tr className="border-t border-[#F1F5F9]">
      <td className="px-6 py-6.5 align-middle text-sm font-bold leading-5 text-[#75C79E]">{row.id}</td>
      <td className="px-6 py-6.5 align-middle text-sm font-normal leading-5 text-[#0F172A]">{row.customer}</td>
      <td className="px-6 py-6.5 align-middle text-sm font-normal leading-5 text-[#64748B]">{row.date}</td>
      <td className="px-6 py-6.5 align-middle text-sm font-semibold leading-5 text-[#0F172A]">{row.total}</td>

      <td className="px-6 py-6 align-middle">
        <CategoryBadge
          label={status.label}
          color={status.color}
          width="w-auto"
          height="h-6"
        />
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex items-center justify-end gap-3">
          <IconButton onClick={() => onView?.(row.id)}>
            <OrderTableIcon icon="ver" className="block text-[#94A3B8]" />
          </IconButton>

          {showDecisionActions ? (
            <>
              <ToneButton tone="success" onClick={() => onApprove?.(row.id)}>
                <OrderTableIcon icon="aprobar" className="block text-[#16A34A]" />
              </ToneButton>
              <ToneButton tone="danger" onClick={() => onReject?.(row.id)}>
                <OrderTableIcon icon="rechazar" className="block text-[#DC2626]" />
              </ToneButton>
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
}