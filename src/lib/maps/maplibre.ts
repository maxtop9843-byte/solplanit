import maplibregl, { type MapMouseEvent } from "maplibre-gl";
import type { GeoPoint, MapProvider } from "./types";

export const DEFAULT_SOLPLANIT_LOCATION: GeoPoint = {
  latitude: 36.5,
  longitude: 127.75,
};

export type MapSelectionOptions = {
  container: HTMLElement;
  initialPoint: GeoPoint;
  onChange(point: GeoPoint): void;
};

export type MapSelectionController = {
  setPoint(point: GeoPoint): void;
  destroy(): void;
};

export interface InteractiveMapProvider extends MapProvider {
  mount(options: MapSelectionOptions): MapSelectionController;
}

export function normalizePoint(point: GeoPoint): GeoPoint {
  return {
    latitude: Math.max(-90, Math.min(90, Number(point.latitude.toFixed(6)))),
    longitude: Math.max(-180, Math.min(180, Number(point.longitude.toFixed(6)))),
  };
}

export const mapLibreProvider: InteractiveMapProvider = {
  name: "maplibre",
  mount({ container, initialPoint, onChange }) {
    const point = normalizePoint(initialPoint);
    const map = new maplibregl.Map({
      container,
      style: "https://demotiles.maplibre.org/style.json",
      center: [point.longitude, point.latitude],
      zoom: 6,
      attributionControl: true,
    });
    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([point.longitude, point.latitude])
      .addTo(map);

    const publish = (longitude: number, latitude: number) => {
      const next = normalizePoint({ latitude, longitude });
      marker.setLngLat([next.longitude, next.latitude]);
      onChange(next);
    };

    const handleClick = (event: MapMouseEvent) => publish(event.lngLat.lng, event.lngLat.lat);
    map.on("click", handleClick);
    marker.on("dragend", () => {
      const next = marker.getLngLat();
      publish(next.lng, next.lat);
    });

    return {
      setPoint(nextPoint) {
        const next = normalizePoint(nextPoint);
        marker.setLngLat([next.longitude, next.latitude]);
        map.easeTo({ center: [next.longitude, next.latitude], duration: 250 });
      },
      destroy() {
        map.off("click", handleClick);
        marker.remove();
        map.remove();
      },
    };
  },
};
