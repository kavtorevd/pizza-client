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

  // Функция для получения адреса по координатам
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
    }
    // Если не получилось получить адрес, возвращаем координаты
    return `Координаты: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Создаем пользовательскую иконку один раз (оптимизация)
  const customIcon = useRef(L.divIcon({
    html: '<span style="font-size:2em">📍</span>',
    className: 'custom-marker', 
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })).current;

  // Инициализация карты
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Создаем карту только один раз
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        attributionControl: false // ← ВОТ ИСПРАВЛЕНИЕ: убираем флаг
      }).setView(
        initialCoords || [55.7558, 37.6173], 
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Обработчик клика
    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const coords: [number, number] = [lat, lng];
      
      // Получаем адрес по координатам
      const address = await reverseGeocode(lat, lng);
      
      // Создаем или перемещаем маркер
      if (markerRef.current) {
        markerRef.current.setLatLng(coords);
      } else {
        markerRef.current = L.marker(coords, { 
          draggable: true,
          icon: customIcon
        }).addTo(mapRef.current!);
        
        // Обработчик перетаскивания
        markerRef.current.on('dragend', async (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          const address = await reverseGeocode(position.lat, position.lng);
          onLocationSelect([position.lat, position.lng], address);
        });
      }
      
      // Вызываем колбэк с адресом
      onLocationSelect(coords, address);
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
        icon: customIcon
      }).addTo(mapRef.current);
      
      // Обработчик перетаскивания
      markerRef.current.on('dragend', async (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        const address = await reverseGeocode(position.lat, position.lng);
        onLocationSelect([position.lat, position.lng], address);
      });
      
      // При создании маркера с initialCoords тоже получаем адрес
      reverseGeocode(initialCoords[0], initialCoords[1])
        .then(address => {
          onLocationSelect(initialCoords, address);
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