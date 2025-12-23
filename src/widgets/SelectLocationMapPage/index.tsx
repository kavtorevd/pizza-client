'use client'
import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import { ROUTING } from '@/shared/routing';
import dynamic from 'next/dynamic';
import Loading from '@/shared/Loading';

const LeafletMap = dynamic(() => import('@/entities/LeafletMap'), {
  ssr: false,
  loading: () =>  <div className={styles.loading}><Loading/></div>
});

export default function SelectLocationMapPage() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isGeoRequesting, setIsGeoRequesting] = useState(false);

  useEffect(() => {
    const savedLocations = localStorage.getItem('selectedLocations');
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        
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
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }
    
    setIsGeoRequesting(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ];
        setSelectedCoords(coords);
        reverseGeocode(coords[0], coords[1]);
        setIsGeoRequesting(false);
      },
      (error) => {
        setIsGeoRequesting(false);
        console.error('Ошибка геолокации:', error);
        if (error.code === 1) {
          alert('Вы отказали в доступе к геолокации. Выберите адрес на карте.');
        }
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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


const saveLocation = () => {
  if (!selectedCoords) {
    alert('Выберите местоположение на карте');
    return;
  }

  if (!address || address === 'Кликните на карте для выбора' || address.startsWith('Координаты:')) {
    alert('Укажите корректный адрес');
    return;
  }

  const cleanAddress = address.trim().toLowerCase();
  const savedLocations = localStorage.getItem('selectedLocations');
  const locations = savedLocations ? JSON.parse(savedLocations) : [];

  const existingLocation = locations.find((loc: any) => 
    loc.address.trim().toLowerCase() === cleanAddress
  );

  if (existingLocation) {
    const updatedLocations = locations.map((loc: any) => ({
      ...loc,
      selected: loc.address.trim().toLowerCase() === cleanAddress
    }));
    
    localStorage.setItem('selectedLocations', JSON.stringify(updatedLocations));
    localStorage.setItem('selectedLocation', JSON.stringify(existingLocation));
    
    alert('Этот адрес уже существует. Сделали его активным!');
    return;
  }

  const newLocation = {
    address: address.trim(),
    lat: selectedCoords[0],
    lng: selectedCoords[1],
    timestamp: new Date().toISOString(),
    selected: true
  };

  const locationsWithoutSelected = locations.map((loc: any) => ({
    ...loc,
    selected: false
  }));
  const updatedLocations = [newLocation, ...locationsWithoutSelected];
  

  if (updatedLocations.length > 10) {
    updatedLocations.pop();
  }


    localStorage.setItem('selectedLocations', JSON.stringify(updatedLocations));
    localStorage.setItem('selectedLocation', JSON.stringify(newLocation));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={ROUTING.home.href || '/'} className={styles.backButton}>
          <Arrow className={styles.arrowIcon} />
          <span>Назад</span>
        </Link>
        <h1 className={styles.title}>Выберите местоположение</h1>
      </div>

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
            disabled={isGeoRequesting}
          >
            {isGeoRequesting ? 'Определяем...' : '📍 Моё местоположение'}
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