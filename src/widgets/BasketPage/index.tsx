'use client'
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import BasketCard from '@/shared/BasketCard';
import Loading from '@/shared/Loading';
import { ROUTING } from '@/shared/routing';
import GoTopButton from '@/shared/GoTopButton';
import cn from 'classnames';



export default function BasketPage() {
  const [basketList, setBasketList] = useState<IPizza[]>();
  const [total, setNewTotal] = useState(Number);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      try {
        const parsedBasket = JSON.parse(savedBasket);
        if (Array.isArray(parsedBasket) && parsedBasket.length > 0) {
          setBasketList(parsedBasket);
          changeTotal();
          return;
        }
      } catch (error) {
        console.error('Ошибка парсинга корзины:', error);
      }
    }
    setBasketList([]);
  }, []);

  
  const changeTotal = () => {
    let s = 0;
    const parsedBasket = JSON.parse(localStorage.getItem('basket')||'');
    parsedBasket.map((p:IPizza)=>{s+=(p.cost-(p.sale||0))*(p.amount||0)})
    setNewTotal(s);
  };
  
const removeItem = (pizzaId: number) => {
  const before = localStorage.getItem('basket');
  const parsedBefore = JSON.parse(before || '[]');
  const updatedBasket = parsedBefore.filter((p: IPizza) => p.id !== pizzaId);
  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  setBasketList(updatedBasket);
  changeTotal();
};

  const clearBasket = () => {
    localStorage.setItem('basket', JSON.stringify([]));
    setBasketList([]);
    changeTotal();
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        My Basket
      </h2>
      
      <Link className={styles.arrow} href={ROUTING.home.href}>
        <Arrow/>
      </Link>
      {(total>0)&&<h3  className={styles.totalLine}>Стоимость корзины: {total}р</h3>}
      {
      (basketList==undefined)? <div className={styles.loading}><Loading/></div>:
      basketList.length === 0 ? (
          <p className={styles.loading}>Ваша корзина пуста</p>
      ) : (
        <div className={cn(styles.menuLine, !open&&styles.menu__closed)}>
          <button className={styles.menu_button}
              onClick={()=>setOpen(!open)}><div>▼</div>
          </button>
          <ul className={styles.menu}>
            {basketList.map((pizza: IPizza, i) => (
              <li key={pizza.id} className={styles.locationItem} key={`bas-card${i}-${pizza.id}`}>
                <BasketCard 
                  currency='р' 
                  data={pizza}
                  changeTotal={changeTotal}
                  removeItem={removeItem}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button className={styles.linkButton}
              onClick={()=>clearBasket()}>
        Очистить
      </Button>
      {(total>0)&&<Link href={ROUTING.confirm_order.href} >
        <div className={styles.linkButton}>Apply</div>
      </Link>}
      <GoTopButton/>
    </div>
  );
}