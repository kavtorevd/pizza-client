'use client'
import {pizzas} from '@/tmp/some_tmp_pizza';
import {IApiGetPizzas, IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { useEffect, useState } from 'react';
import { ROUTING } from '@/shared/routing';
import Link from 'next/link';
import getPizzas from '@/shared/api/getPizzas';

export default function Menu({filter}: {filter?:string}) {
  const [pizzas_list, setPizzas_list] = useState<IPizza[]>();
  const [filtered_pizzas_list, setFilteredPizzas] = useState<IPizza[]>([]);
  const [error_message, setError_message] = useState<string>();
  
  const fetchFunction = async () => {
    const res = await getPizzas();
    if (typeof res == "string") {
      setError_message(res);
      return;
    }

    const savedBasket = JSON.parse(localStorage.getItem('basket') || '[]');
    const basketMap = new Map(savedBasket.map((item: IPizza) => [item.id, item.amount || 0]));
    const pizzasWithAmount = res.results.map(pizza => ({
      ...pizza,
      amount: basketMap.get(pizza.id) || 0
    }));

    setPizzas_list(pizzasWithAmount);
  };

  const apply_filter =() =>{
    if (!pizzas_list) return;
    
    let filteredPizzas = pizzas_list;
    if (filter?.trim()){
        const searchTerm = filter.toLowerCase();
        filteredPizzas = pizzas_list.filter(pizza => 
          pizza.name.toLowerCase().includes(searchTerm) ||
          pizza.description?.toLowerCase().includes(searchTerm)
        );
    }
    setFilteredPizzas(filteredPizzas);
  };

  useEffect(() => {
    fetchFunction();
  }, []);

  useEffect(() => {
    apply_filter();
  }, [filter, pizzas_list]);

  if (error_message)
    return (<div className={styles.textMessage}>{error_message}</div>)
  if (pizzas_list==undefined)
    return (<div className={styles.loading}><Loading/></div>)
  if (filtered_pizzas_list.length==0)
    return (<div className={styles.textMessage}>Ничего не найдено :(</div>)
  return (
      <ul className={styles.menu}>
        {filtered_pizzas_list.map((pizza: IPizza, i:number) => (
          <li  key={i} >
            <Card data={pizza} currency="р"/>
          </li>
      ))} 
     </ul>
  )
}