'use client'
import {basket} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import BasketCard from '@/shared/BasketCard';


export default function BasketPage() {
  const basket_list:IPizza[] = basket;
  const changeAmount = (id:number, new_amount:number) =>{
    basket_list[id].amount = new_amount;
    console.log(new_amount)
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        My Basket
      </h2>
      <Link className={styles.arrow} href={'/home'}>
        <Arrow/>
      </Link>
      <ul className={styles.menu}>
       {basket_list.map((pizza:IPizza, i) => (
          <li key={i} className={styles.locationItem}>
            <BasketCard name={pizza.name} cost={pizza.cost} amount={pizza.amount||0} currency='р' changeAmount={changeAmount} id={i}/>
          </li>
        ))}
        </ul>

    </div>
    
  )
}
