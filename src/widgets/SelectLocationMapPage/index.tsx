'use client'
import { useState, useEffect } from 'react';
import { addresses } from '@/tmp/some_tmp_pizza';
import { ILocation } from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import { ROUTING } from '@/shared/routing';
import dynamic from 'next/dynamic';
import Loading from '@/shared/Loading';
import GeolocationPermission from '@/features/GeolocationPermission';

const LeafletMap = dynamic(() => import('@/entities/LeafletMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Загрузка карты...</div>
});

export default function SelectLocationMapPage() {
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGeoRequest, setShowGeoRequest] = useState(false);

  // При загрузке проверяем сохраненный адрес
  useEffect(() => {
    const savedLocations = localStorage.getItem('selectedLocations');
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        
        // Показываем последний выбранный
        if (locations.length > 0) {
          const lastLocation = locations[0];
          setSelectedCoords([lastLocation.lat, lastLocation.lng]);
          setAddress(lastLocation.address || '');
        }
      } catch (error) {
        console.error('Ошибка чтения сохраненных местоположений:', error);
      }
    }
  }, []);

  // Показать нашу модалку
  const requestGeolocation = () => {
    setShowGeoRequest(true);
  };

  // Успешное получение геолокации
  const handleGeolocationSuccess = (coords: [number, number]) => {
    setSelectedCoords(coords);
    reverseGeocode(coords[0], coords[1]);
  };

  // Ошибка геолокации
  const handleGeolocationError = (error: GeolocationPositionError) => {
    console.error('Ошибка геолокации:', error);
    if (error.code === 1) {
      alert('Вы отказали в доступе к геолокации. Выберите адрес на карте.');
    }
  };

  // Закрыть модалку
  const handleCloseModal = () => {
    setShowGeoRequest(false);
  };

  // Обратное геокодирование
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`Координаты: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
      setAddress(`Координаты: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  // Обработчик выбора на карте
  const handleLocationSelect = async (coords: [number, number], addr: string) => {
    setSelectedCoords(coords);
    setAddress(addr);
  };

  // Сохранить местоположение
const saveLocation = () => {
  if (!selectedCoords) {
    alert('Выберите местоположение на карте');
    return;
  }

  // Создаем новый объект с selected: true
  const newLocation = {
    address,
    lat: selectedCoords[0],
    lng: selectedCoords[1],
    timestamp: new Date().toISOString(),
    selected: true // ← добавляем поле selected
  };

  // Читаем существующий список
  const savedLocations = localStorage.getItem('selectedLocations');
  const locations = savedLocations ? JSON.parse(savedLocations) : [];
  
  // Убираем selected: true со всех старых записей
  const locationsWithoutSelected = locations.map((loc: any) => ({
    ...loc,
    selected: false
  }));
  
  // Добавляем новый в начало списка с selected: true
  const updatedLocations = [newLocation, ...locationsWithoutSelected];
  
  // Ограничиваем список
  if (updatedLocations.length > 10) {
    updatedLocations.pop();
  }

  // Сохраняем обратно в localStorage
  localStorage.setItem('selectedLocations', JSON.stringify(updatedLocations));
  localStorage.setItem('selectedLocation', JSON.stringify(newLocation));
};

  if (isLoading) return <div className={styles.loading}><Loading/></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={ROUTING.home.href || '/'} className={styles.backButton}>
          <Arrow className={styles.arrowIcon} />
          <span>Назад</span>
        </Link>
        <h1 className={styles.title}>Выберите местоположение</h1>
      </div>

      {/* Модалка запроса геолокации */}
      {showGeoRequest && (
        <GeolocationPermission
          onSuccess={handleGeolocationSuccess}
          onError={handleGeolocationError}
          onClose={handleCloseModal}
        />
      )}

      <div className={styles.content}> 
        <div className={styles.mapSection}>
          <div className={styles.mapWrapper}>
            <LeafletMap 
              onLocationSelect={handleLocationSelect}
              initialCoords={selectedCoords || [55.7558, 37.6173]}
            />
          </div>
          
          <Button 
            onClick={requestGeolocation}
            className={styles.currentLocationButton}
          >
            📍 Моё местоположение
          </Button>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.selectedAddress}>
            <h3>Выбранный адрес:</h3>
            <div className={styles.addressText}>
              {address || 'Кликните на карте для выбора'}
            </div>
          </div>

          <div className={styles.actions}>
            <Link 
              onClick={saveLocation}
              href={selectedCoords ? ROUTING.select_location_page.href : '#'}
            >
              <div className={styles.linkButton}>Сохранить местоположение</div>
            </Link>
             <Link href={ROUTING.select_location_page.href}>
              <div className={styles.linkButton}>Назад</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}