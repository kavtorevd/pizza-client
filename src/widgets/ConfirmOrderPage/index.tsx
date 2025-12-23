// 'use client'
// import {basket} from '@/tmp/some_tmp_pizza';
// import {IPizza} from '@/shared/interfaces';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import Arrow from '@@/icons/Arrow.svg';
// import Button from '@/shared/Button';
// import Card from '@/shared/Card';
// import Loading from '@/shared/Loading';
// import { ROUTING } from '@/shared/routing';
// import { IMaskInput } from 'react-imask';
// import {PLACEHOLDERS} from '@/shared/constants'
// import submitOrder from '@/shared/api/submitOrder';
// import styles from './styles.module.scss';

// export default function ConfirmOrderPage() {
//   const [basketList, setBasketList] = useState<IPizza[]>();
//   const [selectedLocation, setSelectedLocation] = useState<any>(null);
//   const [phone, setPhone] = useState('');
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   // Проверяем обязательные поля
//   if (!phone.trim()) {
//     alert('Введите номер телефона');
//     return;
//   }
  
//   if (!selectedLocation) {
//     alert('Выберите адрес доставки');
//     return;
//   }
  
//   if (!basketList || basketList.length === 0) {
//     alert('Корзина пуста');
//     return;
//   }

//   setIsSubmitting(true);
  
//   try {
//     const orderData = {
//       customer_phone: phone,
//       delivery_address: selectedLocation.address,
//       delivery_coordinates: `${selectedLocation.lat},${selectedLocation.lng}`,
//       status: "pending",
//       items: basketList.map(item => ({
//         pizza: item.id || 0, 
//         quantity: item.amount || 1,
//       }))
//     };

//     console.log('Отправляемые данные:', orderData);

//     const result = await submitOrder(orderData);
//     console.log('Заказ успешно создан:', result);
//     alert('Заказ успешно оформлен!');
    
//     // Очистка корзины после успешного заказа
//     localStorage.removeItem('basket');
//     setBasketList([]);
//     setTotalAmount(0);
    
//   } catch (error) {
//     console.error('Ошибка при отправке заказа:', error);
//     alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
//   } finally {
//     setIsSubmitting(false);
//   }
// }
  
//   useEffect(() => {
//     // Читаем выбранный адрес
//     const savedLocation = localStorage.getItem('selectedLocation');
//     if (savedLocation) {
//       try {
//         setSelectedLocation(JSON.parse(savedLocation));
//       } catch (error) {
//         console.error('Ошибка чтения выбранного адреса:', error);
//       }
//     }

//     const savedBasket = localStorage.getItem('basket');
//     if (savedBasket) {
//       try {
//         const parsedBasket = JSON.parse(savedBasket);
//         if (Array.isArray(parsedBasket) && parsedBasket.length > 0) {
//           setBasketList(parsedBasket);
//           calculateTotalAmount(parsedBasket);
//           return;
//         }
//       } catch (error) {
//         console.error('Ошибка парсинга корзины:', error);
//       }
//     }
    
//     const initialBasket = basket.map((item, i) => ({
//       ...item,
//       amount: item.amount || 1,
//       id: i, 
//     }));
    
//     localStorage.setItem('basket', JSON.stringify(initialBasket));
//     setBasketList(initialBasket);
//     calculateTotalAmount(initialBasket);
//   }, []);

//   // Функция для расчета общей суммы
//   const calculateTotalAmount = (basketItems: IPizza[]) => {
//     const total = basketItems.reduce((sum, item) => {
//       return sum + (item.cost * (item.amount || 1));
//     }, 0);
//     setTotalAmount(total);
//   };
  
//   return (
//     <div className={styles.container}>
//       <h2 className={styles.tittle}>
//         Подтверждение заказа
//       </h2>
      
//       <Link className={styles.arrow} href={ROUTING.select_location_page.href}>
//         <Arrow/>
//       </Link>

//       <h3 className={styles.cusNumber}>
//         <span className={styles.num_tittle}>Ваш номер:</span>
//         <IMaskInput
//           mask="+7 (000) 000-00-00"
//           value={phone}
//           onAccept={setPhone}
//           placeholder={PLACEHOLDERS.number_placeholder}
//           id={'number-input'}
//         />
//       </h3>
//       <h3 className={styles.totalAmount}>
//         <span className={styles.num_tittle}>Общая сумма:</span>
//         <span className={styles.totalValue}>{totalAmount} р</span>
//       </h3>
  
//       {selectedLocation && (
//         <h3 className={styles.selectedLocation}>
//           <span className={styles.num_tittle}>Адрес доставки:</span>
//           <span className={styles.locationAddress}>{selectedLocation.address}</span>
//         </h3>
//       )}
      
//       {
//         (basketList==undefined) ? <div className={styles.loading}><Loading/></div> :
//         basketList.length === 0 ? (
//           <p className={styles.loading}>Ваша корзина пуста</p>
//         ) : (
//           <ul className={styles.menu}>
//             {basketList.map((pizza: IPizza) => (
//               <li key={pizza.id} className={styles.locationItem}>
//                 <Card 
//                   name={pizza.name} 
//                   image={pizza.image}
//                   cost={pizza.cost} 
//                   sale={pizza.amount} 
//                   currency='р' 
//                 />
//               </li>
//             ))}
//           </ul>
//         )
//       }
      
//       <div className={styles.submitContainer}>
//         <Button
//           onClick={handleSubmit}
//           disabled={isSubmitting || !basketList || basketList.length === 0 || !phone.trim() || !selectedLocation}
//           className={styles.submitButton}
//         >
//           {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
//         </Button>
//       </div>
//     </div>
//   );
// }


