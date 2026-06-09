import { useMutation } from '@tanstack/react-query';
import { reverseGeocode } from '../services/geocoding/reverseGeocodeService';

/** Reverse-geocode a clicked/dragged coordinate into admin-level names.
 *  Modelled as a mutation: it is an imperative, user-triggered action, not
 *  cached server state. */
export function useReverseGeocode() {
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => reverseGeocode(lat, lng),
  });
}
