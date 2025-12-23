
// import TrackOrderPage from "@/widgets/TrackOrderPage";

// const TrackOrder = () => <TrackOrderPage/>;

// export default TrackOrder;

/*
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Arrow from '@@/icons/Arrow.svg';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { IPizza } from '@/shared/interfaces';
import styles from './styles.module.scss';

export default function TrackOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<IPizza[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderStatus, setOrderStatus] = useState<'Готовится' | 'Приготовлен' | 'Курьер в пути' | 'Доставлено'>('Готовится');
  const [estimatedTime, setEstimatedTime] = useState('30-40 минут');
  const [courier, setCourier] = useState({
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    position: '56.326887,44.005986'
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Загрузка данных из localStorage
    const loadData = () => {
      try {
        // Загружаем корзину
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
          const parsedBasket: IPizza[] = JSON.parse(savedBasket);
          setOrderDetails(parsedBasket);
          
          const total = parsedBasket.reduce((sum, item) => {
            return sum + (item.cost * (item.amount || 1));
          }, 0);
          setTotalAmount(total);
        }

        // Загружаем адрес
        const savedLocation = localStorage.getItem('selectedLocation');
        if (savedLocation) {
          const location = JSON.parse(savedLocation);
          setDeliveryAddress(location.address);
        }

        // Симуляция процесса заказа
        const timer1 = setTimeout(() => {
          setOrderStatus('Приготовлен');
          setEstimatedTime('20-30 минут');
          setProgress(25);
        }, 3000);

        const timer2 = setTimeout(() => {
          setOrderStatus('Курьер в пути');
          setEstimatedTime('15-20 минут');
          setProgress(50);
        }, 6000);

        const timer3 = setTimeout(() => {
          setProgress(75);
        }, 9000);

        const timer4 = setTimeout(() => {
          setOrderStatus('Доставлено');
          setEstimatedTime('Доставлено!');
          setProgress(100);
        }, 12000);

        setLoading(false);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
        };
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loading />
          <p>Загружаем информацию о заказе...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Готовится': return '#FFA500';
      case 'Приготовлен': return '#4CAF50';
      case 'Курьер в пути': return '#2196F3';
      case 'Доставлено': return '#8BC34A';
      default: return '#666';
    }
  };

  return (
    <div className={styles.container}>
      {/* Заголовок и кнопка назад }
      <div className={styles.header}>
        <Link className={styles.arrow} href="/">
          <Arrow />
        </Link>
        <h2 className={styles.title}>Местоположение курьера</h2>
      </div>

      {/* Упрощенная карта }
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#f5f5f5',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              background: '#2196F3',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              animation: 'pulse 2s infinite'
            }}>
              🛵
            </div>
            <p style={{ marginTop: '200px', color: '#666' }}>Карта с местоположением курьера</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Реальный трекинг будет доступен после подключения бэкенда</p>
          </div>
        </div>
        
        <div className={styles.courierInfo}>
          <div className={styles.courierInfoItem}>
            <span className={styles.courierLabel}>Курьер:</span>
            <span className={styles.courierName}>{courier.name}</span>
          </div>
          <div className={styles.courierInfoItem}>
            <span className={styles.courierLabel}>Телефон:</span>
            <span className={styles.courierPhone}>{courier.phone}</span>
          </div>
          <div className={styles.courierInfoItem}>
            <span className={styles.courierLabel}>Прогресс:</span>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBarFill}
                style={{ width: `${progress}%` }}
              />
              <span className={styles.progressText}>{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Статус заказа }
      <div className={styles.statusSection}>
        <h3 className={styles.sectionTitle}>Статус заказа</h3>
        <div 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(orderStatus) }}
        >
          {orderStatus}
        </div>
        
        {/* Упрощенный прогресс бар }
        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].map((status, index) => (
              <div key={status} className={styles.progressStep}>
                <div 
                  className={`${styles.stepDot} ${
                    index <= ['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].indexOf(orderStatus) 
                      ? styles.active 
                      : ''
                  }`}
                  style={index <= ['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].indexOf(orderStatus) 
                    ? { backgroundColor: getStatusColor(status) } 
                    : {}}
                />
                <span className={styles.stepLabel}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Адрес доставки }
      <div className={styles.deliveryAddress}>
        <h3 className={styles.sectionTitle}>Адрес доставки</h3>
        <p className={styles.addressText}>{deliveryAddress || 'Адрес не указан'}</p>
      </div>

      {/* Время доставки }
      <div className={styles.deliveryTime}>
        <h3 className={styles.sectionTitle}>Время доставки</h3>
        <p className={styles.timeText}>{estimatedTime}</p>
      </div>

      {/* Детали заказа }
      <div className={styles.orderDetails}>
        <h3 className={styles.sectionTitle}>Детали заказа</h3>
        
        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Общая сумма:</span>
            <span className={styles.totalValue}>{totalAmount} ₽</span>
          </div>
        </div>

        {orderDetails.length > 0 ? (
          <div className={styles.orderItems}>
            {orderDetails.map((pizza: IPizza, index) => (
              <div key={pizza.id || index} className={styles.orderItem}>
                <Card 
                  name={pizza.name} 
                  image={pizza.image}
                  cost={pizza.cost} 
                  sale={pizza.amount} 
                  currency='₽' 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyOrder}>
            Нет информации о заказе. Добавьте товары в корзину и оформите заказ.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
*/
'use client'
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Arrow from '@@/icons/Arrow.svg';
import Card from '@/shared/Card';
import Loading from '@/shared/Loading';
import { IPizza } from '@/shared/interfaces';
import { OrderTrackingService, IOrderTracking } from '@/shared/api/trackOrder';
import dynamic from 'next/dynamic';
import styles from './styles.module.scss';
import { ROUTING } from '@/shared/routing';

