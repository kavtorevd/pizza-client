'use client'
import {basket} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import BasketCard from '@/shared/BasketCard';
import Loading from '@/shared/Loading';
import { ROUTING } from '@/shared/routing';

export default function BasketPage() {
  const [basketList, setBasketList] = useState<IPizza[]>();

  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      try {
        const parsedBasket = JSON.parse(savedBasket);
        if (Array.isArray(parsedBasket) && parsedBasket.length > 0) {
          setBasketList(parsedBasket);
          return;
        }
      } catch (error) {
        console.error('Ошибка парсинга корзины:', error);
      }
    }
    
    const initialBasket = basket.map((item, i) => ({
      ...item,
      amount: item.amount || 1,
      id: i, 
    }));
    
    localStorage.setItem('basket', JSON.stringify(initialBasket));
    setBasketList(initialBasket);
  }, []);

  
  const changeAmount = (pizzaId: number, newAmount: number) => {
    const updatedBasket = basketList?.map(pizza => {
      if (pizza.id === pizzaId) {
        return { ...pizza, amount: newAmount };
      }
      return pizza;
    });
    
    setBasketList(updatedBasket);
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
  };
  
  const removeItem = (pizzaId: number) => {
    const updatedBasket = basketList?.filter(pizza => pizza.id !== pizzaId);
    setBasketList(updatedBasket);
    localStorage.setItem('basket', JSON.stringify(updatedBasket));
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        My Basket
      </h2>
      
      <Link className={styles.arrow} href={ROUTING.home.href}>
        <Arrow/>
      </Link>
      
      {
      (basketList==undefined)? <div className={styles.loading}><Loading/></div>:
      basketList.length === 0 ? (
          <p className={styles.loading}>Ваша корзина пуста</p>
      ) : (
        <ul className={styles.menu}>
          {basketList.map((pizza: IPizza, i) => (
            <li key={pizza.id} className={styles.locationItem} key={i}>
              <BasketCard 
                name={pizza.name} 
                cost={pizza.cost} 
                amount={pizza.amount || 1} 
                currency='р' 
                changeAmount={(newAmount) => changeAmount((pizza.id==undefined)? 0: pizza.id, newAmount)}
                removeItem={() => removeItem((pizza.id==undefined)? 0: pizza.id)}
              />
            </li>
          ))}
        </ul>
      )}
      <Link href={ROUTING.confirm_order.href}>
        <div className={styles.linkButton}>Apply</div>
      </Link>
    </div>
  );
}