import { useQueryClient } from '@tanstack/react-query';
import { useStatus } from '../hooks/useStatus';

function StatusDot({ up }: { up: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${up ? 'bg-[#00C950]' : 'bg-[#FB2C36]'}`}
      aria-hidden="true"
    />
  );
}

function StatusBadge({ up }: { up: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        up
          ? 'bg-[#DCFCE7] text-[#008236]'
          : 'bg-[#FEF2F2] text-[#C10007]'
      }`}
    >
      <StatusDot up={up} />
      {up ? 'Operacional' : 'Caído'}
    </span>
  );
}

function MetricRow({
  label,
  value,
  up,
}: {
  label: string;
  value: string;
  up: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
      <span className="text-sm font-medium text-[#45556C]">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-[#0F172B]">{value}</span>
        <StatusBadge up={up} />
      </div>
    </div>
  );
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function StatusPage() {
  const { data, isLoading, isError, dataUpdatedAt } = useStatus();
  const queryClient = useQueryClient();

  const allUp = data?.status === 'UP' && data?.database === 'UP';
  const lastChecked = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('es-MX', { hour12: false })
    : null;

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans"
      data-testid="status-page"
    >
      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-content-center rounded-xl bg-[#75C79E]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-5 text-[#0F172B]">Plaguie</h1>
              <p className="text-xs text-[#90A1B9]">Estado del sistema</p>
            </div>
          </div>

          {/* Overall indicator */}
          {!isLoading && !isError && data && (
            <StatusBadge up={allUp} />
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-8 text-center" data-testid="status-loading">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#75C79E]" />
              <p className="text-sm text-[#90A1B9]">Verificando estado…</p>
            </div>
          )}

          {isError && !isLoading && (
            <div
              className="flex flex-col items-center gap-3 py-8 text-center"
              data-testid="status-error"
            >
              <div className="grid h-12 w-12 place-content-center rounded-full bg-[#FEF2F2]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 4a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm1 11h-2v-2h2v2zm0-4h-2V7h2v4z" fill="#FB2C36" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172B]">No se pudo conectar con el servidor</p>
                <p className="mt-1 text-xs text-[#90A1B9]">Verifica que el backend esté en ejecución</p>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div data-testid="status-data">
              <MetricRow
                label="Backend"
                value={data.service}
                up={data.status === 'UP'}
              />
              <MetricRow
                label="Base de datos"
                value="MySQL"
                up={data.database === 'UP'}
              />
              <MetricRow
                label="Última verificación"
                value={formatTimestamp(data.timestamp)}
                up={allUp}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#F1F5F9] px-8 py-4">
          <p className="text-xs text-[#90A1B9]">
            {lastChecked ? `Actualizado a las ${lastChecked} · refresca cada 30 s` : 'Cargando…'}
          </p>
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['status'] })}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#75C79E] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6ab080] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-xs text-[#90A1B9]">
        <a href="/login" className="underline hover:text-[#62748E] transition">
          Ir al inicio de sesión
        </a>
      </p>
    </div>
  );
}