'use client'
import {basket} from '@/tmp/some_tmp_pizza';
import {IPizza} from '@/shared/interfaces';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { ROUTING } from '@/shared/routing';
import { IMaskInput } from 'react-imask';
import {PLACEHOLDERS} from '@/shared/constants';
import submitOrder, { ISubmitOrderResponse } from '@/shared/api/submitOrder';
import styles from './styles.module.scss';

export default function ConfirmOrderPage() {
  const router = useRouter();
  const [basketList, setBasketList] = useState<IPizza[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Проверяем обязательные поля
    if (!phone.trim()) {
      setErrorMessage('Введите номер телефона');
      return;
    }
    
    if (!selectedLocation) {
      setErrorMessage('Выберите адрес доставки');
      return;
    }
    
    if (!basketList || basketList.length === 0) {
      setErrorMessage('Корзина пуста');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_phone: phone,
        delivery_address: selectedLocation.address,
        delivery_coordinates: `${selectedLocation.lat},${selectedLocation.lng}`,
        status: "pending",
        items: basketList.map(item => ({
          pizza: item.id || 0, 
          quantity: item.amount || 1,
        }))
      };

      console.log('Отправляемые данные:', orderData);

      const result: ISubmitOrderResponse = await submitOrder(orderData);
      console.log('Заказ успешно создан:', result);
      
      // Сохраняем ID созданного заказа
      setCreatedOrderId(result.id);
      localStorage.setItem('lastOrderId', result.id.toString());
      
      // Очистка корзины после успешного заказа
      localStorage.removeItem('basket');
      setBasketList([]);
      setTotalAmount(0);
      
      // Показываем сообщение об успехе
      setOrderSuccess(true);
      
      // Через 2 секунды перенаправляем на страницу отслеживания
      setTimeout(() => {
        // Используем обновленный routing с параметрами
        router.push(ROUTING.track_order(result.id).href);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Произошла ошибка при оформлении заказа. Попробуйте снова.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    // Читаем выбранный адрес
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        setSelectedLocation(locationData);
      } catch (error) {
        console.error('Ошибка чтения выбранного адреса:', error);
      }
    }

    // Читаем корзину
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
    
    // Если корзина пуста, используем тестовые данные
    const initialBasket = basket.map((item, i) => ({
      ...item,
      amount: item.amount || 1,
      id: i + 1, // Начинаем с 1
    }));
    
    localStorage.setItem('basket', JSON.stringify(initialBasket));
    setBasketList(initialBasket);
    calculateTotalAmount(initialBasket);
  }, []);

  // Функция для расчета общей суммы
  const calculateTotalAmount = (basketItems: IPizza[]) => {
    const total = basketItems.reduce((sum, item) => {
      return sum + (item.cost * (item.amount || 1));
    }, 0);
    setTotalAmount(total);
  };

  // Если заказ успешно создан, показываем сообщение
  if (orderSuccess && createdOrderId) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Заказ успешно оформлен!</h2>
          <p className={styles.successMessage}>
            Номер вашего заказа: <strong>#{createdOrderId}</strong>
          </p>
          <p className={styles.redirectMessage}>
            Через 2 секунды вы будете перенаправлены на страницу отслеживания...
          </p>
          <Link 
            href={ROUTING.track_order(createdOrderId).href} 
            className={styles.trackButton}
          >
            Перейти к отслеживанию
          </Link>
          <Link href={ROUTING.home.href} className={styles.homeButton}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <Link className={styles.arrow} href={ROUTING.select_location_page.href}>
        <Arrow/>
      </Link>
      
      <h2 className={styles.tittle}>
        Подтверждение заказа
      </h2>

      {errorMessage && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>❌</div>
          <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
      )}
      
      <h3 className={styles.cusNumber}>
        <span className={styles.num_tittle}>Ваш номер:</span>
        <IMaskInput
          mask="+7 (000) 000-00-00"
          value={phone}
          onAccept={setPhone}
          placeholder={PLACEHOLDERS.number_placeholder}
          id={'number-input'}
          className={styles.phoneInput}
        />
      </h3>
      
      <h3 className={styles.totalAmount}>
        <span className={styles.num_tittle}>Общая сумма:</span>
        <span className={styles.totalValue}>{totalAmount} ₽</span>
      </h3>
  
      {selectedLocation && (
        <div className={styles.locationContainer}>
          <h3 className={styles.selectedLocation}>
            <span className={styles.num_tittle}>Адрес доставки:</span>
            <span className={styles.locationAddress}>{selectedLocation.address}</span>
          </h3>
          <Link href={ROUTING.select_location_page.href} className={styles.changeAddress}>
            Изменить адрес
          </Link>
        </div>
      )}
      
      {basketList.length === 0 ? (
        <div className={styles.emptyBasket}>
          <p>Ваша корзина пуста</p>
          <Link href={ROUTING.home.href} className={styles.shopButton}>
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div className={styles.orderItems}>
          <h3 className={styles.itemsTitle}>Состав заказа:</h3>
          <ul className={styles.menu}>
            {basketList.map((pizza: IPizza) => (
              <li key={pizza.id} className={styles.locationItem}>
                <Card 
                  name={pizza.name} 
                  image={pizza.image}
                  cost={pizza.cost} 
                  sale={pizza.amount} 
                  currency='₽' 
                />
                <div className={styles.itemQuantity}>× {pizza.amount || 1}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.submitContainer}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || basketList.length === 0 || !phone.trim() || !selectedLocation}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
        </Button>
        <p className={styles.orderNote}>
          После оформления заказа вы сможете отслеживать его статус в реальном времени
        </p>
      </div>
    </div>
  );
}