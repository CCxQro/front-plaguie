import { useEffect, useState } from 'react';

export interface RecordDetail {
  label: string;
  value: string | number | undefined;
}

export interface AdminValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  typeLabel: string;
  recordId: number;
  description?: string;
  details?: RecordDetail[];
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  isSubmitting?: boolean;
}

export function AdminValidationModal({
  isOpen,
  onClose,
  title,
  typeLabel,
  recordId,
  description,
  details,
  onAccept,
  onReject,
  isSubmitting = false,
}: AdminValidationModalProps) {
  const [show, setShow] = useState(false);

  // Animate in
  useEffect(() => {
    let frameId: number;
    if (isOpen) {
      frameId = requestAnimationFrame(() => setShow(true));
    } else {
      frameId = requestAnimationFrame(() => setShow(false));
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setShow(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      data-testid="admin-validation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative max-h-[92vh] w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl ring-1 ring-slate-900/10 transition-all duration-200 sm:my-8 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide text-slate-600 uppercase ring-1 ring-inset ring-slate-200">
                  {typeLabel} #{recordId}
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950">
                  Decisión de validación
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Revisa la evidencia del registro y elige si debe quedar aprobado o rechazado.
                </p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleClose}
                aria-label="Cerrar modal"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {/* Record summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414L14 3.586A2 2 0 0012.586 3H4Zm6.75 7.75a.75.75 0 00-1.5 0v2.69l-.72-.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l2-2a.75.75 0 10-1.06-1.06l-.72.72v-2.69Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-950">{title}</h3>
                  {description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  )}
                </div>
              </div>

              {/* Domain-specific detail rows */}
              {details && details.length > 0 && (
                <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  {details.map(
                    (d) =>
                      d.value !== undefined &&
                      d.value !== null &&
                      d.value !== '' && (
                        <div key={d.label} className="rounded-lg bg-slate-50 px-3 py-2.5">
                          <dt className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                            {d.label}
                          </dt>
                          <dd className="mt-1 text-sm font-semibold text-slate-950">{d.value}</dd>
                        </div>
                      )
                  )}
                </dl>
              )}
            </div>

            {/* Warning */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm leading-6 text-amber-900">
                La decisión cambia el estado visible del registro y agrega la auditoría del
                administrador que validó la solicitud.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <button
                data-testid="modal-accept-button"
                type="button"
                disabled={isSubmitting}
                onClick={onAccept}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Aprobar Registro
                  </>
                )}
              </button>
              <button
                data-testid="modal-reject-button"
                type="button"
                disabled={isSubmitting}
                onClick={onReject}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Rechazar Registro
                  </>
                )}
              </button>
              <button
                data-testid="modal-cancel-button"
                type="button"
                disabled={isSubmitting}
                onClick={handleClose}
                className="inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
