import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertasService, type CreateAlertaDto } from '../services/alertas/alertasService';
import type { ValidateDto } from '../services/vigilancia/vigilanciaService';

const QUERY_KEY = 'alertas';

export function useAlertas() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => alertasService.getAll(),
  });
}

export function useAlerta(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => alertasService.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}

export function useCreateAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAlertaDto) => alertasService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => alertasService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [QUERY_KEY, deletedId] });
    },
  });
}

export function useValidateAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ValidateDto }) =>
      alertasService.validate(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
}
