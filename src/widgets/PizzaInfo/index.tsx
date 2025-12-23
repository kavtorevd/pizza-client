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
import getPizzaInfo from '@/shared/api/getPizzaInfo'

interface PizzaInfoProps {
  id: number;
}

export default function PizzaInfo({ id }: PizzaInfoProps) {
  const [pizza, setPizza] = useState<IPizza | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  
  const fetchFunc = async ()=>{
    const res: IPizza|string = await getPizzaInfo(id);
    if (typeof res !== 'string') setPizza(res)
  }

  useEffect(() => {
    fetchFunc()
    setIsLoading(false)
    
    const savedBasket = localStorage.getItem('basket')
    if (savedBasket) {
      const currentBasket: IPizza[] = JSON.parse(savedBasket)
      const existingPizza = currentBasket.find(item => item.id === id)
      if (existingPizza && existingPizza.amount) {
        setAmount(existingPizza.amount)
      }
    }
  }, [id])

  // Добавить в корзину
  const changeAmount = (newAmount: number) => {
    if (!pizza) return
    const savedBasket = localStorage.getItem('basket')
    const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : []
    const existingIndex = currentBasket.findIndex(item => item.id === pizza.id)
    
    if (existingIndex !== -1) {
      if (newAmount == 0){
          const updatedBasket = currentBasket.filter((p: IPizza) => p.id !== id);
          localStorage.setItem('basket', JSON.stringify(updatedBasket));
          setAmount(0);
          return;
      }
      else{
        currentBasket[existingIndex].amount = newAmount
      }
    } else {
      if (newAmount>0)
        currentBasket.push({
          ...pizza,
          amount: 1
        })
    }

    localStorage.setItem('basket', JSON.stringify(currentBasket))
    setAmount(newAmount);
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
          
          {pizza.ingredients&&<div className={styles.ingredients}>
            <h3>Состав</h3>
            <ul>
              {pizza.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient.name} {ingredient.amount}</li>
              ))}
            </ul>
          </div>}
          
          <div className={styles.quantityControl}>
            <div className={styles.quantityTitle}>Количество:</div>
            <div className={styles.quantityButtons}>
              <button 
                onClick={()=>changeAmount(amount-1)}
                className={styles.quantityButton}
                disabled={amount <= 0}
              >
                −
              </button>
              <span className={styles.quantity}>{amount}</span>
              <button 
                onClick={()=>changeAmount(amount+1)}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>
          </div>
          
          <div className={styles.actions}>
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