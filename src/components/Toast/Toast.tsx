import { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
  duration?: number;
}

const ICON_MAP: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const STYLE_MAP: Record<ToastVariant, { container: string; icon: string }> = {
  success: {
    container: 'border-emerald-200 bg-emerald-50',
    icon: 'bg-emerald-500 text-white',
  },
  error: {
    container: 'border-red-200 bg-red-50',
    icon: 'bg-red-500 text-white',
  },
  info: {
    container: 'border-blue-200 bg-blue-50',
    icon: 'bg-blue-500 text-white',
  },
};

function ToastItem({ message, onDismiss, duration = 4000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    // schedule exit
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(message.id), 300);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [message.id, onDismiss, duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(message.id), 300);
  };

  const styles = STYLE_MAP[message.variant];

  return (
    <div
      data-testid="toast-message"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
        styles.container
      } ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-8 opacity-0'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles.icon}`}
      >
        {ICON_MAP[message.variant]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{message.title}</p>
        {message.description && (
          <p className="mt-0.5 text-xs text-gray-600">{message.description}</p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200/60 hover:text-gray-600"
        aria-label="Cerrar notificación"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ messages, onDismiss }: ToastContainerProps) {
  if (messages.length === 0) return null;

  return (
    <div
      data-testid="toast-container"
      className="pointer-events-none fixed right-4 bottom-4 z-[9999] flex flex-col gap-3"
    >
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
