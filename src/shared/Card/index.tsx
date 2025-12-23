'use client'
import React, { ButtonHTMLAttributes, useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss'
import Link from 'next/link';
import Imagetmp from "@@/images/image.png";
import Image from 'next/image';
import { IPizza } from '../interfaces';
import { ROUTING } from '../routing';

interface ICard {
  data: IPizza;
  currency:string,
}

const Card = ({
  data,
  currency,
}: ICard) => {
  const [amount, setAmount] = useState(data.amount || 0);
  const setNewAmount = (newAmount: number) => {
    addToBasket(data.id, newAmount);
    console.log('sdasdasdasd');
    setAmount(newAmount);
  };

  const addToBasket = (pizzaId: number, newAmount: number) => {
    try {
      const savedBasket = localStorage.getItem('basket');
      const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : [];
      
      const existingIndex = currentBasket.findIndex(item => item.id === pizzaId);
      
      if (newAmount <= 0) {
        if (existingIndex !== -1) {
          currentBasket.splice(existingIndex, 1);
        }
      } else {
        if (existingIndex !== -1) {
          currentBasket[existingIndex].amount = newAmount;
        } else {
          currentBasket.push({
            ...data,
            amount: newAmount
          });
        }
      }
      localStorage.setItem('basket', JSON.stringify(currentBasket));
      console.log(`Количество пиццы "${data.name}" обновлено: ${newAmount}`);
      
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    }
  };
  return (
  <div className={styles.container}>
    <div className={styles.content}>
    <Link className={data.image? styles.image_container:styles.image_container__noImg }
          href={ROUTING.pizza_info.href+'/'+ data.id}>
      <Image
        className={data.image?styles.articleImg: styles.articleNoImg}
        src={data.image||Imagetmp.src}
        width={400}
        height={300}
        alt={`картинка`}
      />
    </Link>
  
      <button 
          onClick={() => {
          setNewAmount(amount+ (amount==0?1:-1));
      }}
        className={cn(styles.addButton, (amount ==0)&&styles.addButton__add)}
        title={amount==0?"Добавить в корзину":"Удалить из корзины"}
      >
       <span>{amount!=0&&amount}</span> {amount ==0?'+':'-'}
      </button>
    
    <div className={styles.name_line}>
       <Link href={ROUTING.pizza_info.href+'/'+ data.id}>
        {data.name}
        </Link>
    </div>
    <div className={styles.cost_line}>
      <div className={cn(styles.def_price, data.sale && styles.def_price__saled)}>
        {data.cost + currency}
      </div>
      {data.sale && <div className={styles.sale}>{data.sale + currency}</div>}
    </div>
    </div>
  </div>)
};

export default Card;