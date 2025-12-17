'use client'
import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.module.scss';

interface LeafletMapProps {
  onLocationSelect: (coords: [number, number], address: string) => void;
  initialCoords?: [number, number];
}

export default function LeafletMap({ onLocationSelect, initialCoords }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Инициализация карты
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Создаем карту только один раз
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        initialCoords || [55.7558, 37.6173], 
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Обработчик клика
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const coords: [number, number] = [lat, lng];
      
      // Создаем или перемещаем маркер
      if (markerRef.current) {
        markerRef.current.setLatLng(coords);
      } else {
        markerRef.current = L.marker(coords, { 
          draggable: true,
          icon: L.divIcon({
            html: '<span style="font-size:2em">📍</span>',
            className: 'custom-marker', 
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })
        }).addTo(mapRef.current!);
        
        // Обработчик перетаскивания
        markerRef.current.on('dragend', (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onLocationSelect([position.lat, position.lng], 
            `Координаты: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
        });
      }
      
      // Вызываем колбэк
      onLocationSelect(coords, `Координаты: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    };

    mapRef.current.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, []); // Пустой массив - инициализация один раз

  // ОТДЕЛЬНЫЙ useEffect для обновления позиции карты и маркера
  useEffect(() => {
    if (!mapRef.current || !initialCoords) return;

    // Перемещаем центр карты
    mapRef.current.panTo(initialCoords);

    // Обновляем или создаем маркер
    if (markerRef.current) {
      markerRef.current.setLatLng(initialCoords);
    } else {
      markerRef.current = L.marker(initialCoords, { 
        draggable: true,
        icon: L.divIcon({
          html: '<span style="font-size:2em">📍</span>',
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      }).addTo(mapRef.current);
      
      // Обработчик перетаскивания
      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        onLocationSelect([position.lat, position.lng], 
          `Координаты: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
      });
    }
  }, [initialCoords, onLocationSelect]); // Срабатывает при изменении initialCoords

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
}