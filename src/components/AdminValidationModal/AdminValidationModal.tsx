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
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all duration-200 sm:my-8 sm:p-8 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {typeLabel} #{recordId}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900">
            Validar Registro
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Revisa la información del registro antes de aprobar o rechazar.
          </p>
        </div>

        {/* Record summary */}
        <div className="mb-6 rounded-xl bg-gray-50 p-5 ring-1 ring-inset ring-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
          )}

          {/* Domain-specific detail rows */}
          {details && details.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-200 pt-4">
              {details.map(
                (d) =>
                  d.value !== undefined &&
                  d.value !== null &&
                  d.value !== '' && (
                    <div key={d.label}>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {d.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-gray-900">{d.value}</dd>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-200">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-amber-800">
            Esta acción cambiará el estado del registro. Asegúrate de que la información
            es correcta y vigente antes de proceder.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            data-testid="modal-accept-button"
            type="button"
            disabled={isSubmitting}
            onClick={onAccept}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando…
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando…
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
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
