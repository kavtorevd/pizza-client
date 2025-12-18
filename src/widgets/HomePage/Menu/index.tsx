'use client'
import {pizzas} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { useEffect, useState } from 'react';
import { ROUTING } from '@/shared/routing';
import Link from 'next/link';



export default function Menu(filter: {filter?:string}) {
  const [pizzas_list, setPizzas_list] = useState<IPizza[]>();


 const handleAddToCart = (pizza: IPizza) => {
    const savedBasket = localStorage.getItem('basket');
    const currentBasket: IPizza[] = savedBasket ? JSON.parse(savedBasket) : [];
    const existingIndex = currentBasket.findIndex(item => item.id === pizza.id);
    
    if (existingIndex !== -1) {
      currentBasket[existingIndex].amount = (currentBasket[existingIndex].amount || 1) + 1;
    } else {
      currentBasket.push({
        ...pizza,
        amount: 1
      });
    }
    localStorage.setItem('basket', JSON.stringify(currentBasket));
    console.log(`Пицца "${pizza.name}" добавлена в корзину  ${pizza.id}`);
  };



  useEffect(() => {
    setPizzas_list(pizzas);
  }, []);

  if (pizzas_list==undefined)
    return (<div className={styles.loading}><Loading/></div>)
  return (
      <ul className={styles.menu}>
        {pizzas_list.map((pizza: IPizza, i:number) => (
          <li  key={i} >
            <Link href={ROUTING.pizza_info.href+'/'+ pizza.id}>
                <Card name={pizza.name} cost={pizza.cost} currency="р"
              sale={pizza.sale}  onAddToCart={() => handleAddToCart(pizza)}/>
            </Link>
          </li>
      ))} 
     </ul>
  )
}

