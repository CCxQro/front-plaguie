import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addRegionInteres,
  deleteRegionInteres,
  getEarlyAlerts,
  getRegionesInteres,
  getStates,
} from '../services/regions/regionsService';

const REGIONES_KEY = ['regiones-interes'];
const ALERTS_KEY = ['regiones-interes', 'alertas'];
const STATES_KEY = ['states'];

/** Seller's configured regions of interest. */
export function useRegionesInteres() {
  return useQuery({
    queryKey: REGIONES_KEY,
    queryFn: getRegionesInteres,
    staleTime: 60 * 1000,
  });
}

/** State catalog for the selector (changes rarely). */
export function useStates() {
  return useQuery({
    queryKey: STATES_KEY,
    queryFn: getStates,
    staleTime: 30 * 60 * 1000,
  });
}

/** Early pest alerts in the seller's regions of interest. */
export function useEarlyAlerts() {
  return useQuery({
    queryKey: ALERTS_KEY,
    queryFn: getEarlyAlerts,
    staleTime: 60 * 1000,
  });
}

/** Add a region; invalidates regions + early alerts so both refresh. */
export function useAddRegionInteres() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stateId: number) => addRegionInteres(stateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REGIONES_KEY });
    },
  });
}

/** Remove a region; invalidates regions + early alerts so both refresh. */
export function useDeleteRegionInteres() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regionInteresId: number) => deleteRegionInteres(regionInteresId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REGIONES_KEY });
    },
  });
}
