import React, { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import useAuthStore from '../services/Contexts/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { IngestionProgressEvent } from '../services/ingestion/ingestionService';

export const useIngestionProgress = (
  onSuccess?: (msg: string) => void,
  onError?: (msg: string) => void
) => {
  const [progressEvents, setProgressEvents] = useState<Record<string, IngestionProgressEvent>>({});
  const queryClient = useQueryClient();
  const onSuccessRef = React.useRef(onSuccess);
  const onErrorRef = React.useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
    const controller = new AbortController();

    const connectStream = async () => {
      try {
        await fetchEventSource(`${apiUrl}/api/ingestion/progress/stream`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          signal: controller.signal,
          onmessage(ev) {
            if (ev.data) {
              try {
                const data: IngestionProgressEvent = JSON.parse(ev.data);
                setProgressEvents((prev) => {
                  const newEvents = { ...prev, [data.filename]: data };
                  return newEvents;
                });
                if (data.status === 'DONE') {
                  if (onSuccessRef.current) onSuccessRef.current(`Archivo procesado: ${data.filename}`);
                  queryClient.invalidateQueries({ queryKey: ['ingestion-runs'] });
                } else if (data.status === 'FAILED') {
                  if (onErrorRef.current) onErrorRef.current(`Error al procesar: ${data.filename}`);
                  queryClient.invalidateQueries({ queryKey: ['ingestion-runs'] });
                }
              } catch (err) {
                console.error('Error parsing SSE message', err);
              }
            }
          },
          onclose() {
            // keep alive or reconnect logic if needed
          },
          onerror(err) {
            console.error('SSE Error:', err);
            // Wait 5s before reconnecting
            return 5000;
          },
        });
      } catch (err) {
        console.error('fetchEventSource Error:', err);
      }
    };

    connectStream();

    return () => {
      controller.abort();
    };
  }, [queryClient]);

  return progressEvents;
};
