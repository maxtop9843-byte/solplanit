"use client";

import { useEffect, useRef } from "react";
import type { GeoPoint } from "../lib/maps/types";
import {
  DEFAULT_SOLPLANIT_LOCATION,
  mapLibreProvider,
  normalizePoint,
  type MapSelectionController,
} from "../lib/maps/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./MapLocationPicker.module.css";

type Props = {
  value: GeoPoint;
  onChange(point: GeoPoint): void;
};

export { DEFAULT_SOLPLANIT_LOCATION };

export default function MapLocationPicker({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MapSelectionController | null>(null);
  const initialPointRef = useRef(value);

  useEffect(() => {
    if (!containerRef.current) return;
    controllerRef.current = mapLibreProvider.mount({
      container: containerRef.current,
      initialPoint: initialPointRef.current,
      onChange,
    });
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [onChange]);

  const updateCoordinate = (key: keyof GeoPoint, raw: string) => {
    const number = Number(raw);
    if (!Number.isFinite(number)) return;
    const next = normalizePoint({ ...value, [key]: number });
    onChange(next);
    controllerRef.current?.setPoint(next);
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.map}
        role="application"
        tabIndex={0}
        aria-label="태양광 설치 위치 지도. 지도를 클릭하거나 마커를 움직여 위치를 선택하세요."
      />
      <p className={styles.help}>지도를 클릭하거나 마커를 움직이세요. 주소 검색 없이도 좌표로 분석할 수 있어요.</p>
      <div className={styles.coordinates}>
        <label>
          <span>위도</span>
          <input aria-label="위도" type="number" min="-90" max="90" step="0.000001" value={value.latitude} onChange={(event) => updateCoordinate("latitude", event.target.value)} />
        </label>
        <label>
          <span>경도</span>
          <input aria-label="경도" type="number" min="-180" max="180" step="0.000001" value={value.longitude} onChange={(event) => updateCoordinate("longitude", event.target.value)} />
        </label>
      </div>
    </div>
  );
}
