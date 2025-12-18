'use client'
import { pizzas } from '@/tmp/some_tmp_pizza'
import { IPizza } from '@/shared/interfaces'
import styles from './styles.module.scss'
import Image from 'next/image'
import Imagetmp from "@@/images/image.png"
import Button from '@/shared/Button'
import { ROUTING } from '@/shared/routing'
import { useState, useEffect } from 'react'
import Loading from '@/shared/Loading'

interface PizzaInfoProps {
  id: number;
}

export default function PizzaInfo({ id }: PizzaInfoProps) {
  const [pizza, setPizza] = useState<IPizza | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1) // Добавляем состояние для количества в UI
  
  useEffect(() => {
    const foundPizza = pizzas.find(p => p.id === id)
    console.log('Найдена пицца:', foundPizza)
    setPizza(foundPizza || null)
    setIsLoading(false)
    
    // Проверяем, есть ли уже эта пицца в корзине
    const savedBasket = localStorage.getItem('basket')
    if (savedBasket) {
      const currentBasket: IPizza[] = JSON.parse(savedBasket)
      const existingPizza = currentBasket.find(item => item.id === id)
      if (existingPizza && existingPizza.amount) {
        setQuantity(existingPizza.amount)
      }
    }
  }, [id])

  // Добавить в корзину
  const handleAddToCart = () => {
    if (!pizza) return

    const savedBasket = localStorage.getItem('basket')
    const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : []
    
    const existingIndex = currentBasket.findIndex(item => item.id === pizza.id)
    
    if (existingIndex !== -1) {
      // Увеличиваем количество существующей пиццы
      currentBasket[existingIndex].amount = (currentBasket[existingIndex].amount || 0) + quantity
    } else {
      // Добавляем новую пиццу с указанным количеством
      currentBasket.push({
        ...pizza,
        amount: quantity
      })
    }
    
    localStorage.setItem('basket', JSON.stringify(currentBasket))
    alert(`Добавлено в корзину: ${pizza.name} x${quantity}`)
  }
  
  // Увеличить количество
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }
  
  // Уменьшить количество
  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  if (isLoading) return <div className={styles.loading}><Loading/></div>
  
  if (!pizza) return (
    <div className={styles.notFound}>
      <h2>Пицца не найдена</h2>
      <a href={ROUTING.home.href}>Вернуться в меню</a>
    </div>
  )
  
  // Проверяем, есть ли пицца в корзине
  const savedBasket = typeof window !== 'undefined' ? localStorage.getItem('basket') : null
  const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : []
  const pizzaInBasket = currentBasket.find(item => item.id === pizza.id)
  const basketQuantity = pizzaInBasket?.amount || 0

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <a href={ROUTING.home.href} className={styles.backLink}>← Назад к меню</a>
      </div>
      
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <Image
            src={pizza.image || Imagetmp.src}
            width={500}
            height={400}
            alt={pizza.name}
            className={styles.image}
          />
        </div>
        
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{pizza.name}</h1>
          
          <div className={styles.priceSection}>
            {pizza.sale ? (
              <>
                <div className={styles.oldPrice}>{pizza.cost} ₽</div>
                <div className={styles.currentPrice}>{pizza.sale} ₽</div>
              </>
            ) : (
              <div className={styles.price}>{pizza.cost} ₽</div>
            )}
          </div>
          
          <div className={styles.description}>
            <h3>Описание</h3>
            <p>{pizza.description || `Вкусная пицца ${pizza.name} с сочной начинкой и ароматным тестом.`}</p>
          </div>
          
          <div className={styles.ingredients}>
            <h3>Состав</h3>
            <ul>
              <li>Сыр моцарелла</li>
              <li>Томатный соус</li>
              <li>Специи</li>
              {pizza.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.quantityControl}>
            <div className={styles.quantityTitle}>Количество:</div>
            <div className={styles.quantityButtons}>
              <button 
                onClick={decreaseQuantity}
                className={styles.quantityButton}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Button 
              onClick={handleAddToCart}
              className={styles.addButton}
            >
              {basketQuantity > 0 ? `Добавить еще (${quantity} шт.)` : `Добавить в корзину (${quantity} шт.)`}
            </Button>
            
            <Button 
              href={ROUTING.home.href}
              className={styles.continueButton}
            >
              Продолжить покупки
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}