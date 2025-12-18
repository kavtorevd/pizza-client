'use client'
import {addresses} from '@/tmp/some_tmp_pizza';
import {ILocation, ILocationPrint} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import { ROUTING } from '@/shared/routing';

export default function SelectLocationPage() {
  const [address_list, setAddressList] = useState<ILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const savedLocations = localStorage.getItem('selectedLocations');
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        
        // Находим индекс выбранного адреса (selected: true)
        const selectedIndex = locations.findIndex((loc: any) => loc.selected === true);
        
        const formattedLocations: ILocation[] = locations.map((loc: any, index: number) => ({
          id: index + 1,
          address: loc.address,
          name: `Сохранённый адрес ${index + 1}`,
          lat: loc.lat,
          lng: loc.lng,
          deliveryTime: '30-40 мин',
          minOrder: 500
        }));
        
        setAddressList(formattedLocations);
        
        // Если есть выбранный адрес (selected: true), выбираем его
        if (selectedIndex !== -1) {
          setSelectedLocation(`location${selectedIndex}`);
          // Сохраняем выбранный адрес отдельно
          saveSelectedLocation(locations[selectedIndex]);
        } else if (formattedLocations.length > 0) {
          // Иначе выбираем первый
          setSelectedLocation(`location0`);
        }
      } catch (error) {
        console.error('Ошибка чтения сохраненных адресов:', error);
      }
    }
  }, []);

  // Функция для сохранения выбранного адреса отдельно
  const saveSelectedLocation = (locationData: any) => {
    localStorage.setItem('selectedLocation', JSON.stringify({
      address: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
      timestamp: locationData.timestamp || new Date().toISOString()
    }));
  };

  // Функция удаления адреса
  const handleDeleteAddress = (index: number) => {
    // Удаляем из состояния
    const updatedList = address_list.filter((_, i) => i !== index);
    setAddressList(updatedList);
    
    // Обновляем localStorage
    const savedLocations = localStorage.getItem('selectedLocations');
    if (savedLocations) {
      const locations = JSON.parse(savedLocations);
      
      // Удаляем адрес
      locations.splice(index, 1);
      
      // Если удалили выбранный адрес, выбираем первый из оставшихся
      if (locations.length > 0) {
        locations[0].selected = true;
        // Сохраняем новый выбранный
        saveSelectedLocation(locations[0]);
      } else {
        // Если список пуст, удаляем выбранный адрес
        localStorage.removeItem('selectedLocation');
      }
      
      localStorage.setItem('selectedLocations', JSON.stringify(locations));
    }
    
    // Обновляем выбор в UI
    if (selectedLocation === `location${index}`) {
      if (updatedList.length > 0) {
        setSelectedLocation(`location0`);
      } else {
        setSelectedLocation('');
      }
    }
  };

  // Функция выбора адреса (при клике на radio)
  const handleSelectAddress = (index: number) => {
    setSelectedLocation(`location${index}`);
    
    // Обновляем поле selected в localStorage
    const savedLocations = localStorage.getItem('selectedLocations');
    if (savedLocations) {
      const locations = JSON.parse(savedLocations);
      
      // Сбрасываем все selected: false
      locations.forEach((loc: any) => {
        loc.selected = false;
      });
      
      // Устанавливаем selected: true для выбранного
      if (locations[index]) {
        locations[index].selected = true;
        // ⭐ СОХРАНЯЕМ ВЫБРАННЫЙ АДРЕС ОТДЕЛЬНО ⭐
        saveSelectedLocation(locations[index]);
      }
      
      localStorage.setItem('selectedLocations', JSON.stringify(locations));
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setNewLocation('');
      setShowNewLocation(false);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        My Locations
      </h2>
      <Link className={styles.arrow} href={ROUTING.home.href}>
        <Arrow/>
      </Link>
      <div className={styles.menu}>
       {address_list.map((location: ILocation, i) => (
          <label key={i} className={styles.locationItem}>
            <div className={styles.locationContent}>
              <span className={styles.locationAddress}>{location.address}</span>
            </div>
            
            <div className={styles.locationActions}>
              <input
                type="radio"
                name="location"
                value={`location${i}`}
                checked={selectedLocation === `location${i}`}
                onChange={() => handleSelectAddress(i)}
                className={styles.radioInput}
              />
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(i);
                }}
                className={styles.deleteButton}
                title="Удалить адрес"
              >
                ×
              </button>
            </div>
          </label>
        ))}

        {!showNewLocation ? (
          <button 
            type="button"
            onClick={() => setShowNewLocation(true)}
            className={styles.addButton}
          >
            + Add New Location
          </button>
        ) : (<>
          <div className={styles.newLocationInput}>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location address"
              className={styles.textInput}
            />
            <button 
              type="button"
              onClick={handleAddLocation}
              className={styles.saveButton}
            >
              Save
            </button>
          </div>
          <Link href={ROUTING.select_location_map_page.href}>
            <div className={styles.linkButton}>Указать на карте</div>
          </Link>
        </>
      )}
      </div>
      <Link href={ROUTING.confirm_order.href}>
            <div className={styles.linkButton}>Apply</div>
      </Link>
    </div>
  )
}