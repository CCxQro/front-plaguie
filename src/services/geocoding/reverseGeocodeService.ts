import { geocodingClient } from './geocodingClient';

/** Administrative levels resolved from a coordinate. Coordinates remain the
 *  precise locator; these names are a best-effort, human-readable label. */
export interface GeocodedLocation {
  stateName: string;
  municipalityName: string;
  localityName: string;
  displayName: string;
}

/** Subset of the Nominatim `address` object we care about (Mexico-oriented). */
interface NominatimAddress {
  state?: string;
  region?: string;
  county?: string;
  municipality?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  hamlet?: string;
}

interface NominatimReverseResponse {
  display_name?: string;
  address?: NominatimAddress;
  error?: string;
}

const firstDefined = (...values: Array<string | undefined>): string | undefined =>
  values.find((v) => v != null && v.trim() !== '');

/**
 * Reverse-geocode a coordinate into state / municipality / locality names.
 *
 * Fallback rule: when a level is missing we keep the closest available one
 * (a missing locality keeps the municipality or state; a missing state keeps the
 * municipality or locality) so the fields are never blank as long as the point
 * resolved to *something*. Precision always comes from the coordinates, not the
 * names.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
  const { data } = await geocodingClient.get<NominatimReverseResponse>('/reverse', {
    params: {
      lat,
      lon: lng,
      format: 'json',
      addressdetails: 1,
      zoom: 14,
      'accept-language': 'es',
    },
  });

  const address = data.address ?? {};

  const stateRaw = firstDefined(address.state, address.region);
  const municipalityRaw = firstDefined(
    address.county,
    address.municipality,
    address.city_district,
  );
  const localityRaw = firstDefined(
    address.city,
    address.town,
    address.village,
    address.suburb,
    address.neighbourhood,
    address.hamlet,
  );

  // Cascade so every field keeps the highest available level when its own is absent.
  const stateName = firstDefined(stateRaw, municipalityRaw, localityRaw) ?? '';
  const municipalityName = firstDefined(municipalityRaw, stateRaw, localityRaw) ?? '';
  const localityName = firstDefined(localityRaw, municipalityRaw, stateRaw) ?? '';

  return { stateName, municipalityName, localityName, displayName: data.display_name ?? '' };
}
