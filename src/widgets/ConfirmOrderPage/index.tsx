'use client'
import {basket} from '@/tmp/some_tmp_pizza';
import {IOrder, IPizza, IOrderItem} from '@/shared/interfaces';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { ROUTING } from '@/shared/routing';
import { IMaskInput } from 'react-imask';
import {PLACEHOLDERS} from '@/shared/constants'
import submitOrder from '@/shared/api/submitOrder';
import styles from './styles.module.scss';
import cn from 'classnames';

export default function ConfirmOrderPage() {
  const [basketList, setBasketList] = useState<IPizza[]>();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!phone.trim()) {
    alert('Введите номер телефона');
    return;
  }
  if (!selectedLocation) {
    alert('Выберите адрес доставки');
    return;
  }
  if (!basketList || basketList.length === 0) {
    alert('Корзина пуста');
    return;
  }
  setIsSubmitting(true);
  try {
    const orderData:IOrder = {
      customer_phone: phone,
      delivery_address: selectedLocation.address,
      delivery_coordinates: `${selectedLocation.lat},${selectedLocation.lng}`,
      status: "pending",
      total_cost: totalAmount.toString(),
      items: basketList.map(item => (
        {
          pizza: item.id,
          pizza_name: item.name,
          quantity: item.amount||0,
          price: (item.cost - (item.sale||0)).toString()
        }
    ))
    };

    console.log('Отправляемые данные:', orderData);

    const result = await submitOrder(orderData);
    console.log('Заказ успешно создан:', result);
    alert('Заказ успешно оформлен!');
    
    // Очистка корзины после успешного заказа
    localStorage.removeItem('basket');
    setBasketList([]);
    setTotalAmount(0);
    
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
  } finally {
    setIsSubmitting(false);
  }
}
  
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation||''));
      } catch (error) {
        console.error('Ошибка чтения выбранного адреса:', error);
      }
    }

    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      try {
        const parsedBasket = JSON.parse(savedBasket);
        if (Array.isArray(parsedBasket) && parsedBasket.length > 0) {
          setBasketList(parsedBasket);
          calculateTotalAmount(parsedBasket);
          return;
        }
      } catch (error) {
        console.error('Ошибка парсинга корзины:', error);
      }
    }
    
    const initialBasket = basket.map((item, i) => ({
      ...item,
      amount: item.amount || 1,
      id: i, 
    }));
    
    localStorage.setItem('basket', JSON.stringify(initialBasket));
    setBasketList(initialBasket);
    calculateTotalAmount(initialBasket);
  }, []);

  // Функция для расчета общей суммы
  const calculateTotalAmount = (basketItems: IPizza[]) => {
    const total = basketItems.reduce((sum, item) => {
      return sum + ((item.cost - (item.sale||0) )* (item.amount || 1));
    }, 0);
    setTotalAmount(total);
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>
        Подтверждение заказа
      </h2>
      
      <Link className={styles.arrow} href={ROUTING.select_location_page.href}>
        <Arrow/>
      </Link>

      <h3 className={styles.cusNumber}>
        <span className={styles.num_tittle}>Ваш номер:</span>
        <IMaskInput
          mask="+7 (000) 000-00-00"
          value={phone}
          onAccept={setPhone}
          placeholder={PLACEHOLDERS.number_placeholder}
          id={'number-input'}
        />
      </h3>
      <h3 className={styles.totalAmount}>
        <span className={styles.num_tittle}>Общая сумма:</span>
        <span className={styles.totalValue}>{totalAmount} р</span>
      </h3>
  
      {selectedLocation ? (
        <h3 className={styles.selectedLocation}>
          <span className={styles.num_tittle}>Адрес доставки:</span>
          <span className={styles.locationAddress}>{selectedLocation.address}</span>
        </h3>
      ):
      <div className={styles.location_tittle}>
        Вы не указали адрес доставки, пожалуйста
        <Link href={ROUTING.select_location_page.href} >укажите адрес!</Link>
      </div>
      }
      
      {
        (basketList==undefined) ? <div className={styles.loading}><Loading/></div> :
        basketList.length === 0 ? (
          <p className={styles.loading}>Ваша корзина пуста</p>
        ) : (
          <ul className={styles.menu}>
            {basketList.map((pizza: IPizza) => (
              <li key={pizza.id} className={styles.menuItem}>
                <p className={styles.nameLine}>{pizza.name}</p>
                <p>{pizza.amount}шт</p>
                <p>{(pizza.cost - (pizza.sale||0))*(pizza.amount||0)}р</p>
              </li>
            ))}
          </ul>
        )
      }
      
      <div className={styles.submitContainer}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !basketList || basketList.length === 0 || !phone.trim() || !selectedLocation}
          className={cn(styles.submitButton, (!selectedLocation||!phone.trim())&&styles.deactiveSubmite)}>
          {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
        </Button>
      </div>
    </div>
  );
}