// Динамически импортируем карту
const CourierMap = dynamic(() => import('@/widgets/TrackOrderPage'), {
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder}>Загружаем карту...</div>
});

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<IOrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Функция для загрузки данных
  const fetchTrackingData = useCallback(async () => {
    if (!orderId) return;

    try {
      const result = await OrderTrackingService.getOrderTracking(parseInt(orderId));

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        setTrackingData(result.data);
        setError(null);
        setLastUpdate(new Date());

        // Если заказ доставлен или отменен, останавливаем polling
        if (result.data.order.status === 'delivered' || result.data.order.status === 'cancelled') {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching tracking data:', err);
    }
  }, [orderId, pollingInterval]);

  // Первоначальная загрузка
  useEffect(() => {
    if (!orderId) {
      // Пробуем получить orderId из localStorage
      const savedOrderId = localStorage.getItem('lastOrderId');
      if (savedOrderId) {
        router.replace(`/track_order?orderId=${savedOrderId}`);
      } else {
        setError('Заказ не найден. Оформите новый заказ.');
        setLoading(false);
      }
      return;
    }

    // Сохраняем orderId
    localStorage.setItem('lastOrderId', orderId);
    fetchTrackingData().finally(() => setLoading(false));

    // Настраиваем polling каждые 15 секунд
    const interval = setInterval(() => {
      if (trackingData?.order.status !== 'delivered' && trackingData?.order.status !== 'cancelled') {
        fetchTrackingData();
      }
    }, 15000);

    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, router]);

  // Симуляция движения курьера (для демо, когда нет реального обновления координат)
  useEffect(() => {
    if (!trackingData?.courier || !trackingData.route?.coordinates) return;

    const interval = setInterval(() => {
      if (trackingData.order.status === 'on_way') {
        setTrackingData(prev => {
          if (!prev || !prev.courier || !prev.route) return prev;

          // Обновляем позицию курьера (симуляция)
          const newCoords = OrderTrackingService.parseCoordinates(prev.courier.coordinates);
          const routePoints = prev.route.coordinates;

          if (routePoints.length > 1) {
            // Находим ближайшую точку
            const currentIndex = routePoints.findIndex(point =>
              Math.abs(point[0] - newCoords[0]) < 0.001 &&
              Math.abs(point[1] - newCoords[1]) < 0.001
            );

            if (currentIndex < routePoints.length - 1) {
              const nextPoint = routePoints[currentIndex + 1];
              // Двигаемся на 10% к следующей точке
              const newLat = newCoords[0] + (nextPoint[0] - newCoords[0]) * 0.1;
              const newLng = newCoords[1] + (nextPoint[1] - newCoords[1]) * 0.1;

              const updatedCourier = {
                ...prev.courier,
                coordinates: `${newLat},${newLng}`
              };

              return {
                ...prev,
                courier: updatedCourier
              };
            }
          }

          return prev;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [trackingData?.order.status, trackingData?.courier, trackingData?.route]);

  // Форматируем данные для карты
  const getMapProps = () => {
    if (!trackingData || !trackingData.branch || !trackingData.order.delivery_coordinates) {
      return null;
    }

    try {
      const restaurantPosition = OrderTrackingService.parseCoordinates(trackingData.branch.coordinates);
      const deliveryPosition = OrderTrackingService.parseCoordinates(trackingData.order.delivery_coordinates);

      let courierPosition = restaurantPosition;
      if (trackingData.courier) {
        courierPosition = OrderTrackingService.parseCoordinates(trackingData.courier.coordinates);
      }

      return {
        routeCoordinates: trackingData.route?.coordinates || [],
        restaurantPosition: restaurantPosition as [number, number],
        deliveryPosition: deliveryPosition as [number, number],
        courierPosition: courierPosition as [number, number],
        courierName: trackingData.courier?.name || 'Ожидается курьер',
        courierPhone: trackingData.courier?.phone_number || '+7 (999) 000-00-00',
      };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  };

  // Функция для обновления вручную
  const handleRefresh = async () => {
    setLoading(true);
    await fetchTrackingData();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loading />
          <p>Загружаем информацию о заказе...</p>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link className={styles.arrow} href="/">
            <Arrow />
          </Link>
          <h2 className={styles.title}>Отслеживание заказа</h2>
        </div>

        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>❌</div>
          <h3 className={styles.errorTitle}>Произошла ошибка</h3>
          <p className={styles.errorMessage}>{error || 'Не удалось загрузить данные заказа'}</p>
          <button
            className={styles.retryButton}
            onClick={handleRefresh}
          >
            Попробовать снова
          </button>
          <Link href="/" className={styles.homeButton}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const { order, branch, courier, route, items } = trackingData;
  const mapProps = getMapProps();

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <div className={styles.header}>
        <Link className={styles.arrow} href="/">
          <Arrow />
        </Link>
        <h2 className={styles.title}>Отслеживание заказа #{order.id}</h2>
        <button
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={loading}
        >
          ⟳
        </button>
      </div>

      {/* Карта */}
      {mapProps ? (
        <div className={styles.mapContainer}>
          <CourierMap {...mapProps} />

          <div className={styles.courierInfo}>
            {courier ? (
              <>
                <div className={styles.courierInfoItem}>
                  <span className={styles.courierLabel}>Курьер:</span>
                  <span className={styles.courierName}>{courier.name}</span>
                </div>
                <div className={styles.courierInfoItem}>
                  <span className={styles.courierLabel}>Телефон:</span>
                  <span className={styles.courierPhone}>{courier.phone_number}</span>
                </div>
                <div className={styles.courierInfoItem}>
                  <span className={styles.courierLabel}>Статус:</span>
                  <span className={styles.courierStatus}>
                    {courier.status === 'free' ? 'Свободен' :
                      courier.status === 'busy' ? 'Занят' : 'Не в сети'}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.courierInfoItem}>
                <span className={styles.courierLabel}>Курьер:</span>
                <span className={styles.courierName}>Ожидается назначение</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.mapPlaceholder}>
          <div className={styles.placeholderContent}>
            <div className={styles.pulsingIcon}>🗺️</div>
            <p>Загружаем карту маршрута...</p>
          </div>
        </div>
      )}

      {/* Статус заказа */}
      <div className={styles.statusSection}>
        <div className={styles.statusHeader}>
          <h3 className={styles.sectionTitle}>Статус заказа</h3>
          <div
            className={styles.statusBadge}
            style={{ backgroundColor: OrderTrackingService.getStatusColor(order.status) }}
          >
            {OrderTrackingService.formatStatus(order.status)}
          </div>
        </div>

        {/* Прогресс бар */}
        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {OrderTrackingService.getStatusSteps().map((status, index) => {
              const isActive = index <= OrderTrackingService.getStatusIndex(order.status);
              const statusKey = ['pending', 'accepted', 'preparing', 'assigned', 'on_way', 'delivered'][index];

              return (
                <div key={status} className={styles.progressStep}>
                  <div
                    className={`${styles.stepDot} ${isActive ? styles.active : ''}`}
                    style={isActive ? {
                      backgroundColor: OrderTrackingService.getStatusColor(statusKey)
                    } : {}}
                  />
                  <span className={styles.stepLabel}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Информация о доставке */}
      <div className={styles.deliveryInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Адрес доставки:</span>
          <span className={styles.infoValue}>{order.delivery_address}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Время доставки:</span>
          <span className={styles.infoValue}>
            {order.estimated_delivery_time ? `~${order.estimated_delivery_time} мин` : 'Рассчитывается...'}
          </span>
        </div>
        {branch && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Филиал:</span>
            <span className={styles.infoValue}>{branch.number} ({branch.address})</span>
          </div>
        )}
        {route && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Расстояние:</span>
            <span className={styles.infoValue}>
              {(route.distance / 1000).toFixed(1)} км ({route.duration_minutes} мин)
            </span>
          </div>
        )}
      </div>

      {/* Детали заказа */}
      <div className={styles.orderDetails}>
        <h3 className={styles.sectionTitle}>Детали заказа</h3>

        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Номер заказа:</span>
            <span className={styles.orderNumber}>#{order.id}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Общая сумма:</span>
            <span className={styles.totalValue}>{parseFloat(order.total_cost).toFixed(2)} ₽</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Телефон:</span>
            <span className={styles.totalValue}>{order.customer_phone}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Дата заказа:</span>
            <span className={styles.totalValue}>
              {new Date(order.created_at).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>

        {items && items.length > 0 ? (
          <div className={styles.orderItems}>
            <h4 className={styles.itemsTitle}>Состав заказа:</h4>
            {items.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <Card
                  name={item.pizza.name}
                  image={item.pizza.image}
                  cost={parseFloat(item.price.toString())}
                  sale={item.quantity}
                  currency='₽'
                />
                <div className={styles.itemQuantity}>× {item.quantity}</div>
                <div className={styles.itemTotal}>
                  {parseFloat((parseFloat(item.price.toString()) * item.quantity).toFixed(2))} ₽
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyOrder}>
            Нет информации о составе заказа
          </p>
        )}
      </div>

      {/* Информация об обновлении */}
      <div className={styles.updateInfo}>
        <p className={styles.updateText}>
          Данные обновлены: {lastUpdate.toLocaleTimeString('ru-RU')}
        </p>
        <p className={styles.updateNote}>
          {order.status === 'on_way' ? 'Позиция курьера обновляется каждые 3 секунды' :
            order.status === 'delivered' ? 'Заказ доставлен' :
              order.status === 'cancelled' ? 'Заказ отменен' :
                'Статус обновляется каждые 15 секунд'}
        </p>
      </div>
      <Link className={styles.arrow} href={ROUTING.home.href}>
        <Arrow />
      </Link>
    </div>

  );
}