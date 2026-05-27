import { useCallback, useState } from 'react';
import type { ToastMessage, ToastVariant } from '../components/Toast/Toast';

let toastCounter = 0;

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = `toast-${++toastCounter}-${Date.now()}`;
      setMessages((prev) => [...prev, { id, variant, title, description }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => addToast('success', title, description),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => addToast('error', title, description),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => addToast('info', title, description),
    [addToast]
  );

  return { messages, dismissToast, success, error, info };
}
