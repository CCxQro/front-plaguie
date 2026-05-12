import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  recomendacionesService,
  type CreateRecomendacionDto,
} from '../services/recomendaciones/recomendacionesService';
import type { ValidateDto } from '../services/vigilancia/vigilanciaService';

const QUERY_KEY = 'recomendaciones';

export function useRecomendaciones() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => recomendacionesService.getAll(),
  });
}

export function useRecomendacion(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => recomendacionesService.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}

export function useCreateRecomendacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecomendacionDto) => recomendacionesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteRecomendacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recomendacionesService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [QUERY_KEY, deletedId] });
    },
  });
}

export function useValidateRecomendacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ValidateDto }) =>
      recomendacionesService.validate(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
}
