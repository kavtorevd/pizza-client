'use client'
import { useState, useEffect } from 'react'
import styles from './styles.module.scss'

interface GeolocationPermissionProps {
  onSuccess: (coords: [number, number]) => void
  onError: (error: GeolocationPositionError) => void
  onClose: () => void
}

export default function GeolocationPermission({ onSuccess, onError, onClose }: GeolocationPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  // Проверяем состояние разрешения при загрузке
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state)
          
          // Если разрешение уже дано, сразу запрашиваем геолокацию
          if (permissionStatus.state === 'granted') {
            requestGeolocation()
          }
          
          // Слушаем изменения разрешения
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state)
          }
        })
        .catch(() => {
          // Если API permissions не поддерживается
          setPermissionState('prompt')
        })
    }
  }, [])

  // Функция запроса геолокации
  const requestGeolocation = () => {
    setIsRequesting(true)
    
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером')
      onClose()
      setIsRequesting(false)
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onSuccess([latitude, longitude])
        onClose()
        setIsRequesting(false)
      },
      (error) => {
        onError(error)
        onClose()
        setIsRequesting(false)
      },
      options 
    )
  }

  const handleAllow = () => {
    // Если разрешение уже есть, сразу запрашиваем геолокацию
    if (permissionState === 'granted') {
      requestGeolocation()
    } else {
      // Иначе показываем браузерный запрос
      requestGeolocation()
    }
  }

  const handleDeny = () => {
    onClose()
    const error = {
      code: 1,
      message: 'Пользователь отказал в доступе',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    } as GeolocationPositionError
    
    onError(error)
  }

  // Если разрешение уже дано, показываем другой текст
  const getModalText = () => {
    if (permissionState === 'granted') {
      return 'Определяем ваше местоположение...'
    }
    return 'Для определения вашего местоположения, пожалуйста, разрешите доступ к геолокации'
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Доступ к геолокации</h3>
        <p className={styles.text}>
          {getModalText()}
        </p>
        
        {permissionState === 'granted' ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Определяем ваше местоположение...</p>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button 
              onClick={handleAllow}
              className={styles.allowButton}
              disabled={isRequesting}
            >
              {isRequesting ? 'Запрос...' : 'Разрешить'}
            </button>
            <button 
              onClick={handleDeny}
              className={styles.denyButton}
              disabled={isRequesting}
            >
              Отклонить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}