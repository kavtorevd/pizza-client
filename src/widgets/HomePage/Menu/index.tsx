'use client'
import {pizzas} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { useEffect, useState } from 'react';



export default function Menu(filter: {filter?:string}) {
  const [pizzas_list, setPizzas_list] = useState<IPizza[]>();


  useEffect(() => {
    setPizzas_list(pizzas);
  }, []);

  if (pizzas_list==undefined)
    return (<div className={styles.loading}><Loading/></div>)
  return (
      <ul className={styles.menu}>
        {pizzas_list.map((pizza: IPizza, i:number) => (
          <li  key={i}><Card name={pizza.name} cost={pizza.cost} currency="р" sale={pizza.sale}/></li>
      ))} 
     </ul>
  )
}

