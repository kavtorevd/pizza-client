'use client'
import React, { useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss'
import Link from 'next/link';
import Imagetmp from "@@/images/image.png";
import Image from 'next/image';
import { IPizza } from '../interfaces';

interface ICard {
  data: IPizza;
  currency:string;
  removeItem: (id:number) => void;
  changeTotal:() => void;
}

const BasketCard = ({
  data,
  currency,
  removeItem,
  changeTotal
}: ICard) => {

  const [amount, setAmount] = useState(data.amount||1);
  
  const changeAmount = (newAmount: number) => {
    const savedBasket = localStorage.getItem('basket');
    const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : [];
    const existingIndex = currentBasket.findIndex(item => item.id === data.id);
    try{
      if (newAmount <= 0) {
        console.log('s+++++ '+ newAmount+' '+ data.id)
        if (existingIndex !== -1) {
          removeItem(data.id);
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
        changeTotal();
        setAmount(newAmount);
        console.log(`Количество пиццы "${data.name}" обновлено: ${newAmount}`);
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.image_container}>
          <Image
            className={styles.articleImg}
            src={data.image || Imagetmp.src}
            width={400}
            height={300}
            alt={`${data.name} image`}
            priority
          />
        </div>
        
        <div className={styles.text_content}>
          <div className={styles.name_line}>{data.name}</div>
          <div className={styles.cost_line}>
            <div className={cn(styles.def_price, data.sale && styles.def_price__saled)}>
              {data.cost + currency}
            </div>
            {data.sale && <div className={styles.sale}>{data.sale + currency}</div>}
          </div>
        </div>

        <div className={styles.amount_line}>
           {(amount>1)&&
              <div className={styles.multCostline}>
                Общее: {amount*(data.cost - (data.sale||0))}{currency}</div>}
        <div className={styles.changeAmountLine}>
            <button 
              className={styles.button} 
              onClick={()=> {if (amount>1) changeAmount(amount-1); else  removeItem(data.id);}}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <div className={styles.amount}>{amount}</div>
            <button 
              className={styles.button} 
              onClick={()=> changeAmount(amount+1)}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
          </div>
      </div>
      <button 
          className={styles.remove_button} 
          title="Удалить" 
          onClick={()=>removeItem(data.id)}
          aria-label="Удалить товар"
        >
          ×
        </button>
    </div>
  );
};

export default BasketCard;