'use client'
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.scss';
import Link from 'next/link';
import Arrow from '@@/icons/Arrow.svg';
import Button from '@/shared/Button';
import { ROUTING } from '@/shared/routing';
import Loading from '@/shared/Loading';
import dynamic from 'next/dynamic';
import { IOrder, IOrderRoute } from '@/shared/interfaces';

const LeafletMap = dynamic(() => import('@/entities/LeafletMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Загрузка карты...</div>
});

// Координаты для движения курьера (Нижний Новгород)
const COURIER_PATH: [number, number][] = [
  [56.360839, 43.818192],
  [56.361139, 43.818752],
  [56.361768, 43.817709],
  [56.361793, 43.817506],
  [56.361956, 43.817231],
  [56.362011, 43.817204],
  [56.362105, 43.817123]
];

// Моковые данные
const MOCK_ORDER: IOrder = {
  id: 12345,
  customer_phone: '+7 (999) 123-45-67',
  delivery_address: 'ул. Ленина, д. 25, кв. 42, Нижний Новгород',
  delivery_coordinates: '56.362105,43.817123', // Последняя точка пути
  total_cost: '1250.50',
  status: 'preparing',
  status_display: 'Готовится',
  estimated_delivery_time: 30,
  created_at: '2024-01-15T14:30:00Z',
  updated_at: '2024-01-15T15:00:00Z',
  driver_name: 'Иван Петров',
  branch_address: 'ул. Тверская, д. 10',
  user_name: 'Анна Сидорова',
  items: [
    {
      pizza: 1,
      pizza_name: 'Пепперони',
      quantity: 2,
      price: '550.00'
    },
    {
      pizza: 3,
      pizza_name: 'Маргарита',
      quantity: 1,
      price: '450.00'
    },
    {
      pizza: 5,
      pizza_name: '4 сыра',
      quantity: 1,
      price: '650.00'
    }
  ]
};

