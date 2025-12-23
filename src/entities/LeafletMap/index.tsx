'use client'
import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.module.scss';

interface LeafletMapProps {
  onLocationSelect?: (coords: [number, number], address: string) => void;
  initialCoords?: [number, number];
  trackingMode?: boolean;
  courierCoords?: [number, number] | null;
  deliveryCoords?: [number, number] | null;
  routeCoordinates?: [number, number][];
  deliveryAddress?: string;
}

export default function LeafletMap({ 
  onLocationSelect, 
  initialCoords = [55.7558, 37.6173],
  trackingMode = false,
  courierCoords = null,
  deliveryCoords = null,
  routeCoordinates = [],
  deliveryAddress = '',
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Рефы для отслеживания курьера
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const deliveryMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

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
    return `Координаты: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Создаем пользовательские иконки
  const customIcon = useRef(L.divIcon({
    html: '<span style="font-size:2em">📍</span>',
    className: 'custom-marker', 
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })).current;

  const courierIcon = useRef(L.divIcon({
    html: `
      <div style="
        background-color: #0070f3;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-size: 20px;
      ">
        🚗
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })).current;

  const deliveryIcon = useRef(L.divIcon({
    html: `
      <div style="
        background-color: #2ecc71;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-size: 18px;
      ">
        📍
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })).current;

  // Инициализация карты
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Создаем карту только один раз
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        attributionControl: false
      }).setView(
        initialCoords, 
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Обработчик клика только если не в режиме отслеживания
    if (!trackingMode && onLocationSelect) {
      const handleMapClick = async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const coords: [number, number] = [lat, lng];
        
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
        
        onLocationSelect(coords, address);
      };

      mapRef.current.on('click', handleMapClick);
    }

    return () => {
      if (mapRef.current && !trackingMode && onLocationSelect) {
        mapRef.current.off('click');
      }
    };
  }, []);

  // ОБНОВЛЕНИЕ: Обработка изменений пропсов
  useEffect(() => {
    if (!mapRef.current) return;

    // Очищаем все маркеры и линии
    if (courierMarkerRef.current) {
      courierMarkerRef.current.remove();
      courierMarkerRef.current = null;
    }
    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.remove();
      deliveryMarkerRef.current = null;
    }
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    if (markerRef.current && trackingMode) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Если режим отслеживания
    if (trackingMode) {
      const allCoords: [number, number][] = [];

      // Добавляем маркер курьера
      if (courierCoords) {
        courierMarkerRef.current = L.marker(courierCoords, {
          icon: courierIcon,
          zIndexOffset: 1000
        })
        .addTo(mapRef.current)
        .bindTooltip('Курьер', { permanent: false, direction: 'top' });
        allCoords.push(courierCoords);
      }

      // Добавляем маркер доставки
      if (deliveryCoords) {
        deliveryMarkerRef.current = L.marker(deliveryCoords, {
          icon: deliveryIcon,
          zIndexOffset: 900
        })
        .addTo(mapRef.current)
        .bindTooltip(deliveryAddress || 'Точка доставки', { 
          permanent: false, 
          direction: 'top' 
        });
        allCoords.push(deliveryCoords);
      }

      // Добавляем линию маршрута
      if (routeCoordinates && routeCoordinates.length > 0) {
        routeLineRef.current = L.polyline(routeCoordinates, {
          color: '#0070f3',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
        }).addTo(mapRef.current);
        allCoords.push(...routeCoordinates);
      }

      // Центрируем карту на всех точках
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (initialCoords) {
        mapRef.current.setView(initialCoords, 13);
      }
    } else {
      // Обычный режим (выбор местоположения)
      if (initialCoords) {
        mapRef.current.setView(initialCoords, 13);
        
        if (onLocationSelect) {
          if (markerRef.current) {
            markerRef.current.setLatLng(initialCoords);
          } else {
            markerRef.current = L.marker(initialCoords, { 
              draggable: true,
              icon: customIcon
            }).addTo(mapRef.current);
            
            markerRef.current.on('dragend', async (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              const address = await reverseGeocode(position.lat, position.lng);
              onLocationSelect([position.lat, position.lng], address);
            });
            
            reverseGeocode(initialCoords[0], initialCoords[1])
              .then(address => {
                onLocationSelect(initialCoords, address);
              });
          }
        }
      }
    }
  }, [
    initialCoords, 
    trackingMode, 
    courierCoords, 
    deliveryCoords, 
    routeCoordinates, 
    deliveryAddress,
    onLocationSelect
  ]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
}