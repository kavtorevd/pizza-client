'use client'
import {addresses} from '@/tmp/some_tmp_pizza';
import {ILocation} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';


export default function SelectLocationPage() {
 const address_list:ILocation[] = addresses;
const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [showNewLocation, setShowNewLocation] = useState(false)
  const [newLocation, setNewLocation] = useState('')

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      console.log('New location:', newLocation)
      setNewLocation('')
      setShowNewLocation(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        My Locations
      </h2>
      <Link className={styles.arrow} href={'/home'}>
        <Arrow/>
      </Link>
      <div className={styles.menu}>
       {address_list.map((location:ILocation, i) => (
          <label key={i} className={styles.locationItem}>
            <div className={styles.locationContent}>
              <span className={styles.locationName}>{location.name}</span>
              <span className={styles.locationAddress}>{location.address}</span>
            </div>
            <input
              type="radio"
              name="location"
              value={`location${i}`}
              checked={selectedLocation === `location${i}`}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={styles.radioInput}
            />
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
      ) : (
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
      )}
      </div>
      <Button href={'/home'} className={styles.sub_button}>Apply</Button>
    </div>
    
  )
}
