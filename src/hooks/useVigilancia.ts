import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vigilanciaService,
  type CreateVigilanciaDto,
  type ValidateDto,
} from '../services/vigilancia/vigilanciaService';

const QUERY_KEY = 'vigilancia';

export function useVigilancias() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => vigilanciaService.getAll(),
  });
}

export function useVigilancia(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => vigilanciaService.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}

export function useCreateVigilancia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVigilanciaDto) => vigilanciaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteVigilancia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vigilanciaService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [QUERY_KEY, deletedId] });
    },
  });
}

export function useValidateVigilancia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ValidateDto }) =>
      vigilanciaService.validate(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.setQueryData([QUERY_KEY, id], data);
    },
  });
}
