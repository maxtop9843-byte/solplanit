export type MapProviderName = "maplibre" | "kakao" | "naver";

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type GeocodedLocation = GeoPoint & {
  address?: string;
  label?: string;
};

export interface MapProvider {
  readonly name: MapProviderName;
}

export interface Geocoder {
  search(query: string): Promise<GeocodedLocation[]>;
  reverse(point: GeoPoint): Promise<GeocodedLocation | null>;
}
