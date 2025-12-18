'use client'
import {pizzas} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Card from '@/shared/Card';
import Link from 'next/link';
import Cart from '@@/icons/cart.svg';
import Triangle from '@@/icons/Triangle.svg'
import { ROUTING } from '@/shared/routing';
import Menu from './Menu';
import { useEffect, useState } from 'react';

export default function HomePage() {
 const pizzas_list:IPizza[] = pizzas;
 const [last_location, setLastLocation] = useState<string>('выбрать место');
 
 
 useEffect(() => {
   const item = localStorage.getItem('selectedLocation');
   const location = item? JSON.parse(item).address : 'выбрать место';
    setLastLocation(location)
  }, []);



  return (
    <div className={styles.container}>
      <div className={styles.location_line}>
        <Link href={ROUTING.select_location_page.href} className={styles.location}>
          <p className={styles.last_location_line}>
            Deliver to → 
           <span>{last_location}</span>
           </p>
          <p className={styles.location_choose_line}>Выбрать точку доставки<Triangle/></p>
        </Link>
        <Link className={styles.cart} href={ROUTING.basket.href}>
          <Cart/>
        </Link>
      </div>
      <Menu/>
    </div>
    
  )
}