export default function CourierTrackingPage() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const orderId = orderIdFromUrl || '12345';
  
  const [order, setOrder] = useState<IOrder>({...MOCK_ORDER, id: Number(orderId)});
  const [currentStatus, setCurrentStatus] = useState<'preparing' | 'ready' | 'on_way' | 'delivered'>('preparing');
  const [courierPosition, setCourierPosition] = useState<number>(0); // Индекс текущей позиции курьера
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // Время в секундах с начала отслеживания
  
  const timerRef = useRef<NodeJS.Timeout>();

  // Обновляем время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Автоматическое изменение статусов
  useEffect(() => {
    let statusTimer: NodeJS.Timeout;
    
    const updateStatus = () => {
      if (timeElapsed < 12) {
        // Первые 12 секунд: готовится
        if (currentStatus !== 'preparing') {
          setCurrentStatus('preparing');
          setOrder(prev => ({
            ...prev,
            status: 'preparing',
            status_display: 'Готовится',
            estimated_delivery_time: 30
          }));
        }
      } else if (timeElapsed < 24) {
        // Следующие 12 секунд: готов
        if (currentStatus !== 'ready') {
          setCurrentStatus('ready');
          setOrder(prev => ({
            ...prev,
            status: 'assigned',
            status_display: 'Готов к отправке',
            estimated_delivery_time: 25
          }));
        }
      } else if (timeElapsed < 60) {
        // Дальше: курьер в пути (36 секунд)
        if (currentStatus !== 'on_way') {
          setCurrentStatus('on_way');
          setOrder(prev => ({
            ...prev,
            status: 'on_way',
            status_display: 'Курьер в пути',
            estimated_delivery_time: 15
          }));
        }
        
        // Двигаем курьера каждые 3 секунды
        if (timeElapsed >= 24 && (timeElapsed - 24) % 3 === 0) {
          const newPosition = Math.min(
            Math.floor((timeElapsed - 24) / 3),
            COURIER_PATH.length - 1
          );
          
          if (newPosition !== courierPosition) {
            setCourierPosition(newPosition);
            
            // Когда дошли до конца пути, сразу переходим к доставке (без задержки)
            if (newPosition === COURIER_PATH.length - 1) {
              setCurrentStatus('delivered');
              setOrder(prev => ({
                ...prev,
                status: 'delivered',
                status_display: 'Доставлен',
                estimated_delivery_time: 0
              }));
            }
          }
        }
      } else {
        // После 60 секунд: доставлен
        if (currentStatus !== 'delivered') {
          setCurrentStatus('delivered');
          setOrder(prev => ({
            ...prev,
            status: 'delivered',
            status_display: 'Доставлен',
            estimated_delivery_time: 0
          }));
        }
      }
    };
    
    statusTimer = setTimeout(updateStatus, 100);
    
    return () => clearTimeout(statusTimer);
  }, [timeElapsed, currentStatus, courierPosition]);

  // Функция для получения иконки статуса
  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, string> = {
      'preparing': '👨‍🍳',
      'ready': '✅',
      'on_way': '🚗',
      'delivered': '🎉',
    };
    return iconMap[status] || '❓';
  };

  // Получаем текущие координаты курьера
  const getCourierCoords = (): [number, number] | null => {
    if (currentStatus === 'on_way' || currentStatus === 'delivered') {
      return COURIER_PATH[Math.min(courierPosition, COURIER_PATH.length - 1)];
    }
    return null;
  };

  // Получаем координаты доставки
  const getDeliveryCoords = (): [number, number] | null => {
    if (order.delivery_coordinates) {
      const [lat, lon] = order.delivery_coordinates.split(',').map(Number);
      return [lat, lon];
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loading />
          <p>Загрузка информации о заказе...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={ROUTING.home.href || '/'} className={styles.backButton}>
          <Arrow className={styles.arrowIcon} />
          <span>Назад</span>
        </Link>
        <h1 className={styles.title}>Местоположение курьера</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.mapSection}>
          <div className={styles.mapWrapper}>
            <LeafletMap 
              trackingMode={true}
              courierCoords={getCourierCoords()}
              deliveryCoords={getDeliveryCoords()}
              deliveryAddress={order.delivery_address}
              routeCoordinates={COURIER_PATH.slice(0, courierPosition + 1)}
              initialCoords={COURIER_PATH[0]}
            />
          </div>
          
          {/* Информация о статусе */}
          <div className={styles.statusInfo}>
            <div className={styles.statusMessage}>
              {currentStatus === 'preparing' && '🕐 Ваш заказ готовится...'}
              {currentStatus === 'ready' && '✅ Заказ готов! Ожидайте курьера...'}
              {currentStatus === 'on_way' && `🚗 Курьер в пути`}
              {currentStatus === 'delivered' && '🎉 Заказ доставлен! Приятного аппетита!'}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          {/* Детали заказа */}
          <div className={styles.orderDetails}>
            <h3>Детали заказа #{order.id}</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Адрес доставки:</span>
                <span className={styles.detailValue}>{order.delivery_address}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Телефон:</span>
                <span className={styles.detailValue}>{order.customer_phone}</span>
              </div>
              {order.branch_address && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Филиал:</span>
                  <span className={styles.detailValue}>{order.branch_address}</span>
                </div>
              )}
              {order.driver_name && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Курьер:</span>
                  <span className={styles.detailValue}>{order.driver_name}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Сумма:</span>
                <span className={styles.detailValue}>
                  {parseFloat(order.total_cost).toFixed(2)} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Список товаров */}
          {order.items && order.items.length > 0 && (
            <div className={styles.orderItems}>
              <h3>Состав заказа</h3>
              <ul className={styles.itemsList}>
                {order.items.map((item, index) => {
                  const itemTotal = parseFloat(item.price) * item.quantity;
                  return (
                    <li key={index} className={styles.item}>
                      <span className={styles.itemName}>{item.pizza_name}</span>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemQuantity}>×{item.quantity}</span>
                        <span className={styles.itemPrice}>
                          {itemTotal.toFixed(2)} ₽
                        </span>
                      </div>
                    </li>
                  );
                })}
                <li className={styles.totalItem}>
                  <span className={styles.totalLabel}>Итого:</span>
                  <span className={styles.totalValue}>
                    {parseFloat(order.total_cost).toFixed(2)} ₽
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Действия */}
          <div className={styles.actions}>
            <Link href={ROUTING.home.href}>
              <div className={styles.linkButton}>Вернуться на главную</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Индикатор статусов внизу страницы */}
      <div className={styles.statusIndicator}>
        <div className={styles.statusTimeline}>
          {/* Статус 1: Готовится */}
          <div className={styles.statusStep}>
            <div className={`${styles.statusCircle} ${currentStatus === 'preparing' ? styles.active : ''} ${['ready', 'on_way', 'delivered'].includes(currentStatus) ? styles.completed : ''}`}>
              <span className={styles.statusIcon}>👨‍🍳</span>
            </div>
            <span className={styles.statusLabel}>Готовится</span>
          </div>
          
          {/* Статус 2: Готов */}
          <div className={styles.statusStep}>
            <div className={`${styles.statusCircle} ${currentStatus === 'ready' ? styles.active : ''} ${['on_way', 'delivered'].includes(currentStatus) ? styles.completed : ''}`}>
              <span className={styles.statusIcon}>✅</span>
            </div>
            <span className={styles.statusLabel}>Готов</span>
          </div>
          
          {/* Статус 3: В пути */}
          <div className={styles.statusStep}>
            <div className={`${styles.statusCircle} ${currentStatus === 'on_way' ? styles.active : ''} ${currentStatus === 'delivered' ? styles.completed : ''}`}>
              <span className={styles.statusIcon}>🚗</span>
            </div>
            <span className={styles.statusLabel}>В пути</span>
            {currentStatus === 'on_way' && (
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${(courierPosition / (COURIER_PATH.length - 1)) * 100}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Статус 4: Доставлен */}
          <div className={styles.statusStep}>
            <div className={`${styles.statusCircle} ${currentStatus === 'delivered' ? styles.active : ''}`}>
              <span className={styles.statusIcon}>🎉</span>
            </div>
            <span className={styles.statusLabel}>Доставлен</span>
          </div>
        </div>
      </div>
    </div>
  );
}