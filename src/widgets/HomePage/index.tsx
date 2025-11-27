import {pizzas} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import styles from './styles.module.scss';
import Card from '@/shared/Card';
import Link from 'next/link';
import Cart from '@@/icons/cart.svg';
import Triangle from '@@/icons/Triangle.svg'

export default function HomePage() {
 const pizzas_list:IPizza[] = pizzas;
 const last_location = ' -> '+'home'

  return (
    <div className={styles.container}>
      <div className={styles.location_line}>
        <Link href={'/selectLocation'} className={styles.location}>
          <p className={styles.last_location_line}>{`Deliver to${last_location||''}`}</p>
          <p className={styles.location_choose_line}>Select Your Location <Triangle/></p>
        </Link>
        <Link className={styles.cart} href={'/basket'}>
          <Cart/>
        </Link>
      </div>

      <ul className={styles.menu}>
        {pizzas_list.map((pizza: IPizza, i) => (
          <li  key={i}><Card name={pizza.name} cost={pizza.cost} currency="р" sale={pizza.sale}/></li>
      ))} 
     </ul>
    </div>
    
  )
}
