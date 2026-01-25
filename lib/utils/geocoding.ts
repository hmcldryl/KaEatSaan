const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  shortAddress: string;
}

/**
 * Search for locations by query string
 * Rate limit: 1 request per second
 */
export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: 'ph', // Focus on Philippines
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': 'KaEatSaan/1.0 (https://kaetsaan.app)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search location');
    }

    const results: NominatimResult[] = await response.json();

    return results.map((result) => ({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      shortAddress: formatShortAddress(result),
    }));
  } catch (error) {
    console.error('Geocoding search error:', error);
    return [];
  }
}

/**
 * Get address from coordinates (reverse geocoding)
 * Rate limit: 1 request per second
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
      headers: {
        'User-Agent': 'KaEatSaan/1.0 (https://kaetsaan.app)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const result: NominatimResult = await response.json();

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      shortAddress: formatShortAddress(result),
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

function formatShortAddress(result: NominatimResult): string {
  const address = result.address;
  if (!address) {
    return result.display_name.split(',').slice(0, 3).join(', ');
  }

  const parts: string[] = [];

  if (address.road) {
    parts.push(address.road);
  }

  if (address.suburb) {
    parts.push(address.suburb);
  } else if (address.municipality) {
    parts.push(address.municipality);
  }

  if (address.city) {
    parts.push(address.city);
  }

  return parts.slice(0, 3).join(', ') || result.display_name.split(',').slice(0, 3).join(', ');
}
