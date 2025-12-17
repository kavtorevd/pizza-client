'use client'
import { useState } from 'react';
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
      // PERMISSION_DENIED
      alert('Вы отказали в доступе к геолокации. Выберите адрес на карте.');
    } else if (error.code === 2) {
      // POSITION_UNAVAILABLE
      alert('Не удалось определить местоположение. Проверьте подключение к интернету.');
    } else if (error.code === 3) {
      // TIMEOUT
      alert('Время ожидания определения местоположения истекло.');
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
    
    const matchedAddress = addresses.find(loc => 
      Math.abs(loc.lat - coords[0]) < 0.001 && 
      Math.abs(loc.lng - coords[1]) < 0.001
    );
    
    if (matchedAddress) {
      setSelectedLocation(matchedAddress);
    }
  };

  // Сохранить местоположение
  const saveLocation = () => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
      window.location.href = ROUTING.home.href || '/';
    } else if (selectedCoords) {
      localStorage.setItem('selectedLocation', JSON.stringify({
        address,
        lat: selectedCoords[0],
        lng: selectedCoords[1]
      }));
      window.location.href = ROUTING.home.href || '/';
    }
  };

  if (isLoading) return <div className={styles.loading}><Loading/></div>;

  return (
    <div className={styles.container}>
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
            <Button
              onClick={saveLocation}
              disabled={!selectedCoords}
              className={styles.saveButton}
            >
              Сохранить местоположение
            </Button>
            <Link href={ROUTING.select_location_page.href}>
              <div  className={styles.linkButton}>Назад</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}