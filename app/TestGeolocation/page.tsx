'use client'
import { useState } from 'react'

export default function TestGeolocation() {
  const [result, setResult] = useState('')

  const testGeolocation = () => {
    if (!navigator.geolocation) {
      setResult('Геолокация не поддерживается')
      return
    }
    
    setResult('Запрашиваю геолокацию...')
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setResult(`Успех! Широта: ${pos.coords.latitude}, Долгота: ${pos.coords.longitude}`)
      },
      (error) => {
        setResult(`Ошибка: код ${error.code} - ${error.message}`)
      }
    )
  }

  return (
    <div>
      <button onClick={testGeolocation}>Тест геолокации</button>
      <div>{result}</div>
    </div>
  )
}