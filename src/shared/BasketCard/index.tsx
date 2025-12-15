import React, { useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss'
import Link from 'next/link';
import Imagetmp from "@@/images/image.png";
import Image from 'next/image';

interface ICard {
  name: string;
  image?: string | undefined;
  href?: string | undefined;
  cost: number;
  sale?: number | undefined;
  currency: string;
  amount: number;
  changeAmount: (new_amount: number) => void;
  removeItem: () => void;
}

const BasketCard = ({
  name,
  image,
  href,
  cost,
  sale,
  currency,
  changeAmount,
  amount,
  removeItem,
}: ICard) => {

  const decrease = () => {
    if (amount - 1 <= 0) {
      removeItem();
    } else {
      changeAmount(amount - 1);
    }
  };
  
  const increase = () => {
    console.log('Increase:', amount);
    changeAmount(amount + 1);
  };
  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <div className={styles.image_container}>
          <Image
            className={styles.articleImg}
            src={image || Imagetmp.src}
            width={400}
            height={300}
            alt={`${name} image`}
            priority
          />
        </div>
        
        <div className={styles.text_content}>
          <div className={styles.name_line}>{name}</div>
            <div className={styles.cost_line}>
              <div className={cn(styles.def_price, sale && styles.def_price__saled)}>
                {cost + currency}
              </div>
              {sale && <div className={styles.sale}>{sale + currency}</div>}
          </div>
        </div>
        <div className={styles.amount_line}>
            <button 
              className={styles.button} 
              onClick={decrease}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <div className={styles.amount}>{amount}</div>
            <button 
              className={styles.button} 
              onClick={increase}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
      </div>
      <button 
          className={styles.remove_button} 
          title="Удалить" 
          onClick={removeItem}
          aria-label="Удалить товар"
        >
          ×
        </button>
    </div>
  );
};

export default BasketCard;